import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchLikedThings, fetchUserProfile, selectData } from "@/redux/slice/dataSlice";
import { StyleSheet, Button, Dimensions, ImageBackground } from "react-native";
import { Title, useSvgStyle } from "@/components/Themed";
import { Play } from "@/components/icons";

import i18n, { t } from 'i18n-js';

// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import Login from "./LoginScreen";
import styled from "styled-components/native";
import { database } from "@/index";
import { Row } from "react-native-settings-screen/dist/lib/Row";

const { width } = Dimensions.get('window')
export const LibraryScreen = () => {
  const data = useAppSelector(selectData);
  const { user, liked } = data;
  const dispatch = useAppDispatch();
  const svgStyle = useSvgStyle({});
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

  return (
    <SafeAreaView>
      <RowView >
        <Title>{user.nickname ?? ""}{t('library.sLibrary')} </Title>
      </RowView>
      <Button title='userProfile' onPress={handleThunkTest} />
      <Button title='delete test database' onPress={handleDatabase} />
      <RowView >
        <ImageBackground
          source={{ uri: user.backgroundUrl }}
          resizeMode='cover'
          style={styles.likedSongBox}
          imageStyle={styles.backgroundStyle}
          blurRadius={10}
        >
          <Text style={{ fontSize: 32, flex:1 }}>{t('library.likedSongs')}</Text>
          <RowView style={{ backgroundColor: 'transparent', flex:1,justifyContent: 'center'}}>
            <RowView style={{ backgroundColor: 'transparent', flex: 1, margin: 5 }}>
              <Text style={{ fontSize: 18 }}>{t('common.songs')}</Text>
            </RowView>
            <RowView style={{ backgroundColor: 'transparent', flex: 1, margin: 5 }}>
              <Play {...svgStyle} color='black' />
            </RowView>
          </RowView>

        </ImageBackground>
        <View style={{ flex: 1 }}>

        </View>
      </RowView>

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
    borderRadius: 22,
    opacity: 0.5,
  }
});
