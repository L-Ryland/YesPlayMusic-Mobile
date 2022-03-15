import React from "react";
import { Dimensions, StyleSheet, TouchableHighlight } from "react-native";
import styled from "styled-components/native";
import Slider from '@react-native-community/slider'
import Svg, { Circle, Rect } from 'react-native-svg';
import { Icon } from "@iconify/react";
import { View, Text } from '@/components'
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { selectPlayer, setPlayingStatus } from "@/redux/slice/playerSlice";
import { Play, Pause, Next, Previous, Shuffle, Repeat, Repeat_1 } from "@/components/icons";

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

const PlayButton = ({ playerStatus, ...otherProps }) => {
  const { playing } = playerStatus;
  return (
    <Svg height="50" width="50" viewBox="0 0 100 100" {...otherProps}>
      <Circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2.5" fill="white" />
      {playing
        ? <Pause height='40' width='40' color='black' x='31' y='32' />
        : <Play height='40' width='40' color='black' x='32' y='32' />
      }
    </Svg>
  )
}


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
  borderwidth: '10';
  position: 'absolute';
  margin-top: '${height * 0.9}'
`
export function PlayerScreen({ navigation, route }) {
  const dispatch = useAppDispatch();
  console.log("player screen", navigation, route);
  const { al: { name: songTitle, picUrl }, ar } = route.params.track;
  console.log('player picurl', picUrl, "screen width", width,);
  const artists = ar.length == 1 ? ar[0].name : ar.reduce((prev, curr) => prev.name + ", " + curr.name);
  const playerStatus = useAppSelector(selectPlayer);
  console.log("player status", playerStatus);

  const handlePlay = () => {
    const { playing } = playerStatus;
    dispatch(setPlayingStatus(!playing));

    // sound control
  }

  const CoverPage = styled.Image.attrs(() => ({
    source: { uri: picUrl },
  }))`
    width: ${width * 0.8}px;
    height: ${width * 0.8}px;
    resize-mode: center;
  `
  const CoverText = styled(View).attrs(() => ({
    children: [
      <Text style={{ fontSize: 40 }} key="title">{songTitle}</Text>,
      <Text style={{ fontSize: 20 }} key="artists">{artists}</Text>
    ]
  }))`
   align-content: flex-start;
   font-weight: bold;
  `;
  const TimeStampRow = styled(View).attrs(() => ({
    children: [
      <Text key='startPoint' style={{ alignSelf: 'auto' }}>start</Text>,
      <Text key='endPoint' style={{ alignSelf: 'auto' }}>end</Text>
    ]
  }))`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px;
    position: absolute;
    width: ${width * 0.8};
  `
  const SliderBox = styled(View).attrs(() => ({
    children: [
      <Slider
        key='slider'
        style={{ width: width * 0.8, height: 30 }}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />,
      <TimeStampRow key="timestampRow" />
    ]
  }))``

  const ControlBox = styled(View).attrs(() => ({
    children: [
      <TouchableHighlight key='shuffle'>
        <Shuffle height='30' width='35' />
        {/* <Icon icon="bi:shuffle" color="white" height="35" /> */}
      </TouchableHighlight>,
      <TouchableHighlight key='prevTrack'>
        <Previous height='30' width='35' />
      </TouchableHighlight>,
      <TouchableHighlight key='play' onPress={handlePlay}>
        <PlayButton playerStatus={playerStatus} />
      </TouchableHighlight>,
      <TouchableHighlight key='nextTrack'>
        <Next height='30' width='35' />
      </TouchableHighlight>,
      <TouchableHighlight key='loop'>
        <Repeat height='30' width='35' />
        {/* <Icon icon="simple-line-icons:loop" color="white" height="35" /> */}
      </TouchableHighlight>,
    ]
  }))`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
    position: relative;
    width: ${width * 0.8};
    height: 50px;
`;

  return (
    <View style={styles.container}>
      <Player>
        <HeaderBar>
          <Text>aaa</Text>
          <Text>bbb</Text>
        </HeaderBar>
        <CoverPage />
        <CoverText />
        <SliderBox />
        <ControlBox />
        <LyricsBox>
          <Text>Locate Helper</Text>
        </LyricsBox>
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
})
