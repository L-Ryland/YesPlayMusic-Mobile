import React, {useEffect, useMemo, useState} from "react";
import {Dimensions, Image, SafeAreaView, ToastAndroid, TouchableHighlight, StyleSheet, ViewStyle} from "react-native";
import styled from "styled-components/native";
import Slider from "@react-native-community/slider";
import {ScrollView, SvgIcon, Text, useSvgStyle, View} from "@/components";
import dayjs from "dayjs";
import Duration from "dayjs/plugin/duration";
import {
  ModifiedTrack,
  RepeatMode,
  State as PlayingState,
  Event,
  trackPlayer,
  usePlaybackState,
  useProgress, useTrackPlayerEvents,
} from "@/hydrate/player";
import {useSnapshot} from "valtio";
import {ProgressState} from "react-native-track-player";
import useLyric from "@/hooks/useLyric";
import {lyricParser} from "@/utils/lyric";
import {Lyrics} from "@/components/Lyrics";
import {useQuery} from "react-query";

dayjs.extend(Duration);
const { width, height } = Dimensions.get("window");
const contentWidth = width * 0.8;
const Player = styled(View)`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  padding: 50px 26px 26px;
  flex: 1;
`;

const HeaderBar = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;

  width: ${contentWidth};
  height: 37px;
  left: 26px;
  top: 50px;
`;

function LeftControlButton() {}

function MiddleControlButton() {}

function RightControlButton() {}

const CoverText: React.FC<{ currentTrack: ModifiedTrack}> = ({
  currentTrack,
}) => {
  const ViewBox = styled(View)`
    align-content: flex-start;
    font-weight: bold;
  `;
  return (
    <ViewBox>
      <Text style={{ fontSize: 28 }} key="title">
        {currentTrack.title}
      </Text>
      <Text style={{ fontSize: 22 }} key="artists">
        {currentTrack.artist}
      </Text>
    </ViewBox>
  );
};
const PlayButton: React.FC = () => {
  const playingState = usePlaybackState();
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
  const { shuffle, repeatMode } = useSnapshot(trackPlayer);
  return (
    <ControlBox style={styles.containerWidth}>
      <TouchableHighlight onPress={handleShuffle}>
        <SvgIcon name="Shuffle" {...useSvgStyle({ active: shuffle })} />
      </TouchableHighlight>
      <TouchableHighlight onPress={() => trackPlayer.skipToPrevious()}>
        <SvgIcon name="Previous" {...svgStyle} />
      </TouchableHighlight>
      <TouchableHighlight onPress={handlePlay}>
        <PlayButton />
      </TouchableHighlight>
      <TouchableHighlight onPress={() => trackPlayer.skipToNext()}>
        <SvgIcon name="Next" {...svgStyle} />
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
const ProgressBar: React.FC<{ progress: ProgressState }> = ({ progress }) => {
  const TimeStampRow = styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0;
    width: ${width * 0.8};
    height: 50px;
  `;
  return (
    <View>
      <Slider
        key="slider"
        style={{ width: .8 * width, height: 30 }}
        value={progress.position}
        minimumValue={0}
        maximumValue={progress.duration}
        thumbTintColor="#335eea"
        minimumTrackTintColor="#335eea"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => trackPlayer.seekTo(value)}
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
  );
};

export function PlayerScreen({ navigation, route }) {
  const playbackState = usePlaybackState();
  const [enableScrollViewScroll, setEnableScrollViewScroll] = useState<boolean>(true);
  const progress = useProgress();
  const snappedPlayer = useSnapshot(trackPlayer);
  const [currentTrack, setCurrentTrack] = useState<ModifiedTrack | null>();
  useEffect( () => {
    if (!currentTrack) trackPlayer.getCurrentTrack().then(data => setCurrentTrack(data))
  },[currentTrack]);
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

  const { data: lyricRaw } = useLyric({ id: currentTrack?.id ?? 0 });
  const lyric = useMemo(() => lyricRaw && lyricParser(lyricRaw), [lyricRaw]);
  // React.useMemo( async () => setCurrentTrack(await snappedPlayer.getCurrentTrack()),
  //   [snappedPlayer.trackIndex]
  // );
  // test if current song has lyrics.
  const hasLyrics: boolean = useMemo(() => !(lyricRaw && lyricParser(lyricRaw).lyric === []), [snappedPlayer.track])
  const PlayerBox = hasLyrics ? ScrollView : View;
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
      <PlayerBox style={styles.container} scrollEnabled={enableScrollViewScroll}>
        <Player>
          <Image
            style={styles.coverPage}
            source={{ uri: currentTrack?.artwork?.toString() }}
          />
          <View style={styles.titleView}>
            {currentTrack && <CoverText currentTrack={currentTrack} />}
            <SvgIcon name="Heart" {...svgStyle} color="pink" />
          </View>
          <ProgressBar progress={progress} />
          <ControlView
            handleShuffle={handleShuffle}
            handlePlay={handlePlay}
            handleLoop={handleLoop}
          />
          {hasLyrics && (
            <Lyrics lyric={lyric} onEnableScroll={setEnableScrollViewScroll}/>
          )}
        </Player>
      </PlayerBox>
  );
}

const ControlBox = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 0 0 20px 0;
  position: relative;
  height: 50px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  } as ViewStyle,
  containerWidth: {
    width: contentWidth,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 100,
    width: contentWidth,
    lineHeight: contentWidth,
  },
  coverPage: {
    width: contentWidth,
    height: contentWidth,
    resizeMode: "center",
  },
});
