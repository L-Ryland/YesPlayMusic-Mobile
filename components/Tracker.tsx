import React from "react";
import {Platform, StyleSheet, ToastAndroid} from "react-native";
import { View, Text } from "@/components/Themed";
import { trackPlayer, usePlaybackState, useTrackPlayerEvents, Event } from "@/hydrate/player";
import type { ModifiedTrack } from "@/hydrate/player";

import { useSnapshot } from "valtio";
import {useQuery} from "react-query";

export const Tracker = React.memo((props) => {
  console.log("tracker props", props);
  const [currentTrack, setCurrentTrack] =
    React.useState<ModifiedTrack | null>();
  if (Platform.OS == "web") {
    return <View></View>;
  }
  const playingState = usePlaybackState();
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
  return currentTrack? (
    <View style={styles.tracker}>
      <Text>Track Helper {`current track - ${JSON.stringify(currentTrack)}`}</Text>
    </View>
  ) : (
    <View></View>
  );
});
Tracker.displayName = "Tracker";

const styles = StyleSheet.create({
  tracker: {},
});
