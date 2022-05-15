import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  FlatList,
  LogBox,
  ToastAndroid,
} from "react-native";
import {
  Title,
  useSvgStyle,
  Button,
  ScrollView,
  CoverTitle,
  CoverSubTitle,
} from "@/components/Themed";
import { Play } from "@/components/icons";

import i18n, { t } from "i18n-js";

// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "@/components";
import styled from "styled-components/native";
import { database } from "@/index";
import { CoverRow } from "@/components";
import { userData } from "@/hydrate/data";
import useUserPlaylists from "@/hooks/useUserPlaylists";
import usePlaylist from "@/hooks/usePlaylist";
import useUserAlbums from "@/hooks/useUserAlbums";
import useUser from "@/hooks/useUser";
import useUserArtists from "@/hooks/useUserArtists";
import {
  LibraryStackScreenProps,
} from "@/types";
import useUserLikedTracksIDs, {
  useUserLikedTracks,
} from "@/hooks/useUserLikedTracksIDs";

const { width } = Dimensions.get("window");

enum Category {
  Playlists,
  Albums,
  Artists,
  MVs,
  CloudDisk,
  TopListen,
}

const LikedSongs = ({ item }) => {
  const {
    ar,
    al: { picUrl: uri },
  } = item;
  const artists: string =
    ar.length == 1
      ? ar[0].name
      : ar.reduce(({ name: prev }, { name: cur }) => prev + ", " + cur);
  return (
    <View style={styles.card2}>
      <Image style={styles.tinyLogo} source={{ uri }} />
      <View style={styles.titleBox}>
        <Text style={styles.titleName}>{item.name}</Text>
        <Text style={styles.artists}>{artists}</Text>
      </View>
    </View>
  );
};
const LikedPlaylists = ({ item }) => (
  <View style={styles.card3}>
    <Image style={styles.tinyLogo2} source={{ uri: item.coverImgUrl }} />
    <View style={styles.titleBox}>
      <CoverTitle numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </CoverTitle>
      <CoverSubTitle numberOfLines={1} ellipsizeMode="tail">
        by {item.creator.nickname}
      </CoverSubTitle>
    </View>
  </View>
);
const UserCard = ({ profile }) => {
  const svgStyle = useSvgStyle({});
  const { data: playlists } = useUserPlaylists();
  const { data: likedSongsPlaylist } = usePlaylist({
    id: playlists?.playlist?.[0].id ?? 0,
  });
  // const {data} = useUserLikedTracksIDs();
  const { data: likedTracks } = useUserLikedTracks();
  return (
    <RowView>
      <ImageBackground
        source={{ uri: profile?.backgroundUrl }}
        resizeMode="cover"
        style={styles.likedSongBox}
        imageStyle={styles.backgroundStyle}
        blurRadius={10}
      >
        <Text style={styles.leftTitle}>{t("library.likedSongs")}</Text>
        <Text style={styles.leftTitleSmail} numberOfLines={2}>
          {likedSongsPlaylist?.playlist.trackCount ?? 0} {t("common.songs")}
        </Text>
        <RowView
          style={{
            backgroundColor: "transparent",
            flex: 1.5,
            marginBottom: 20,
            marginRight: 20,
            justifyContent: "flex-end",
          }}
        >
          <Play {...svgStyle} color="black" height={45} width={45} />
        </RowView>
      </ImageBackground>
      {likedTracks?.songs && (
        <FlatList
          style={{ flex: 1 }}
          data={likedTracks.songs.slice(0, 3)}
          renderItem={LikedSongs}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={3}
          nestedScrollEnabled={true}
        />
      )}
    </RowView>
  );
};
const UserPlaylists = () => {
  const { data: playlists } = useUserPlaylists();
  const { data: likedSongsPlaylist } = usePlaylist({
    id: playlists?.playlist?.[0].id ?? 0,
  });
  return (
    <CoverRow
      type="playlist"
      items={playlists?.playlist.slice(0, 8)}
      imageSize={1024}
      verticalStyle={true}
    />
  );
};
const UserAlbums = () => {
  const { data: albums } = useUserAlbums({
    limit: 1000,
  });
  return (
    <CoverRow
      type="playlist"
      items={albums?.data.slice(0, 8)}
      imageSize={1024}
      verticalStyle={true}
    />
  );
};
const UserArtists = () => {
  const { data: artists } = useUserArtists();
  return (
    <CoverRow
      type="artist"
      items={artists?.data.slice(0, 8)}
      imageSize={1024}
      verticalStyle={true}
    />
  );
};
const SwitchCatagory: React.FC<{ category: Category }> = ({ category }) => {
  switch (category) {
    case Category.Playlists:
      return <UserPlaylists />;
    case Category.Albums:
      return <UserAlbums />;
    case Category.Artists:
      return <UserArtists />;
    default:
      ToastAndroid.show("Still Working On That", ToastAndroid.SHORT);
      return <View></View>;
  }
};
export const LibraryScreen = ({
  navigation,
}: LibraryStackScreenProps<"Library">) => {
  const svgStyle = useSvgStyle({});
  const [category, setCategory] = React.useState<Category>(Category.Playlists);
  const handleDatabase = async () => {
    await database.write(async () => {
      const post = await database.unsafeResetDatabase();
      return post;
    });
  };
  // console.log("liked", liked);
  const { data: user } = useUser();
  const { data: playlists } = useUserPlaylists();
  const { data: likedSongsPlaylist } = usePlaylist({
    id: playlists?.playlist?.[0].id ?? 0,
  });
  React.useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    console.log("[LibraryScreen] [userData]", userData);
    if (!userData.loginMode) navigation.navigate("Login");
  }, [userData.loginMode, user?.profile]);
  return (
    <SafeAreaView>
      <ScrollView>
        <RowView>
          <Title>
            {user?.profile?.nickname ?? ""}
            {t("library.sLibrary")}{" "}
          </Title>
        </RowView>
        <Button title="delete test database" onPress={handleDatabase} />
        {/*<ScrollView>*/}
        <UserCard profile={user?.profile} />
        <ScrollView horizontal={true}>
          <Button
            title={t("library.playlists")}
            onPress={() => setCategory(Category.Playlists)}
          />
          <Button
            title={t("library.albums")}
            onPress={() => setCategory(Category.Albums)}
          />
          <Button
            title={t("library.artists")}
            onPress={() => setCategory(Category.Artists)}
          />
          <Button
            title={t("library.mvs")}
            onPress={() => setCategory(Category.MVs)}
          />
          <Button
            title={t("library.cloudDisk")}
            onPress={() => setCategory(Category.CloudDisk)}
          />
          <Button
            title={t("library.topListen")}
            onPress={() => setCategory(Category.TopListen)}
          />
        </ScrollView>
        <SwitchCatagory category={category} />
        {/*</ScrollView>*/}
      </ScrollView>
    </SafeAreaView>
  );
};

const RowView = styled(View)`
  flex-direction: row;
`;
const styles = StyleSheet.create({
  topView: {
    backgroundColor: "#2B2F31",
  },
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  likedSongBox: {
    flex: 1,
    borderRadius: 100,
    justifyContent: "center",
    height: (1 / 2) * width - 20,
    marginRight: 20,
    marginLeft: 20,
  },
  backgroundStyle: {
    borderRadius: 22,
    opacity: 0.5,
  },
  card: {
    margin: 5,
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  card2: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  card3: {
    marginVertical: 20,
  },
  leftTitle: {
    fontSize: 25,
    flex: 2,
    marginTop: 10,
    marginHorizontal: 10,
  },
  leftTitleSmail: {
    fontSize: 18,
    flex: 2,
    marginHorizontal: 10,
  },
  tinyLogo: {
    borderRadius: 7,
    width: 34,
    height: 34,
    margin: 5,
  },
  tinyLogo2: {
    borderRadius: 19,
    width: (1 / 2) * width - 30,
    height: (1 / 2) * width - 30,
  },
  titleName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  artists: {
    fontSize: 12,
  },
  leftTitleBig: {
    margin: 5,
    flex: 1,
    fontSize: 28,
  },

  titleBox: {
    width: (1 / 2) * width - 10,
  },

  middleTitleSub: {
    fontSize: 16,
    color: "#A5A4A3",
  },
});
