import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableHighlight,
} from "react-native";
import styled from "styled-components/native";
import Slider from "@react-native-community/slider";
import { SvgIcon, Text, useSvgStyle, View } from "@/components";
import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration";
import {
  Event,
  ModifiedTrack,
  RepeatMode,
  State as PlayingState,
  trackPlayer,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "@/hydrate/player";
import { useSnapshot } from "valtio";
import {ProgressState} from "react-native-track-player";

dayjs.extend(Duration);
const { width, height } = Dimensions.get("window");
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
  width: "${contentWidth}";
  height: "37";
  left: "26";
  top: "50";
`;

function LeftControlButton() {}

function MiddleControlButton() {}

function RightControlButton() {}

const LyricsBox = styled(View)`
  width: "${contentWidth}";
  height: "500";
  background: purple;
  border-radius: 10;
  position: absolute;
  margin-top: "${height * 0.9}";
`;
const CoverText: React.FC<{currentTrack: ModifiedTrack | null}> = ({ currentTrack }) => {
  const ViewBox = styled(View)`
      align-content: flex-start;
      font-weight: bold;
    `;
  return (
    <ViewBox>
      <Text style={{ fontSize: 28 }} key="title">
        {currentTrack?.title}
      </Text>
      <Text style={{ fontSize: 22 }} key="artists">
        {currentTrack?.artist}
      </Text>
    </ViewBox>
  )
};
const PlayButton: React.FC = () => {
  const playingState = usePlaybackState()
  const svgStyle = useSvgStyle({ height: 50, width: 50 });
  return (
    <SvgIcon
      name={playingState == PlayingState.Playing ? "Pause" : "Play"}
      {...svgStyle}
      height={50}
      width={50}
    />
  );
};
const ControlView: React.FC<{
  handleShuffle: () => void;
  handlePlay: () => void;
  handleLoop: () => void;
}> = ({ handleShuffle, handlePlay, handleLoop }) => {
  const svgStyle = useSvgStyle({});
  const {shuffle, repeatMode} = useSnapshot(trackPlayer);
  return (
    <ControlBox style={styles.containerWidth}>
      <TouchableHighlight onPress={handleShuffle}>
        <SvgIcon name="Shuffle" {...useSvgStyle({active: shuffle})}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => trackPlayer.skipToPrevious()}>
        <SvgIcon name="Previous" {...svgStyle}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={handlePlay}>
        <PlayButton />
      </TouchableHighlight>
      <TouchableHighlight onPress={() => trackPlayer.skipToNext()}>
        <SvgIcon name="Next" {...svgStyle}/>
      </TouchableHighlight>
      <TouchableHighlight onPress={handleLoop}>
        <SvgIcon
          name={repeatMode == RepeatMode.Track ? "Repeat_1" : "Repeat"}
          {...useSvgStyle({ active: repeatMode != RepeatMode.Off })}
        />
        {/*{*/}
        {/*  repeatMode == RepeatMode.Queue ? ( // loop mode playlist*/}
        {/*    <Repeat {...useSvgStyle({ active: true })} />*/}
        {/*  ) : repeatMode == RepeatMode.Track ? ( // loop mode track*/}
        {/*    <Repeat_1 {...useSvgStyle({ active: true })} />*/}
        {/*  ) : (*/}
        {/*    <Repeat {...svgStyle} />*/}
        {/*  ) //loop mode off*/}
        {/*}*/}
        {/* <Icon icon="simple-line-icons:loop" color="white" height="35" /> */}
      </TouchableHighlight>
    </ControlBox>
  );
};
const ProgressBar: React.FC<{progress: ProgressState }> = ({progress}) => {
  const TimeStampRow = styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0;
    width: ${width * 0.8};
    height: 50;
    `;
  return (
    <View>
      <Slider
        key="slider"
        style={{ width: 0.9 * width, height: 30 }}
        value={progress.position}
        minimumValue={0}
        maximumValue={progress.duration}
        thumbTintColor="#335eea"
        minimumTrackTintColor="#335eea"
        maximumTrackTintColor="#000000"
      />
      <TimeStampRow>
        <Text key="startPoint" style={{ alignSelf: "auto" }}>
          {dayjs.duration(progress.position * 1000).format("m:ss")}
        </Text>
        <Text key="endPoint" style={{ alignSelf: "auto" }}>
          {dayjs.duration(progress.duration * 1000).format("m:ss")}
        </Text>
      </TimeStampRow>
    </View>
  )
}

export function PlayerScreen({ navigation, route }) {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [currentTrack, setCurrentTrack] = useState<ModifiedTrack | null>(null);
  const snappedPlayer = useSnapshot(trackPlayer);
  // const [trackTitle, setTrackTitle] = React.useState<string>();
  // const [trackArtist, setTrackArtist] = React.useState<Track>();
  // const [trackArtwork, setTrackArtwork] = React.useState<Track["artwork"]>();
  console.log("player screen", navigation, route);
  const {
    al: { name: songTitle, picUrl },
    ar,
  } = route.params.track;
  console.log("player picurl", picUrl, "screen width", width);
  const artists =
    ar.length == 1
      ? ar[0].name
      : ar.reduce((prev, curr) => prev.name + ", " + curr.name);
  // alert(JSON.stringify(progress))
  useTrackPlayerEvents(
    [Event.PlaybackTrackChanged, Event.PlaybackState, Event.PlaybackError],
    async (event) => {
      switch (event.type) {
        case Event.PlaybackTrackChanged:
          const track = await trackPlayer.getCurrentTrack(event.nextTrack);
          setCurrentTrack(track);
          break;
      }
    }
  );
  // React.useMemo( async () => setCurrentTrack(await snappedPlayer.getCurrentTrack()),
  //   [snappedPlayer.trackIndex]
  // );

  const handlePlay = async () => {
    if (currentTrack == null) {
      // TODO: Perhaps present an error or restart the playlist?
      ToastAndroid.show("Cannot play current track", ToastAndroid.SHORT);
    } else {
      trackPlayer.playOrPause();
    }

    // sound control
  };
  const handleShuffle = () => (trackPlayer.shuffle = !snappedPlayer.shuffle);
  const handleLoop = async () => {
    switch (snappedPlayer.repeatMode) {
      case RepeatMode.Off:
        trackPlayer.repeatMode = RepeatMode.Queue;
        break;
      case RepeatMode.Queue:
        trackPlayer.repeatMode = RepeatMode.Track;
        break;
      case RepeatMode.Track:
        trackPlayer.repeatMode = RepeatMode.Off;
        break;
    }
  };

  const svgStyle = useSvgStyle({});
  return (
    <View style={styles.container}>
      <Player>
        <Image
          style={styles.coverPage}
          source={{ uri: currentTrack?.artwork?.toString() }}
        />
        <View style={styles.titleView}>
          <CoverText currentTrack={currentTrack} />
          <SvgIcon name="Heart" {...svgStyle} color="pink" />
        </View>
        <ProgressBar progress={progress}/>
        <ControlView
          handleShuffle={handleShuffle}
          handlePlay={handlePlay}
          handleLoop={handleLoop}
        />
        {/* <LyricsBox>/
          <Text>Locate Helper</Text>
        </LyricsBox> */}
      </Player>
    </View>
  );
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  containerWidth: {
    width: contentWidth,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: contentWidth,
    lineHeight: contentWidth,
  },
  coverPage: {
    width: contentWidth,
    height: contentWidth,
    resizeMode: "center",
  },
});
