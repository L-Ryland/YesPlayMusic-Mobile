import * as React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import {
  fetchLikedThings,
  fetchUserProfile,
  selectData,
} from '@/redux/slice/dataSlice'
import {
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native'
import {
  Title,
  useSvgStyle,
  Button,
  ScrollView,
  CoverTitle,
  CoverSubTitle,
} from '@/components/Themed'
import { Play } from '@/components/icons'

import i18n, { t } from 'i18n-js'

// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from '../components/Themed'
import Login from './LoginScreen'
import styled from 'styled-components/native'
import { database } from '@/index'
import { CoverRow } from '@/components'

const { width } = Dimensions.get('window')
export const LibraryScreen = () => {
  const data = useAppSelector(selectData)
  const { user, liked } = data
  const dispatch = useAppDispatch()
  const svgStyle = useSvgStyle({})
  const [category, setCategory] = React.useState<
    'playlists' | 'albums' | 'artists' | 'mvs' | 'cloudDisk' | 'topListen'
  >('playlists')
  const handleThunkTest = () => {
    dispatch(fetchUserProfile()).then((action) => {
      dispatch(fetchLikedThings(action.payload))
    })
  }
  const handleDatabase = async () => {
    await database.write(async () => {
      const post = await database.unsafeResetDatabase()
      return post
    })
  }
  if (!data?.loginMode) {
    return <Login />
  } else if (user == {} || !liked) {
    return <></>
  }
  // console.log("liked", liked);
  const DATA = [0, 1, 2, 3, 4, 5]

  const LikedSongs = ({ item }) => {
    console.log('likedSong item', item)

    const {
      ar,
      al: { picUrl: uri },
    } = item
    const artists: string =
      ar.length == 1
        ? ar[0].name
        : ar.reduce(({ name: prev }, { name: cur }) => prev + ', ' + cur)
    return (
      <View style={styles.card2}>
        <Image style={styles.tinyLogo} source={{ uri }} />
        <View style={styles.titleBox}>
          <Text style={styles.titleName}>{item.name}</Text>
          <Text style={styles.artists}>{artists}</Text>
        </View>
      </View>
    )
  }
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
  )
  return (
    <SafeAreaView>
      <RowView>
        <Title>
          {user.nickname ?? ''}
          {t('library.sLibrary')}{' '}
        </Title>
      </RowView>
      <Button title="userProfile" onPress={handleThunkTest} />
      <Button title="delete test database" onPress={handleDatabase} />
      <ScrollView>
        <RowView>
          <ImageBackground
            source={{ uri: user.backgroundUrl }}
            resizeMode="cover"
            style={styles.likedSongBox}
            imageStyle={styles.backgroundStyle}
            blurRadius={10}
          >
            <Text style={styles.leftTitle}>{t('library.likedSongs')}</Text>
            <Text style={styles.leftTitleSmail} numberOfLines={2}>
              {liked?.songs?.length} {t('common.songs')}
            </Text>
            <RowView
              style={{
                backgroundColor: 'transparent',
                flex: 1.5,
                marginBottom: 20,
                marginRight: 20,
                justifyContent: 'flex-end',
              }}
            >
              <Play {...svgStyle} color="black" height={45} width={45} />
            </RowView>
          </ImageBackground>
          {liked.songsWithDetails && (
            <FlatList
              style={{ flex: 1 }}
              data={liked.songsWithDetails.slice(0, 3)}
              renderItem={LikedSongs}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={3}
              nestedScrollEnabled={true}
            />
          )}
        </RowView>
        <ScrollView horizontal={true}>
          <Button
            title={t('library.playlists')}
            onPress={() => setCategory('playlists')}
          />
          <Button
            title={t('library.albums')}
            onPress={() => setCategory('albums')}
          />
          <Button
            title={t('library.artists')}
            onPress={() => setCategory('artists')}
          />
          <Button title={t('library.mvs')} onPress={() => setCategory('mvs')} />
          <Button
            title={t('library.cloudDisk')}
            onPress={() => setCategory('cloudDisk')}
          />
          <Button
            title={t('library.topListen')}
            onPress={() => setCategory('topListen')}
          />
        </ScrollView>
        <View >
          {liked.playlists && category == 'playlists' && (
            // <FlatList
            //   data={liked.playlists.slice(0, 9)}
            //   numColumns={2}
            //   renderItem={LikedPlaylists}
            //   keyExtractor={(item, index) => index.toString()}
            //   initialNumToRender={3}
            //   nestedScrollEnabled={true}
            // />
            <CoverRow
              type="playlist"
              items={liked.playlists.slice(0, 8)}
              imageSize={1024}
              verticalStyle={true}
            />
          )}
          {liked.albums && category == 'albums' && (
            <CoverRow
              type="playlist"
              items={liked.albums.slice(0, 8)}
              imageSize={1024}
              verticalStyle={true}
            />
          )}
          {liked.artists && category == 'artists' && (
            <CoverRow
              type="artist"
              items={liked.artists.slice(0, 8)}
              imageSize={1024}
              verticalStyle={true}
            />
          )}
          {liked.cloudDisk && category == 'cloudDisk' && (
            <CoverRow
              type="playlist"
              items={liked.cloudDisk.slice(0, 8)}
              imageSize={1024}
              verticalStyle={true}
            />
          )}
          {category == 'topListen' && (
            <Text>Still Working On That...</Text>
          )}
          
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const RowView = styled(View)`
  flex-direction: row;
`
const styles = StyleSheet.create({
  topView: {
    backgroundColor: '#2B2F31',
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  likedSongBox: {
    flex: 1,
    borderRadius: 100,
    justifyContent: 'center',
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
    fontWeight: 'bold',
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
    color: '#A5A4A3',
  },
})
