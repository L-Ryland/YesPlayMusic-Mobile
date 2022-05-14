import React from 'react'
import { Platform, StyleSheet } from "react-native";
import { View, Text } from "@/components/Themed";
import {ModifiedTrack, trackPlayer} from "@/hydrate/player";
import {useSnapshot} from "valtio";

export const Tracker = (props) => {
  console.log("tracker props", props);
  const snappedPlayer = useSnapshot(trackPlayer);
  const [currentTrack, setCurrentTrack] = React.useState<ModifiedTrack | null>();
  if (Platform.OS == 'web') {
    return <View></View>;
  }
  React.useMemo(async ()=>setCurrentTrack(await snappedPlayer.getCurrentTrack()), [snappedPlayer]);

  return (
    currentTrack ? <View style={styles.tracker}>
      <Text>Track Helper</Text>
    </View> : <View></View>
  )
}
const styles = StyleSheet.create({
  tracker: {

  }
})



