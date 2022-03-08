import { StyleSheet, Appearance } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View, ScrollView } from "../components/Themed";
import { CoverRow, DailyTracksCard, FMCard } from "../components";
import { RootTabScreenProps } from "../types";
import { byAppleMusic } from "../utils/staticData.js";
import { useRecommendPlaylistQuery } from "@/redux/slice/apiSlice";
import {
  recommendPlaylist,
  newAlbums,
  toplistOfArtists,
  toplists,
  topPlaylist
} from "@/api";
import { useAppSelector } from "@/hooks/useRedux";
import { selectSettings } from "@/redux/slice/settingsSlice";

export function HomeScreen(props: RootTabScreenProps<"Home">) {
  const [recommendPlaylists, setRecommendPlaylists] = useState(undefined);
  const [newAlbum, setNewAlbum] = useState(undefined);
  const [topArtists, setTopArtists] = useState(undefined);
  const [toplist, setToplist] = useState(undefined);
  const [data, setData] = useState(undefined);
  const { currentData, isLoading } = useRecommendPlaylistQuery(undefined);
  // const recommendPlaylist = currentData?.result;
  const mountedRef = React.useRef(true);
  const settings = useAppSelector(selectSettings);
  const fetchData = () => {
    // let response: any;
    // response = await recommendPlaylist({ limit: 10});
    recommendPlaylist({limit: 30}).then(
      (data: any) => {
        setRecommendPlaylists(data.result);
      }
    );
    // setRecommendPlaylists(response.result);
    // response = await newAlbums({ limit: 10, area: "ALL" });
    // console.log(response);
    newAlbums({ limit: 10, area: 'ALL'}).then(
      (data: any) => {
        setNewAlbum(data.albums);
      }
    );
    // setNewAlbum(response.albums);
    const toplistOfArtistsAreaTable = {
      all: undefined,
      zh: 1,
      ea: 2,
      jp: 4,
      kr: 3,
    };
    toplistOfArtists(
      toplistOfArtistsAreaTable[settings.musicLanguage]
    ).then((data: any) => {
      let indexs: Number[] = [];
      while (indexs.length < 6) {
        let tmp = ~~(Math.random() * 100);
        if (!indexs.includes(tmp)) indexs.push(tmp);
      }
      const filterArtists = data.list.artists.filter((l, index) =>
        indexs.includes(index)
      );
      console.log("filtered artists", filterArtists);
      
      setTopArtists(filterArtists)
    });
    toplists().then(
      (data: any) => {
        setToplist(data.list);
      }
    );
    // response = await toplists();
    // setToplist(response.list);
    // response = await topPlaylist();
    // console.log(response);
    
  };
  
  useEffect(() => {
    if (mountedRef.current) {
      fetchData();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [mountedRef]);
  // console.log(recommendPlaylists, newAlbum);
  // console.log(data);
  
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
      <Text style={styles.title}>For You</Text>
      <DailyTracksCard />
      <FMCard />
      <Text style={styles.title}>Recommended Artists</Text>
      <CoverRow rowNumber={1} type="artist" items={topArtists} />
      <Text style={styles.title}>Latest Albums</Text>
      {!newAlbum ? (
        <Text>Loading</Text>
      ) : (
        <CoverRow
          rowNumber={1}
          type="album"
          items={newAlbum}
          sub-text="artist"
        />
      )}
      <Text style={styles.title}>Charts</Text>
      {!toplist ? (
        <Text>Loading</Text>
      ) : (
        <CoverRow
          rowNumber={1}
          type="playlist"
          items={toplist}
          sub-text="updateFrequency"
        />
      )}
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
