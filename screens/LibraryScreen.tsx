import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchLikedThings, fetchUserProfile, selectData } from "@/redux/slice/dataSlice";
import { StyleSheet, Dimensions, ImageBackground, Image, FlatList } from "react-native";
import { Title, useSvgStyle, Button, ScrollView, CoverTitle, CoverSubTitle } from "@/components/Themed";
import { Play } from "@/components/icons";

import i18n, { t } from 'i18n-js';

// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import Login from "./LoginScreen";
import styled from "styled-components/native";
import { database } from "@/index";

const { width } = Dimensions.get('window')
export const LibraryScreen = () => {
  const data = useAppSelector(selectData);
  const { user, liked } = data;
  const dispatch = useAppDispatch();
  const svgStyle = useSvgStyle({});
  const [likedSongs, setLikedSongs] = React.useState<object[]>();
  const handleThunkTest = () => {
    dispatch(fetchUserProfile()).then(
      (action) => {
        dispatch(fetchLikedThings(action.payload));
      }
    )
  }
  const handleDatabase = async () => {
    await database.write(async () => {

      const post = await database.unsafeResetDatabase();
      return post;
    })
  }
  if (!data?.loginMode) {
    return <Login />;
  } else if (user == {}) {
    return;
  }
  console.log("liked", liked);
  const DATA = [0, 1, 2, 3, 4, 5]

  const LikedSongs = ({ item }) => (
    <View style={styles.card2}>
      <Image
        style={styles.tinyLogo}
        source={{ uri: user.backgroundUrl }}
      />
      <View style={styles.titleBox}>
        <Text style={styles.titleBig}>{"aaa"}</Text>
        <Text style={styles.titleSmail}>{"aaa"}</Text>
      </View>
    </View>
  );
  const LikedPlaylists = ({ item }) => (
    <View style={styles.card3}>
      <Image
        style={styles.tinyLogo2}
        source={{ uri: user.backgroundUrl }}
      />
      <View style={styles.titleBox}>
        <CoverTitle>{'aaa'}</CoverTitle>
        <CoverSubTitle>{'aaa'}</CoverSubTitle>
      </View>
    </View>
  );
  return (
    <SafeAreaView>
      <RowView>
        <Title>{user.nickname ?? ""}{t('library.sLibrary')} </Title>
      </RowView>
      <Button children='userProfile' onPress={handleThunkTest} />
      <Button children='delete test database' onPress={handleDatabase} />
      <ScrollView >
        <RowView >
          <ImageBackground
            source={{ uri: user.backgroundUrl }}
            resizeMode='cover'
            style={styles.likedSongBox}
            imageStyle={styles.backgroundStyle}
            blurRadius={10}
          >
            <Text style={styles.leftTitle}>{t('library.likedSongs')}</Text>
            <Text style={styles.leftTitleSmail} numberOfLines={2}>{liked.songs.length} {t('common.songs')}</Text>
            <RowView style={{ backgroundColor: 'transparent', flex:1.5, marginBottom: 20, marginRight: 20, justifyContent: 'flex-end' }}>
              <Play {...svgStyle} color='black' height={45} width={45} />
            </RowView>

          </ImageBackground>
          <FlatList style={{ flex: 1 }}
            data={DATA.slice(0, 3)}
            renderItem={LikedSongs}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={3} />
        </RowView>
        <RowView>
          <Button>全部歌单</Button>
          <Button>专辑</Button>
        </RowView>
        <View style={{ marginHorizontal: 20 }}>
          <FlatList
            data={DATA}
            numColumns={2}
            renderItem={LikedPlaylists}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={3}
          />
        </View>
      </ScrollView>


    </SafeAreaView>
  );
};

const RowView = styled(View)`
  flex-direction: row;
`
const styles = StyleSheet.create({
  topView: {
    backgroundColor: '#2B2F31',

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
    flexDirection: 'row',
    justifyContent: 'center',

  },
  likedSongBox: {
    flex: 1,
    borderRadius: 100,
    justifyContent: 'center',
    height: 1 / 2 * width - 20,
    marginRight: 20,
    marginLeft: 20
  },
  backgroundStyle: {
    borderRadius: 22,
    opacity: 0.5,

  },
  card: {
    margin: 5,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  card2: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  card3: {
    marginVertical: 20
  },
  leftTitle: {
    fontSize: 25,
    flex: 2,
    marginTop: 10,
    marginHorizontal: 10
  },
  leftTitleSmail: {
    fontSize: 18,
    flex: 2,
    marginHorizontal: 10
  },
  tinyLogo: {
    borderRadius: 7,
    width: 34,
    height: 34,
    margin: 5
  },
  tinyLogo2: {
    borderRadius: 19,
    width: 1 / 2 * width - 30,
    height: 1 / 2 * width - 30,
  },
  titleBig: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  titleSmail: {
    fontSize: 12,
  },
  leftTitleBig: {
    margin: 5,
    flex: 1,
    fontSize: 28,
  },

  titleBox: {
    width: 1 / 2 * width - 10
  },

  middleTitleSub: {
    fontSize: 16,
    color: '#A5A4A3',
  }
});
