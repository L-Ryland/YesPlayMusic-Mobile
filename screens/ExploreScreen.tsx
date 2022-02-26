import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { selectSettings } from "@/redux/slice/settingsSlice";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

import { Text, ScrollView } from "../components/Themed";
import { CoverList } from "../components";
import {
  topPlaylist,
  highQualityPlaylist,
  recommendPlaylist,
  toplists,
} from "@/api";

export function ExploreScreen() {
  const settings = useAppSelector(selectSettings);
  // console.log(settings.enabledPlaylistCategories);
  const [activeCategory, setActiveCategory] = React.useState("全部");
  const [playlists, setPlaylists] = React.useState([]);
  const [hasMore, setHasMore] = React.useState([]);
  const mountRef = React.useRef(true);
  let response;
  /**
   * Fetch recommend playlist from api
   */
  const getRecommendPlayList = async () => {
    response = await recommendPlaylist({ limit: 30 });
    // setRecommendList(response.result);
    setPlaylists(response.result);
  };
  /**
   * Fetch high quality playlist from api
   */
  const getHighQualityPlaylist = async () => {
    let before =
      playlists.length !== 0 ? playlists[playlists.length - 1].updateTime : 0;
    response = await highQualityPlaylist({
      limit: 50,
      before,
      cat: activeCategory,
    });
    // setHqlist(response.playlists);
    setPlaylists(response.playlists);
    setHasMore(response.more);
  };

  /**
   * Fetch top list from api
   */
  const getTopLists = async () => {
    response = await toplists();
    // setToplist(response.list);
    setPlaylists(response.list);
  };

  /**
   *  Fetch topPlaylist from api
   */
  const getTopPlayList = async () => {
    response = await topPlaylist({
      cat: activeCategory,
    });
    console.log(response.playlists);
    setPlaylists(response.playlists);
    setHasMore(response.more);
  };
  React.useEffect(() => {
    (async () => {
      switch (activeCategory) {
        case "推荐歌单":
          await getRecommendPlayList();
          break;
        case "精品歌单":
          await getHighQualityPlaylist();
          break;
        case "排行榜":
          await getTopLists();
          break;
        default:
          await getTopPlayList();
          break;
      }
    })();
    return () => {
      mountRef.current = false;
    };
  }, [activeCategory, mountRef]);
  const upadatePlaylist = (first) => {};
  const subText =
    activeCategory === "排行榜"
      ? "updateFrequency"
      : activeCategory === "推荐歌单"
      ? "copywriter"
      : "none";
  const handleCatogorySwitch = (category) => {
    setActiveCategory(category);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Explore</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/Explore.tsx" /> */}
      <Text style={styles.title}>Explore</Text>
      <ButtonContainer horizontal={true} style={{ flex: 1 }}>
        {settings.enabledPlaylistCategories.map((category, index) => (
          <CatagoryButton
            key={index}
            onPress={() => handleCatogorySwitch(category)}
          >
            <Text>{category}</Text>
          </CatagoryButton>
        ))}
      </ButtonContainer>
      {playlists && (
        <CoverList
          type="playlist"
          items={playlists}
          sub-text={subText}
          show-play-count={activeCategory !== "排行榜" ? true : false}
          image-size={activeCategory !== "排行榜" ? 512 : 1024}
        />
      )}
    </ScrollView>
  );
}

const ButtonContainer = styled.ScrollView`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;
const CatagoryButton = styled.Pressable`
  height: 4%;
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 10px 16px 6px 0;
  // display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  border-radius: 2rem;
  border: 2px white;
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary);
`;
const styles = StyleSheet.create({
  container: {
    flex: 2,
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
