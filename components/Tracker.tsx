import React from 'react'
import { Platform, StyleSheet } from "react-native";
import { View, Text } from "@/components";
import { connect } from 'react-redux';

export const TrackerView = (props) => {
  console.log("tracker props", props);
  const { TrackPlayer, State } = props.player;
  const [currentTrack, setCurrentTrack] = React.useState({});

  if (Platform.OS == 'web') {
    return <View></View>;
  } 
  async function getCurrentTrack() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    setCurrentTrack(currentTrack);
    alert(JSON.stringify(currentTrack))
  }
  React.useEffect(() => {
    getCurrentTrack();

    return () => { }
  }, [])

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

function mapStateToProps(state) {
  const { player } = state;
  return { player };
}
function mapDispatchToProps(dispatch) {

}

export const Tracker = connect(mapStateToProps)(TrackerView);

