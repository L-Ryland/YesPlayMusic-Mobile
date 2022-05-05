import {fetchAudioSourceWithReactQuery, fetchTracksWithReactQuery,} from '@/renderer/hooks/useTracks'
import {fetchPersonalFMWithReactQuery} from '@/renderer/hooks/usePersonalFM'
import {fmTrash} from '@/renderer/api/personalFM'
import {cacheAudio} from '@/renderer/api/yesplaymusic'
import {clamp, shuffle} from 'lodash-es'
import axios from 'axios'
import {resizeImage} from './common'
import {fetchPlaylistWithReactQuery} from '@/renderer/hooks/usePlaylist'
import {fetchAlbumWithReactQuery} from '@/renderer/hooks/useAlbum'
import TrackPlayer, {Capability, State, Track as DefaultTrack, RepeatMode} from "react-native-track-player";
import {ToastAndroid} from "react-native";
import tr from "@/locale/lang/tr";


type TrackID = number

export enum TrackListSourceType {
  Album = 'album',
  Playlist = 'playlist',
}

export interface TrackListSource {
  type: TrackListSourceType,
  id: number,
}
export interface Track extends DefaultTrack {
  id?: number
}

export enum Mode {
  TrackList = 'trackList',
  FM = 'fm',
}



const PLAY_PAUSE_FADE_DURATION = 200
// let _howler = new Howl({src: [''], format: ['mp3', 'flac']})
export class Player {
  private _track: Track | undefined;
  private _trackIndex: number = 0
  // private _progress: number = 0
  // private _progressInterval: ReturnType<typeof setInterval> | undefined
  // private _volume: number = 1 // 0 to 1
  // private _repeatMode: RepeatMode = RepeatMode.Off
  private _shuffle: boolean = false
  private _trackListSource: TrackListSource | null = null
  private _player!: typeof TrackPlayer;
  private mode = Mode.TrackList;


  state: State = State.Connecting
  // mode: Mode = Mode.TrackList
  trackList: Track[] = [];
  fmTrackList: Track[] = [];
  shuffledList: Track[] = []
  fmTrack: Track | undefined;

  constructor() {
    this.init().then();
    this._player = TrackPlayer;
  }
  // init(params: { [key: string]: any }) {
  async init() {
    // if (params._track) this._track = params._track
    // if (params._trackIndex) this._trackIndex = params._trackIndex
    // if (params._volume) this._volume = params._volume
    // if (params._repeatMode) this._repeatMode = params._repeatMode
    // if (params._shuffle) this._shuffle = params._shuffle
    // if (params.state) this.trackList = params.state
    // if (params.mode) this.mode = params.mode
    // if (params.trackList) this.trackList = params.trackList
    // if (params._trackListSource) this._trackListSource = params._trackListSource
    // if (params.fmTrackList) this.fmTrackList = params.fmTrackList
    // if (params.shuffleList) this.shuffleList = params.shuffleList
    // if (params.fmTrack) this.fmTrack = params.fmTrack
    //
    // this.state = State.Ready
    // this._playAudio(false) // just load the audio, not play
    // this._initFM()
    //
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      return;
    }
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious
      ]
    });
    // return TrackPlayer;
  }

  // get howler() {
  //   return _howler
  // }


  /**
   * Get prev track index
   */
  // get _prevTrackIndex(): number | undefined {
  //   switch (this.repeatMode) {
  //     case RepeatMode.One:
  //       return this._trackIndex
  //     case RepeatMode.Off:
  //       if (this._trackIndex === 0) return 0
  //       return this._trackIndex - 1
  //     case RepeatMode.On:
  //       if (this._trackIndex - 1 < 0) return this.trackList.length - 1
  //       return this._trackIndex - 1
  //   }
  // }

  /**
   * Get next track index
   */
  get _nextTrackIndex(): number | undefined { switch (this.repeatMode) {
      case RepeatMode.Track:
        return this._trackIndex
      case RepeatMode.Off:
        if (this._trackIndex + 1 >= this.trackList.length) return
        return this._trackIndex + 1
      case RepeatMode.Queue:
        if (this._trackIndex + 1 >= this.trackList.length) return 0
        return this._trackIndex + 1
    }
  }


  /**
   * Get current playing track
   */
  async getTrack(): Promise<Track | null> {
    let currentList: Track[];
    if (this.mode === Mode.TrackList) {
      currentList = this.shuffle ? this.shuffledList : this.trackList
      const currentTrackIndex = await this._player.getCurrentTrack();
      const track = await this._player.getTrack(currentTrackIndex);
      this._trackIndex = currentList.findIndex(t => t == track);
      return track;
    }
    return this.fmTrackList[0];
  }

  /**
   * Get current trackID
   */
  async getTrackID() {
    const currentTrack = await this.getTrack();
    return currentTrack?.id;
  }


  /**
   * Get/Set shuffle Mode
   */
  get shuffle(): boolean {
    return this._shuffle
  }

  async set shuffle(value) {
    console.log('[player] [shuffle value]', value)
    if (value) {
      this.playShuffleList(this.trackList, await this.getTrackID());
    } else {
      this._trackIndex = this.trackList.findIndex(t => t == await this.getTrack())
    }
    this._shuffle = value
  }

  /**
   * Get/Set current tracklist
   */
  get trackListSource(): TrackListSource | null {
    return this._trackListSource
  }

  private async _initFM() {
    if (this.fmTrackList.length === 0) await this._loadMoreFMTracks()

    const trackId = this.fmTrackList[0].id;
    const track = await this._fetchTrack(trackId);
    if (track) this.fmTrack = track;

    this._loadMoreFMTracks()
  }


  /**
   * Fetch track details from Netease based on this.trackID
   */
  private async _fetchTrack(trackID: TrackID) {
    const response = await fetchTracksWithReactQuery({ids: [trackID]})
    return response?.songs?.length ? response.songs[0] : null
  }

  /**
   * Fetch track audio source url from Netease
   * @param {TrackID} trackID
   */
  private async _fetchAudioSource(trackID: TrackID) {
    const response = await fetchAudioSourceWithReactQuery({id: trackID})
    return {
      audio: response.data?.[0]?.url,
      id: trackID,
    }
  }

  /**
   * Play a track based on this.trackID
   */
  private async _playTrack() {
    this.state = State.Buffering;
    const track = await this.getTrack()
    if (!track) {
      ToastAndroid.show('加载歌曲信息失败', ToastAndroid.SHORT)
      return
    }
    if (this.mode === Mode.TrackList) this._track = track
    if (this.mode === Mode.FM) this.fmTrack = track
    this._playAudio()
  }

  /**
   * Play audio via howler
   */
  private async _playAudio(autoplay: boolean = true) {
    const trackID = await this.getTrackID();
    if (!trackID) return;
    const { audio, id } = await this._fetchAudioSource(trackID)
    if (!audio) {
      ToastAndroid.show('无法播放此歌曲', ToastAndroid.SHORT);
      this.skipToNext();
      return;
    }
    if (trackID !== id) return
    this._player.reset();
    const url = audio.includes('?')
      ? `${audio}&ypm-id=${id}`
      : `${audio}?ypm-id=${id}`
    const howler = new Howl({
      src: [url],
      format: ['mp3', 'flac', 'webm'],
      html5: true,
      autoplay,
      volume: 1,
      onend: () => this._howlerOnEndCallback(),
    })
    if (autoplay) {
      this.play()
      this.state = State.Playing
    }
    _howler.once('load', () => {
      this._cacheAudio((_howler as any)._src)
    })
  }

  private _howlerOnEndCallback() {
    if (this.mode !== Mode.FM && this.repeatMode === RepeatMode.One) {
      _howler.seek(0)
      _howler.play()
    } else {
      this.nextTrack()
    }
  }

  private _cacheAudio(audio: string) {
    if (audio.includes('yesplaymusic')) return
    const id = Number(new URL(audio).searchParams.get('ypm-id'))
    if (isNaN(id) || !id) return
    cacheAudio(id, audio)
  }

  private async _nextFMTrack() {
    const prefetchNextTrack = async () => {
      const prefetchTrackID = this.fmTrackList[1]
      const track = await this._fetchTrack(prefetchTrackID)
      if (track?.al.picUrl) {
        axios.get(resizeImage(track.al.picUrl, 'md'))
        axios.get(resizeImage(track.al.picUrl, 'xs'))
      }
    }

    this.fmTrackList.shift()
    if (this.fmTrackList.length === 0) await this._loadMoreFMTracks()
    this._playTrack()

    this.fmTrackList.length <= 1
      ? await this._loadMoreFMTracks()
      : this._loadMoreFMTracks()
    prefetchNextTrack()
  }

  private async _loadMoreFMTracks() {
    if (this.fmTrackList.length <= 5) {
      const response = await fetchPersonalFMWithReactQuery()
      const ids = (response?.data?.map(r => r.id) ?? []).filter(
        r => !this.fmTrackList.includes(r)
      )
      this.fmTrackList.push(...ids)
    }
  }

  /**
   * Get playing state
   */
  async getState(): Promise<State> {
    return this._player.getState()
  }

  /**
   * Play current track
   */
  async play() {
    if (await this._player.getState() == State.Playing) {
      return
    }
    this._player.play();
  }

  /**
   * Pause current track
   */
  async pause() {
    if (await this.getState() == State.Paused) return this._player.pause();
  }

  /**
   * Stop current track
   */
  async stop(){
    this._player.stop();
  }


  /**
   * Play or pause current track
   */
  async playOrPause() {
    await this.getState() === State.Playing ? this.pause() : this.play();
  }

  /**
   * Seek to specified progress timestamp
   * @param seconds
   */
  async seekTo(seconds: number) {
    this._player.seekTo(seconds);
  }

  /**
   * Set and get volume
   * @param level
   */
  async setVolume(level: number) {
    this._player.setVolume(level);
  }
  async getVolume(){
    return this._player.getVolume();
  }
  /**
   * Play previous track
   */
  async skipToPrevious() {
    return this._player.skipToPrevious()
  }

  /**
   * Play next track
   */
  async skipToNext(forceFM: boolean = false) {
    if (forceFM || this.mode === Mode.FM) {
      this.mode = Mode.FM
      return this._nextFMTrack()
    }
    if (this._nextTrackIndex === undefined) {
      ToastAndroid.show('没有下一首了', ToastAndroid.SHORT)
      this.pause();
    }
    this._trackIndex = this._nextTrackIndex
    this._playTrack()
    return this._player.skipToNext()
  }


  /**
   * 播放一个track id列表
   * @param {number[]} list
   * @param {null|number} autoPlayTrackID
   */
  async playAList(list: Track[], autoPlayTrackID?: null | number) {
    this.mode = Mode.TrackList
    this.trackList = list
    this._player.reset();
    this._player.add(list);
    this._player.skip(autoPlayTrackID??0);
    this.play();
    if (this._shuffle) this.playShuffleList(list)
    this._playTrack()
  }

  /**
   * Play a playlist
   * @param  {number} playlistID
   * @param  {null|number=} autoPlayTrackID
   */
  async playPlaylist(playlistID: number, autoPlayTrackID?: null | number) {
    const playlist = await fetchPlaylistWithReactQuery({id: playlistID})
    if (!playlist?.playlist?.trackIds?.length) return
    this._trackListSource = {
      type: TrackListSourceType.Playlist,
      id: playlistID,
    }
    this.playAList(
      playlist.playlist,
      autoPlayTrackID
    )
  }

  /**
   * Play am album
   * @param  {number} albumID
   * @param  {null|number=} autoPlayTrackID
   */
  async playAlbum(albumID: number, autoPlayTrackID?: null | number) {
    const album = await fetchAlbumWithReactQuery({id: albumID})
    if (!album?.songs?.length) return
    this._trackListSource = {
      type: TrackListSourceType.Album,
      id: albumID,
    }
    this._playTrack()
    this.playAList(
      album.songs,
      autoPlayTrackID
    )
  }

  /**
   *  Play personal fm
   */
  async playFM() {
    this.mode = Mode.FM
    if (
      this.fmTrackList.length > 0 &&
      this.fmTrack?.id === this.fmTrackList[0].id
    ) {
      this._track = this.fmTrack
      this._playAudio()
    } else {
      this._playTrack()
    }
  }

  /**
   * Trash current PersonalFMTrack
   */
  async fmTrash() {
    this.mode = Mode.FM
    const trashTrackID = this.fmTrackList[0]
    fmTrash(trashTrackID)
    this._nextFMTrack()
  }


  /**
   * Play shuffle list
   * @param list
   * @param trackID
   */
  playShuffleList(list: Track[], trackID?: TrackID) {
    if (trackID) {
      this.shuffledList = shuffle(list);
      this._player.reset();
      this._player.add(list);
      trackID && this._player.skip(list.findIndex(t => t.id == trackID));
      this.play()
  }
}

