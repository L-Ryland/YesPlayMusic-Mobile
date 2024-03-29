import React from "react";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

import { Button, ScrollView, Text } from "../components/Themed";
import { CoverRow, Subtitle, Tracker } from "../components";
import {
  fetchHighQualityPlaylist,
  fetchRecommendedPlaylists,
  fetchToplists,
  topPlaylist,
} from "@/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { settings } from "@/hydrate/settings";
import {State, usePlaybackState} from "@/hydrate/player";

export function ExploreScreen({ navigation, route }) {
  // console.log(settings.enabledPlaylistCategories);
  const [activeCategory, setActiveCategory] = React.useState("全部");
  const [playlists, setPlaylists] = React.useState([]);
  const [hasMore, setHasMore] = React.useState([]);
  const [scrollEnabled, setScrollEnabled] = React.useState<boolean>(true);
  const [coverRowScroll, setCoverRowScroll] = React.useState<boolean>(false);
  const mountRef = React.useRef<boolean>(true);
  const playingState = usePlaybackState();
  /**
   * Fetch recommend playlist from api
   */
  const getRecommendPlayList = () => {
    fetchRecommendedPlaylists({ limit: 30 }).then((data: any) => {
      setPlaylists(data.result);
    });
  };
  /**
   * Fetch high quality playlist from api
   */
  const getHighQualityPlaylist = () => {
    // let before =
    //   playlists.length !== 0 ? playlists[playlists.length - 1].updateTime : 0;
    let before = playlists.length;
    if (playlists.length !== 0) {
      const { updateTime } = playlists[playlists.length - 1];
      before = updateTime;
    }
    fetchHighQualityPlaylist({
      limit: 50,
      before,
      cat: activeCategory,
    }).then((data: any) => {
      setPlaylists(data.playlists);
      setHasMore(data.more);
    });
    // setHqlist(response.playlists);
  };

  /**
   * Fetch top list from api
   */
  const getTopLists = () => {
    fetchToplists().then((data: any) => {
      setPlaylists(data.list);
    });
    // setToplist(response.list);
  };

  /**
   *  Fetch topPlaylist from api
   */
  const getTopPlayList = () => {
    topPlaylist({
      cat: activeCategory,
    }).then((data: any) => {
      setPlaylists(data.playlists);
      setHasMore(data.more);
    });
  };
  React.useEffect(() => {
    switch (activeCategory) {
      case "推荐歌单":
        getRecommendPlayList();
        break;
      case "精品歌单":
        getHighQualityPlaylist();
        break;
      case "排行榜":
        getTopLists();
        break;
      default:
        getTopPlayList();
        break;
    }
    return () => {
      mountRef.current = false;
    };
  }, [activeCategory, mountRef]);
  const subText =
    activeCategory === "排行榜"
      ? "updateFrequency"
      : activeCategory === "推荐歌单"
      ? "copywriter"
      : "none";
  const handleCategorySwitch = (category) => {
    setActiveCategory(category);
  };
  const scrollListener = ({
    nativeEvent,
  }: {
    nativeEvent: {
      contentSize: { height: number };
      contentOffset: { y: number };
      layoutMeasurement: { height: number };
    };
  }) => {
    // if (y > 250) alert(`scroll event - ${JSON.stringify(y)}`);
    const { contentSize, contentOffset, layoutMeasurement } = nativeEvent;
    setCoverRowScroll(false);
    const screenOffset = playingState === State.None ? contentSize.height - layoutMeasurement.height : contentSize.height - layoutMeasurement.height - 64;
    if (contentOffset.y >= screenOffset) {
      // setScrollEnabled(false);
      setCoverRowScroll(true)
    }
    // if (contentOffset.y > 230) setScrollEnabled(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView onScroll={scrollListener} scrollEnabled={scrollEnabled}>
        {/* <Text style={styles.title}>Explore</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/Explore.tsx" /> */}
        <Text style={styles.title}>Explore</Text>
        <ButtonContainer horizontal={true} style={{ flex: 1 }}>
          {settings.enabledPlaylistCategories.map((category, index) => (
            <Button
              key={index}
              onPress={() => handleCategorySwitch(category)}
              title={category}
            />
          ))}
        </ButtonContainer>
        {playlists && (
          <CoverRow
            type="playlist"
            items={playlists}
            subtitle={Subtitle.Creator}
            showPlayCount={activeCategory !== "排行榜" ? true : false}
            imageSize={activeCategory !== "排行榜" ? 512 : 1024}
            verticalStyle={true}
            setOuterScroll={setScrollEnabled}
            setInnerScroll={coverRowScroll}
          />
        )}
      </ScrollView>
      <Tracker />
    </SafeAreaView>
  );
}

const ButtonContainer = styled(ScrollView)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;
const CatagoryButton = styled.Pressable`
  height: 4%;
  padding: 8px 16px;
  margin: 10px 16px 6px 0;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  border-radius: 32px;
  border: 2px white;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
    fontSize: 40,
    fontWeight: "700",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
