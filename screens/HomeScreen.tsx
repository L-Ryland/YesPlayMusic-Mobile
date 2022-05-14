import { StyleSheet, Appearance, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";

import { Text, ScrollView, Title } from "@/components";
import { CoverRow, DailyTracksCard, FMCard, Tracker } from "@/components";
import { RootTabScreenProps } from "@/types";
import { byAppleMusic } from "@/utils/staticData";
import {
  fetchRecommendedPlaylists,
  newAlbums,
  toplistOfArtists,
  toplists,
  topPlaylist,
} from "@/api";
import {useSnapshot} from "valtio";
import {settings} from "@/hydrate/settings";

export function HomeScreen(props: RootTabScreenProps<"Home">) {
  const [recommendPlaylists, setRecommendPlaylists] = useState(undefined);
  const [newAlbum, setNewAlbum] = useState(undefined);
  const [topArtists, setTopArtists] = useState(undefined);
  const [toplist, setToplist] = useState(undefined);
  const [data, setData] = useState(undefined);
  const fetchData = async () => {
    fetchRecommendedPlaylists({ limit: 30 }).then((data: any) => {
      setRecommendPlaylists(data.result);
    });
    newAlbums({ limit: 10, area: "ALL" }).then((data: any) => {
      setNewAlbum(data.albums);
    });
    // setNewAlbum(response.albums);
    const snappedSettings = useSnapshot(settings);
    const toplistOfArtistsAreaTable = {
      all: undefined,
      zh: 1,
      ea: 2,
      jp: 4,
      kr: 3,
    };
    toplistOfArtists(
      // toplistOfArtistsAreaTable[settings.musicLanguage]
      { type: toplistOfArtistsAreaTable[snappedSettings.musicLanguage] }
    ).then((data: any) => {
      let indexs: Number[] = [];
      while (indexs.length < 6) {
        let tmp = ~~(Math.random() * 100);
        if (!indexs.includes(tmp)) indexs.push(tmp);
      }
      const filterArtists = data.list.artists.filter((l, index) =>
        indexs.includes(index)
      );

      setTopArtists(filterArtists);
    });
    toplists().then((data: any) => {
      setToplist(data.list);
    });
    // response = await toplists();
    // setToplist(response.list);
    // response = await topPlaylist();
    // console.log(response);
  };

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);
  // console.log(recommendPlaylists, newAlbum);
  // console.log(data);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Title>by Apple Music</Title>
        <CoverRow
          rowNumber={1}
          type="playlist"
          items={byAppleMusic}
          subText="by AppleMusic"
          imageSize={1024}
          navigate={props.navigation.navigate}
        />
        <Title>Recommended PlayLists</Title>
        {!recommendPlaylists ? (
          <Text>Loading</Text>
        ) : (
          <CoverRow
            rowNumber={2}
            type="playlist"
            items={recommendPlaylists}
            subText="copywriter"
            navigate={props.navigation.navigate}
          />
        )}
        <Title>For You</Title>
        <DailyTracksCard />
        <FMCard />
        <Text style={styles.title}>Recommended Artists</Text>
        <CoverRow
          rowNumber={1}
          type="artist"
          items={topArtists}
          navigate={props.navigation.navigate}
        />

        <Title>Latest Albums</Title>
        {!newAlbum ? (
          <Text>Loading</Text>
        ) : (
          <CoverRow
            rowNumber={1}
            type="album"
            items={newAlbum}
            subText="artist"
            navigate={props.navigation.navigate}
          />
        )}
        <Title>Charts</Title>
        {!toplist ? (
          <Text>Loading</Text>
        ) : (
          <CoverRow
            rowNumber={1}
            type="playlist"
            items={toplist}
            subText="updateFrequency"
            navigate={props.navigation.navigate}
          />
        )}
      </ScrollView>
      <Tracker />
    </SafeAreaView>
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
