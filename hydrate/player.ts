import {
  fetchAudioSourceWithReactQuery,
  fetchTracksWithReactQuery,
} from "@/hooks/useTracks";
import { fetchPersonalFMWithReactQuery } from "@/hooks/usePersonalFM";
import { fmTrash } from "@/api/personalFM";
import { cacheAudio } from "@/api/yesplaymusic";
import { shuffle } from "lodash-es";
import axios from "axios";
import { resizeImage } from "@/utils/common";
import { fetchPlaylistWithReactQuery } from "@/hooks/usePlaylist";

import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
  Track as DefaultTrack,
} from "react-native-track-player";
import { ToastAndroid } from "react-native";
import { proxy } from "valtio";
import { fetchAlbum, fetchTracks } from "@/api";
import { Platform } from "expo-modules-core";

if (Platform.OS !== "android" && Platform.OS !== "ios") {
  exports.Player = class Player {};
}

type TrackID = number;

export enum TrackListSourceType {
  Album = "album",
  Playlist = "playlist",
}

export interface TrackListSource {
  type: TrackListSourceType;
  id: number;
}

export interface ModifiedTrack extends DefaultTrack {
  id?: number;
}

export enum PlayerMode {
  TrackList = "trackList",
  FM = "fm",
}

export {
  State,
  RepeatMode,
  Event,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

export class Player {
  private _track: ModifiedTrack | null = null;
  private _trackIndex: number = 0;
  // private _progress: number = 0
  // private _progressInterval: ReturnType<typeof setInterval> | undefined
  // private _volume: number = 1 // 0 to 1
  private _repeatMode: RepeatMode = RepeatMode.Off;
  private _shuffle: boolean = false;
  private _trackListSource: TrackListSource | null = null;
  private _player: typeof TrackPlayer = TrackPlayer;

  mode: PlayerMode = PlayerMode.TrackList;
  trackList: ModifiedTrack[] = [];
  fmTrackList: ModifiedTrack[] = [];
  shuffledList: ModifiedTrack[] = [];

  constructor() {
    this.init();
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
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
  }

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
   * Get Current Track Index
   */
  get trackIndex() {
    return this._trackIndex;
  }

  get track() {
    return this._track;
  }

  /**
   * Get Repeat Mode
   */
  get repeatMode() {
    return this._repeatMode;
  }

  set repeatMode(mode) {
    this._player.setRepeatMode(mode);
    this._repeatMode = mode;
  }

  private getRepeatMode() {
    return this._player.getRepeatMode();
  }

  async getPrevTrackIndex(): Promise<number | undefined> {
    const repeatMode = await this._player.getRepeatMode();
    switch (repeatMode) {
      case RepeatMode.Track:
        return this._trackIndex;
      case RepeatMode.Off:
        if (this._trackIndex === 0) return this._trackIndex;
        return this._trackIndex - 1;
      case RepeatMode.Queue:
        if (this._trackIndex - 1 < 0) return this.trackList.length - 1;
        return this._trackIndex - 1;
    }
  }
  /**
   * Get next track index
   */
  async getNextTrackIndex(): Promise<number | undefined> {
    const repeatMode = await this._player.getRepeatMode();
    switch (repeatMode) {
      case RepeatMode.Track:
        return this._trackIndex;
      case RepeatMode.Off:
        if (this._trackIndex + 1 >= this.trackList.length) return;
        return this._trackIndex + 1;
      case RepeatMode.Queue:
        if (this._trackIndex + 1 >= this.trackList.length) return 0;
        return this._trackIndex + 1;
    }
  }

  /**
   * Get current playing track
   */
  async getCurrentTrack(trackID?: number): Promise<ModifiedTrack | null> {
    if (trackID) return await this._player.getTrack(trackID);
    let currentList: ModifiedTrack[];
    if (this.mode === PlayerMode.TrackList) {
      currentList = this.shuffle ? this.shuffledList : this.trackList;
      const currentTrackIndex = await this._player.getCurrentTrack();
      const track = await this._player.getTrack(currentTrackIndex);
      this._trackIndex = currentList.findIndex((t) => t == track);
      return track;
    }
    return this.fmTrackList[0];
  }

  /**
   * Get current trackID
   */
  async getTrackID(trackID?: number) {
    const currentTrack = await this.getCurrentTrack();
    return currentTrack?.id;
  }

  getTrack(trackID: number) {
    return this._player.getTrack(trackID);
  }

  /**
   * Get/Set shuffle Mode
   */
  get shuffle(): boolean {
    return this._shuffle;
  }

  set shuffle(value) {
    console.log("[player] [shuffle value]", value);
    if (value) {
      (async () =>
        this.playShuffleList(this.trackList, await this.getTrackID()))();
    } else {
      this._trackIndex = this.trackList.findIndex(
        async (t) => t == (await this.getCurrentTrack())
      );
    }
    this._shuffle = value;
  }

  /**
   * Get/Set current tracklist
   */
  get trackListSource(): TrackListSource | null {
    return this._trackListSource;
  }

  private async _initFM() {
    if (this.fmTrackList.length === 0) await this._loadMoreFMTracks();

    const trackId = this.fmTrackList[0].id!;
    const track = await this._fetchTrack(trackId);
    if (track) this.fmTrackList[0] = track;

    this._loadMoreFMTracks();
  }

  /**
   * Fetch track details from Netease based on this.trackID
   */
  private async _fetchTrack(trackID: TrackID): Promise<ModifiedTrack> {
    const { songs } = await fetchTracksWithReactQuery({ ids: [trackID] });
    const { data: audio } = await fetchAudioSourceWithReactQuery({
      id: trackID,
    });
    const url = audio[0].url ?? "";
    const {
      id,
      al: { picUrl: artwork },
      ar,
      name: title,
    } = songs[0];
    const artist = ar.map((ar) => ar.name).join(", ");
    return { id, artwork, artist, title, url };
  }

  /**
   * Fetch track audio source url from Netease
   * @param {TrackID} trackID
   */
  private async _fetchAudioSource(trackID: TrackID) {
    const response = await fetchAudioSourceWithReactQuery({ id: trackID });
    return {
      audio: response.data?.[0]?.url,
      id: trackID,
    };
  }

  /**
   * Play a track based on this.trackID
   */
  private async _playTrack() {
    const track = await this.getCurrentTrack();
    if (!track) {
      ToastAndroid.show("加载歌曲信息失败", ToastAndroid.SHORT);
      return;
    }
    if (this.mode === PlayerMode.TrackList) this._track = track;
    if (this.mode === PlayerMode.FM) this.fmTrackList[0] = track;
    // alert(`this track - ${JSON.stringify(this._track)}`)
    this.play();
  }

  /**
   * Play audio via howler
   */
  // private async _playAudio(autoplay: boolean = true) {
  //   const trackID = await this.getTrackID();
  //   if (!trackID) return;
  //   const { audio, id } = await this._fetchAudioSource(trackID);
  //   if (!audio) {
  //     ToastAndroid.show("无法播放此歌曲", ToastAndroid.SHORT);
  //     this.skipToNext();
  //     return;
  //   }
  //   if (trackID !== id) return;
  //   this._player.reset();
  //   const url = audio.includes("?")
  //     ? `${audio}&ypm-id=${id}`
  //     : `${audio}?ypm-id=${id}`;
  //   const thisFmTrack: Track = {
  //     url,
  //   };
  //   this._player.add(thisFmTrack);
  //   if (autoplay) {
  //     this.play();
  //     this.state = State.Playing;
  //   }
  //   this._cacheAudio(url);
  // }

  private _cacheAudio(audio: string) {
    if (audio.includes("yesplaymusic")) return;
    const id = Number(new URL(audio).searchParams.get("ypm-id"));
    if (isNaN(id) || !id) return;
    cacheAudio(id, audio);
  }

  private async _nextFMTrack() {
    const prefetchNextTrack = async () => {
      const prefetchTrackID = this.fmTrackList[1].id!;
      const { artwork } = await this._fetchTrack(prefetchTrackID);
      if (!artwork) return;
      axios.get(resizeImage(artwork.toString(), "md"));
      axios.get(resizeImage(artwork.toString(), "xs"));
    };

    this.fmTrackList.shift();
    if (this.fmTrackList.length === 0) await this._loadMoreFMTracks();
    this._playTrack();

    this.fmTrackList.length <= 1
      ? await this._loadMoreFMTracks()
      : this._loadMoreFMTracks();
    prefetchNextTrack();
  }

  private async _loadMoreFMTracks() {
    if (this.fmTrackList.length <= 5) {
      const response = await fetchPersonalFMWithReactQuery();
      // const ids = (response?.data?.map(r => r.id) ?? []).filter(
      //   r => !this.fmTrackList.includes(r)
      // )
      const moreFmTracks = (response?.data ?? [])
        .filter(({ id }) => !this.fmTrackList.map((t) => t.id).includes(id))
        .map((t) => ({
          id: t.id,
          url: t.rtUrl ?? "",
          artist: t.artists.map((ar) => ar.name).join(", "),
          album: t.album.picUrl,
        }));
      this.fmTrackList.push(...moreFmTracks);
    }
  }

  /**
   * Get playing state
   */
  getState(): Promise<State> {
    return this._player.getState();
  }

  /**
   * Play current track
   */
  async play() {
    if ((await this.getState()) != State.Playing) this._player.play();
  }

  /**
   * Pause current track
   */
  async pause() {
    if ((await this.getState()) != State.Paused) this._player.pause();
  }

  /**
   * Stop current track
   */
  async stop() {
    this._player.stop();
  }

  /**
   * Play or pause current track
   */
  async playOrPause() {
    (await this.getState()) == State.Playing ? this.pause() : this.play();
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

  async getVolume() {
    return this._player.getVolume();
  }

  /**
   * Play previous track
   */
  async skipToPrevious() {
    if (this.mode === PlayerMode.FM) {
      ToastAndroid.show('Personal FM not support previous track', ToastAndroid.SHORT);
      return
    }
    await this._player.skipToPrevious();
    const prevTrackIndex = await this._player.getCurrentTrack();
    if (this._trackIndex === prevTrackIndex) {
      ToastAndroid.show('No previous track', ToastAndroid.SHORT);
      return
    }
    this._trackIndex = prevTrackIndex;
    this._playTrack()
  }

  /**
   * Play next track
   */
  async skipToNext(forceFM: boolean = false) {
    if (forceFM || this.mode === PlayerMode.FM) {
      this.mode = PlayerMode.FM;
      return this._nextFMTrack();
    }
    await this._player.skipToNext();
    const nextTrackIndex = await this._player.getCurrentTrack();
    if (this._trackIndex === nextTrackIndex) {
      ToastAndroid.show("没有下一首了", ToastAndroid.SHORT);
      return;
    }
    this._trackIndex = nextTrackIndex;
    this._playTrack();
  }

  /**
   * 播放一个track id列表
   * @param tracks
   * @param {null|number} autoPlayTrackID
   */
  async playAList(trackIds: TrackID[], autoPlayTrackID?: null | number) {
    this.mode = PlayerMode.TrackList;
    // const trackList = await Promise.all(songs.map(async (s) => {
    //   const audioSource = await fetchAudioSourceWithReactQuery({id: s.id});
    //   const url = audioSource.data[0].url??'';
    //   return {
    //     id: s.id,
    //     url,
    //     artist: s.ar.map((ar) => ar.name).join(", "),
    //     title: s.name,
    //     artwork: s.al.picUrl,
    //   };
    // }))
    // this.trackList = trackList.filter(t => t.url != '');
    this.trackList = await Promise.all(
      trackIds.map(async (t) => await this._fetchTrack(t))
    );
    await this._player.reset();
    this._player.add(this.trackList);
    autoPlayTrackID && this._player.skip(autoPlayTrackID);
    this._trackIndex = autoPlayTrackID ?? 0;
    this._track = await this.getCurrentTrack();
    this.play();
    if (this._shuffle) this.playShuffleList(this.trackList);
    // this._playTrack();
  }

  /**
   * Play a playlist
   * @param  {number} playlistID
   * @param  {null|number=} autoPlayTrackID
   */
  async playPlaylist(playlistID: number, autoPlayTrackID?: null | number) {
    const { playlist } = await fetchPlaylistWithReactQuery({ id: playlistID });
    if (!playlist.trackIds?.length) return;
    this._trackListSource = {
      type: TrackListSourceType.Playlist,
      id: playlistID,
    };
    const { songs } = await fetchTracks({
      ids: playlist.trackIds?.map((t) => t.id) ?? [],
    });
    this.playAList(
      playlist.trackIds.map((t) => t.id),
      autoPlayTrackID
    );
  }

  /**
   * Play am album
   * @param  {number} albumID
   * @param  {null|number=} autoPlayTrackID
   */
  async playAlbum(albumID: number, autoPlayTrackID?: null | number) {
    const { songs } = await fetchAlbum({ id: albumID });
    if (!songs?.length) return;
    this._trackListSource = {
      type: TrackListSourceType.Album,
      id: albumID,
    };
    this.playAList(
      songs.map((t) => t.id),
      autoPlayTrackID
    );
  }

  /**
   *  Play personal fm
   */
  async playFM() {
    this.mode = PlayerMode.FM;
    if (this.fmTrackList.length > 0) {
      this._track = this.fmTrackList[0];
    }
    this._playTrack();
  }

  /**
   * Trash current PersonalFMTrack
   */
  async fmTrash() {
    this.mode = PlayerMode.FM;
    const trashTrackID = this.fmTrackList[0].id!;
    fmTrash(trashTrackID);
    this._nextFMTrack();
  }

  /**
   * Play shuffle list
   * @param list
   * @param trackID
   */
  playShuffleList(list: ModifiedTrack[], trackID?: TrackID) {
    if (trackID) {
      this.shuffledList = shuffle(list);
      this._player.reset();
      this._player.add(list);
      trackID && this._player.skip(list.findIndex((t) => t.id == trackID));
      this.play();
    }
  }
}

export const trackPlayer = proxy(new Player());
