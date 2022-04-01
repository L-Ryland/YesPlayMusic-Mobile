import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchLikedPlaylist, fetchUserProfile, selectData } from "@/redux/slice/dataSlice";
import { StyleSheet, Button, Dimensions, ImageBackground } from "react-native";
import { Title } from "@/components/Themed";

import i18n, { t } from 'i18n-js';

// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import Login from "./LoginScreen";
import styled from "styled-components/native";

const { width } = Dimensions.get('window')
export const LibraryScreen = () => {
  const data = useAppSelector(selectData);
  const { user, liked } = data;
  const dispatch = useAppDispatch();
  const handleThunkTest = () => {
    dispatch(fetchUserProfile()).then(
      (action) => {
        dispatch(fetchLikedPlaylist(action.payload));
      }
    )
  }

  if (!data.loginMode && !user) {
    return <Login />;
  }
  console.log("liked", liked);

  return (
    <SafeAreaView>
      <RowView >
        <Title>{user.nickname ?? ""}{t('library.sLibrary')} </Title>
      </RowView>
      <Button title='userProfile' onPress={handleThunkTest} />
      <View style={styles.rowStyle}>
        <ImageBackground
          source={{ uri: user.backgroundUrl }}
          resizeMode='cover'
          style={styles.likedSongBox}
          imageStyle={styles.backgroundStyle}
          blurRadius={10}
          >
          <Text>{t('library.likedSongs')}</Text>
          <Text>{t('common.songs')}</Text>
        </ImageBackground>
        <View style={{ flex: 1 }}>

        </View>
      </View>

    </SafeAreaView>
  );
};

const RowView = styled(View)`
  flex-direction: row;
`
const styles = StyleSheet.create({
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
  },
  likedSongBox: {
    flex: 1,
    borderRadius: 100,
    height: 1 / 2 * width,
    marginLeft: 8,
  },
  backgroundStyle: {
    borderRadius: 100,
    opacity: 0.5,
  }
});
