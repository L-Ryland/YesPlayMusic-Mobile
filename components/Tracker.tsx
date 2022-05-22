import React, {Fragment, useEffect, useMemo, useState} from "react";
import {
  Platform,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacityProps,
} from "react-native";
import {
  SvgIcon,
  Text,
  TextProps,
  useSvgStyle,
  View,
} from "@/components/Themed";
import type { ModifiedTrack } from "@/hydrate/player";
import {
  Event,
  trackPlayer,
  usePlaybackState,
  useTrackPlayerEvents,
} from "@/hydrate/player";
import styled from "styled-components/native";
import { State } from "react-native-track-player";
import { useNavigation } from "@react-navigation/core";
import {useSnapshot} from "valtio";

const TrackerBox = styled(View)`
  flex-direction: row;
  height: 64px;
  background: #2c2c2e;
  border-radius: 12px;
  justify-content: space-between;
`;
const SongInfo: React.FC<{
  currentTrack: ModifiedTrack | null;
}> = ({ currentTrack }) => {
  const SongBox = styled(View)`
    flex-direction: row;
    margin: 8px 15px 0 8px;
    background: transparent;
  `;
  const Cover = styled.Image`
    height: 48px;
    width: 48px;
    border-radius: 5px;
    align-self: flex-start;
  `;
  const ArtistLine = styled(View)`
    margin-left: 10px;
    padding: 2px;
    align-self: flex-start;
    background: transparent;
  `;
  const Title = styled(Text).attrs(
    (): TextProps => ({
      numberOfLines: 1,
      ellipsizeMode: "tail",
    })
  )``;
  const navigation = useNavigation();
  return (
    <TouchableHighlight onPress={() => navigation.navigate("Player")}>
      <SongBox>
        <Cover source={{ uri: currentTrack?.artwork?.toString() }} />
        <ArtistLine>
          <Title style={{ fontSize: 15 }}>{currentTrack?.title}</Title>
          <Title style={{ color: "#ccc", fontSize: 13, paddingTop: 4 }}>
            {currentTrack?.artist}
          </Title>
        </ArtistLine>
      </SongBox>
    </TouchableHighlight>
  );
};

const ControlBox: React.FC = () => {
  const ControlViewBox = styled(View)`
    margin: 15px 0 15px 15px;
    flex-direction: row;
    padding: 12px;
    align-items: center;
    background: transparent;
  `;
  const svgStyle = useSvgStyle({});
  const nextIconStyle = useSvgStyle({ height: 20, width: 20 });
  const Button: React.FC<
    TouchableOpacityProps & { name; svgStyle }
  > = styled.TouchableOpacity.attrs(
    ({ name, svgStyle }: { name; svgStyle }) => ({
      children: [<SvgIcon key={name} name={name} {...svgStyle} />],
    })
  )`
    padding: 6px;
  `;

  const isSongPlaying: boolean = usePlaybackState() === State.Playing;
  return (
    <ControlViewBox>
      <Button
        name={isSongPlaying ? "Pause" : "Play"}
        svgStyle={svgStyle}
        onPress={() => trackPlayer.playOrPause()}
      />
      <Button
        name="Next"
        svgStyle={nextIconStyle}
        onPress={() => trackPlayer.skipToNext()}
      />
    </ControlViewBox>
  );
};

export const Tracker = React.memo((props) => {
  // const [currentTrack, setCurrentTrack] =
  //   React.useState<ModifiedTrack | null>();
  if (Platform.OS == "web") {
    return <Fragment />;
  }
  const [currentTrack, setCurrentTrack] = useState<ModifiedTrack | null>(null);
  const playingState = usePlaybackState();
  const snappedPlayer = useSnapshot(trackPlayer);
  useEffect(() => setCurrentTrack(snappedPlayer.track), [snappedPlayer.track]);
  // const currentTrack = useMemo( () => snappedPlayer.track, [snappedPlayer.track]);
  // useTrackPlayerEvents(
  //   [Event.PlaybackTrackChanged, Event.PlaybackState, Event.PlaybackError],
  //   async (event) => {
  //     switch (event.type) {
  //       case Event.PlaybackTrackChanged:
  //         const track = await trackPlayer.getCurrentTrack(event.nextTrack);
  //         setCurrentTrack(track);
  //         break;
  //     }
  //   }
  // );
  return currentTrack ? (
    <View style={styles.tracker}>
      {/*<Text>*/}
      {/*  Track Helper {`current track - ${JSON.stringify(currentTrack)}`}*/}
      {/*</Text>*/}
      <TrackerBox>
        <SongInfo currentTrack={currentTrack} />
        <ControlBox />
      </TrackerBox>
    </View>
  ) : (
    <View></View>
  );
});
Tracker.displayName = "Tracker";

const styles = StyleSheet.create({
  tracker: {
  },
});
