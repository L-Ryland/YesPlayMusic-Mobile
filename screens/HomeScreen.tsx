import { StyleSheet, Appearance } from "react-native";
import { useRef, useState } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View, ScrollView } from "../components/Themed";
import { CoverRow } from "../components";
import { RootTabScreenProps } from "../types";
import { byAppleMusic } from "../utils/staticData.js";
import { useRecommendPlaylistQuery } from "@/redux/slice/apiSlice";



export function HomeScreen(props: RootTabScreenProps<"Home">) {

    const {
      currentData,
      isLoading
    } = useRecommendPlaylistQuery(undefined);
    const recommendPlaylist = currentData?.result
 
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>by Apple Music</Text>
      <CoverRow
        rowNumber={1}
        type="playlist"
        items={byAppleMusic}
        subText="by AppleMusic"
        imageSize={1024}
        navigate={props.navigation.navigate}
      />
      <Text style={styles.title} adjustsFontSizeToFit={true}>
        Recommended PlayLists
      </Text>
      {isLoading?<Text>Loading</Text>:
      <CoverRow
        rowNumber={2}
        type="playlist"
        items={recommendPlaylist}
        subText="copywriter"
        navigate={props.navigation.navigate}
      />}
      <Text style={styles.title}>For You</Text>
      <Text style={styles.title}>Recommended Artists</Text>
      <Text style={styles.title}>Latest Albums</Text>
      <Text style={styles.title}>Charts</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    fontSize: 40,
    fontWeight: "700",
  },
});
