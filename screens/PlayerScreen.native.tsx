import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableHighlight, Image } from "react-native";
import styled from "styled-components/native";
import Slider from '@react-native-community/slider'
import { View, Text, useThemeColor, useSvgStyle } from '@/components'
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { selectPlayer, setPlayingStatus } from "@/redux/slice/playerSlice";
import { Play, Pause, Next, Previous, Shuffle, Repeat, Repeat_1, Heart, HeartSolid } from "@/components/icons";
import { useTrackPlayerEvents, Event, State, usePlaybackState, useProgress } from "react-native-track-player";
import dayjs, { duration } from "dayjs";
import Duration from "dayjs/plugin/duration";

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
  const [trackTitle, setTrackTitle] = React.useState<string>();
  const [trackArtist, setTrackArtist] = React.useState<string>();
  const [trackArtwork, setTrackArtwork] = React.useState<string>();
  console.log("player screen", navigation, route);
  const { al: { name: songTitle, picUrl }, ar } = route.params.track;
  console.log('player picurl', picUrl, "screen width", width,);
  const artists = ar.length == 1 ? ar[0].name : ar.reduce((prev, curr) => prev.name + ", " + curr.name);
  const playerStatus = useAppSelector(selectPlayer);
  const { TrackPlayer } = playerStatus;
  const svgStyle = useSvgStyle({});
  console.log("player status", playerStatus);
  // alert(JSON.stringify(progress))
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (!trackTitle) {
      const track = await TrackPlayer.getTrack(event.track);
      const { title, artist, artwork } = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
    if (
      event.type === Event.PlaybackTrackChanged &&
      event.nextTrack !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist, artwork } = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });
  React.useEffect(() => {
    (async () => {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      const track = await TrackPlayer.getTrack(currentTrack);
      const { title, artist, artwork } = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);

    })()
    return () => { }
  }, [])


  const handlePlay = async (playbackState: State) => {
    const { TrackPlayer } = playerStatus;
    // alert(TrackPlayer)
    const currentTrack = await TrackPlayer.getCurrentTrack();
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

  const CoverPage = styled.Image`
    width: ${contentWidth};
    height: ${contentWidth};
    resize-mode: center;
  `
  const CoverText = styled(View).attrs(() => ({
    children: [
      <Text style={{ fontSize: 28 }} key="title">{trackTitle}</Text>,
      <Text style={{ fontSize: 22 }} key="artists">{trackArtist}</Text>
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
  const ControlBox = styled(View).attrs(() => ({
    children: [
      <TouchableHighlight key='shuffle'>
        <Shuffle {...svgStyle} />
      </TouchableHighlight>,
      <TouchableHighlight key='prevTrack' onPress={() => TrackPlayer.skipToPrevious()}>
        <Previous {...svgStyle} />
      </TouchableHighlight>,
      <TouchableHighlight key='play' onPress={() => handlePlay(playbackState)}>
        <PlayButton playerStatus={playerStatus} svgStyle={svgStyle} />
      </TouchableHighlight>,
      <TouchableHighlight key='nextTrack' onPress={() => TrackPlayer.skipToNext()} >
        <Next {...svgStyle} />
      </TouchableHighlight>,
      <TouchableHighlight key='loop'>
        <Repeat {...svgStyle} />
        {/* <Icon icon="simple-line-icons:loop" color="white" height="35" /> */}
      </TouchableHighlight>,
    ]
  }))`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    position: relative;
    height: 50px;
`;

  return (
    <View style={styles.container}>
      <Player>
        {/* <HeaderBar>
          <Text>aaa</Text>
          <Text>bbb</Text>
        </HeaderBar> */}
        {/* <CoverPage source={{uri: trackArtwork}} /> */}
        <Image style={styles.coverPage} source={{ uri: trackArtwork }} />
        <View style={styles.titleView}>
          <CoverText />
          <Heart {...svgStyle} color='pink' />
        </View>
        <Slider
          key='slider'
          style={{ width: 0.9*width, height: 30 }}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor="#335eea"
          minimumTrackTintColor="#335eea"
          maximumTrackTintColor="#000000"
        />
        <TimeStampRow key="timestampRow" />
        <ControlBox style={styles.containerWidth} />
        {/* <LyricsBox>/
          <Text>Locate Helper</Text>
        </LyricsBox> */}
      </Player>
    </View>
  )
}

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
