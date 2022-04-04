import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableHighlight, Image } from "react-native";
import styled from "styled-components/native";
import Slider from '@react-native-community/slider'
import { View, Text, useThemeColor, useSvgStyle } from '@/components'
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { selectPlayer, setPlayingStatus } from "@/redux/slice/playerSlice";
import { Play, Pause, Next, Previous, Shuffle, Repeat, Repeat_1, Heart, HeartSolid } from "@/components/icons";
import TrackPlayer, { useTrackPlayerEvents, Event, State, usePlaybackState, useProgress, RepeatMode } from "react-native-track-player";
import type { Track } from "react-native-track-player";
import dayjs, { duration } from "dayjs";
import Duration from "dayjs/plugin/duration";
import { updatePlayerStatus } from "@/redux/slice/playerSlice.android";

dayjs.extend(Duration)
const { width, height } = Dimensions.get('window');
const contentWidth = width * 0.8;
const Player = styled(View)`
display: flex;
flex-direction: column;
align-self: center;
align-items: center;
padding: 50px 26px 26px;

position: absolute;
width: ${contentWidth};

`;

const HeaderBar = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 0;

position: absolute;
width: '${contentWidth}';
height: '37';
left: '26';
top: '50';
`
const ProgressBar = styled.View`
  margin-top: -6px;
  margin-bottom: -6px;
  width: 100%;
`;




function LeftControlButton() {

}
function MiddleControlButton() {

}
function RightControlButton() {

}
const LyricsBox = styled(View)`
  width: '${contentWidth}';
  height: '500';
  background: purple;
  border-radius: 10;
  position: absolute;
  margin-top: '${height * 0.9}';
`
export function PlayerScreen({ navigation, route }) {
  const dispatch = useAppDispatch();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const player = useAppSelector(selectPlayer);
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>(undefined);
  // const [trackTitle, setTrackTitle] = React.useState<string>();
  // const [trackArtist, setTrackArtist] = React.useState<Track>();
  // const [trackArtwork, setTrackArtwork] = React.useState<Track["artwork"]>();
  const { repeatMode, shuffle, shuffledList, list } = player;
  console.log("player screen", navigation, route);
  const { al: { name: songTitle, picUrl }, ar } = route.params.track;
  console.log('player picurl', picUrl, "screen width", width,);
  const artists = ar.length == 1 ? ar[0].name : ar.reduce((prev, curr) => prev.name + ", " + curr.name);
  const playerStatus = useAppSelector(selectPlayer);
  const svgStyle = useSvgStyle({});
  console.log("player status", playerStatus);
  // alert(JSON.stringify(progress))
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {

    if (
      event.type === Event.PlaybackTrackChanged &&
      event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track);
    }
  });
  React.useEffect(() => {
    (async () => {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      const track = await TrackPlayer.getTrack(currentTrack);
      console.log("player initiated track", track);

      setCurrentTrack(track);
      const { title, artist, artwork } = track || {};
      // setTrackTitle(title);
      // setTrackArtist(artist);
      // setTrackArtwork(artwork);

    })()
    return () => { }
  }, [])


  const handlePlay = async (playbackState: State) => {
    // alert(TrackPlayer)
    console.log("handlePlay currentTrack", "handlePlay");
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log("handlePlay currentTrack", currentTrack);

    if (currentTrack == null) {
      // TODO: Perhaps present an error or restart the playlist?
    } else {
      if (playbackState !== State.Playing) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }

    // sound control
  }
  const handleShuffle = async () => {
    // console.log("handleShuffle currentQueue", await TrackPlayer.getQueue())
    await TrackPlayer.removeUpcomingTracks();
    if (shuffle) {
      await TrackPlayer.add(list);
    } else {
      await TrackPlayer.add(shuffledList)
    }
    dispatch(updatePlayerStatus({key: 'shuffle', value: !shuffle}))
    // console.log("handleShuffle shuffledQueue", await TrackPlayer.getQueue())
  }
  const handleLoop = async () => {
    const currentRepeatMode = await TrackPlayer.getRepeatMode();
    let repeat;
    switch (currentRepeatMode) {
      case RepeatMode.Off:
        repeat = 'off';
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        break;
      case RepeatMode.Queue:
        repeat = 'on';
        await TrackPlayer.setRepeatMode(RepeatMode.Track)
        break;
      case RepeatMode.Track: 
        repeat = 'one';
        await TrackPlayer.setRepeatMode(RepeatMode.Off)
        break;
      default: 
        console.log('unmatched', currentRepeatMode)
    }
    dispatch(updatePlayerStatus({
      key: "repeatMode", value: repeat
    }));
    

  }

  const CoverText = styled(View).attrs(() => ({
    children: [
      <Text style={{ fontSize: 28 }} key="title">{currentTrack?.title}</Text>,
      <Text style={{ fontSize: 22 }} key="artists">{currentTrack?.artist}</Text>
    ]
  }))`
   align-content: flex-start;
   font-weight: bold;
  `;
  const TimeStampRow = styled(View).attrs(() => ({
    children: [
      <Text key='startPoint' style={{ alignSelf: 'auto' }}>{dayjs.duration(progress.position * 1000).format('m:ss')}</Text>,
      <Text key='endPoint' style={{ alignSelf: 'auto' }}>{dayjs.duration(progress.duration * 1000).format('m:ss')}</Text>
    ]
  }))`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0;
    width: ${width * 0.8};
    height: 50;
  `
  const PlayButton = ({ playerStatus, svgStyle, ...otherProps }) => {
    const { playing } = playerStatus;
    return playbackState === State.Playing
      ? <Pause {...svgStyle} height={50} width={50} />
      : <Play {...svgStyle} height={50} width={50} />
  }
  const ControlView: React.FC = () => {
    return (
      <ControlBox style={styles.containerWidth}>
        <TouchableHighlight onPress={handleShuffle}>
          <Shuffle {...useSvgStyle({active: shuffle})} />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => TrackPlayer.skipToPrevious()}>
          <Previous {...svgStyle} />
        </TouchableHighlight>
        <TouchableHighlight  onPress={() => handlePlay(playbackState)}>
          <PlayButton playerStatus={playerStatus} svgStyle={svgStyle} />
        </TouchableHighlight>
        <TouchableHighlight onPress={() => TrackPlayer.skipToNext()} >
          <Next {...svgStyle} />
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>handleLoop()}>
          {repeatMode == 'on' // loop mode playlist
          ? <Repeat {...useSvgStyle({active: true})}/>
          : repeatMode == 'one' // loop mode track
          ?<Repeat_1 {...useSvgStyle({active: true})}/>
          : <Repeat {...svgStyle} /> //loop mode off
        }
          {/* <Icon icon="simple-line-icons:loop" color="white" height="35" /> */}
        </TouchableHighlight>
      </ControlBox>
    )
  }


  return (
    <View style={styles.container}>
      <Player>
        {/* <HeaderBar>
          <Text>aaa</Text>
          <Text>bbb</Text>
        </HeaderBar> */}
        {/* <CoverPage source={{uri: trackArtwork}} /> */}
        <Image style={styles.coverPage} source={{ uri: currentTrack?.artwork?.toString() }} />
        <View style={styles.titleView}>
          <CoverText />
          <Heart {...svgStyle} color='pink' />
        </View>
        <Slider
          key='slider'
          style={{ width: 0.9 * width, height: 30 }}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor="#335eea"
          minimumTrackTintColor="#335eea"
          maximumTrackTintColor="#000000"
        />
        <TimeStampRow key="timestampRow" />
        <ControlView />
        {/* <LyricsBox>/
          <Text>Locate Helper</Text>
        </LyricsBox> */}
      </Player>
    </View>
  )
}

const ControlBox = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  position: relative;
  height: 50px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerWidth: {
    width: contentWidth,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: contentWidth,
    lineHeight: contentWidth,
  },
  coverPage: {
    width: contentWidth,
    height: contentWidth,
    resizeMode: 'center',
  }
})

