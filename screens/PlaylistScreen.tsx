import React from "react";
import { StyleSheet, TouchableHighlight, Image, Button, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Cover, ScrollView, MusicModal, TrackList, ContextMenu, Text, View } from "@/components";
import { Lock } from "@/components/icons";
import { Audio } from "expo-av";

import {
  RootStackScreenProps,
  PlaylistProps,
  PlaylistDetailProp,
} from "@/types";
import { useGetPlaylistDetailQuery } from "@/redux/slice/apiSlice";
import { getPlaylistDetail, subscribePlaylist, deletePlaylist } from "@/api";
import { Heart, HeartSolid, Plus, Play } from "@/components/icons";
import dayjs from "dayjs";
import { useAppSelector } from "@/hooks/useRedux";
import { selectData } from "@/redux/slice/dataSlice";

const { width } = Dimensions.get('window');
const coverStyle = {
  width: width / 3,
  height: width / 3,
  margin: 20
}
const svgStyle = {
  height: 36,
  width: 36,
  color: 'white'
}
const Playlist = styled(View)`
  margin-top: 32px;
  margin-left: 32px;
  flex: 1;
`;
const PlaylistInfo = styled(View)`
  display: flex;
  margin-bottom: 10px;
  position: relative;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Info = styled(View)`
  flex: 3;
  text-align: left;
  margin: 10px;
  margin-bottom: 72px;
  height: ${coverStyle.height - coverStyle.margin * 2}
`;
const Title = styled(Text)`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 18px;
  color: white;
`;
const ArtistTitle = styled(Text)`
  font-size: 18px;
  opacity: 0.88;
  margin-top: 24px;
`;
const ArtistInfo = styled(Text)`
  font-weight: 600;
`;
const DateAndCount = styled(Text)`
  font-size: 14px;
  opacity: 0.68;
  margin-top: 2px;
`;
const Description = styled(Text)`
  font-size: 14px;
  opacity: 0.68;
  margin-top: 24px;
  overflow: hidden;
`;
const ButtonBox = styled(View)`
  margin-top: 32px;
  display: flex;
  flex-direction: row;
`;

export function PlaylistScreen({
  navigation,
  route,
}: RootStackScreenProps<"Playlist">) {
  const [playlist, setPlaylist] = React.useState<PlaylistDetailProp>({});
  const [tracks, setTracks] = React.useState([]);
  const [searchKeyWords, setSearchKeyWords] = React.useState('');
  const [sound, setSound] = React.useState<any>();
  const data = useAppSelector(selectData);
  console.log(route.params);

  const { itemProps } = route.params;
  // console.log(itemProps);

  const loadData = (id, next = undefined ) => { 
    getPlaylistDetail(id, true).then( (data: any) => {
      // alert(JSON.stringify(data));
      setPlaylist(data.playlist);
      alert(JSON.stringify(data.playlist.tracks));
      setTracks(data.playlist.tracks);
    })
   }
  React.useEffect(() => {
    const { likedSongs, itemProps: {id} } = route.params;
    if (likedSongs) {
      loadData(data.likedSongPlaylistID);
    } else {
      loadData(id);
    }
    return () => {};
  }, []);
  let updateTime;
  if (playlist) {
    console.log(playlist);
    updateTime = dayjs(playlist.updateTime).format(`MMM DD, YYYY`);
  }
  // const Audio = styled.Image``;
  async function playSound() {
    console.log("Loading sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/MitiS Anna Yvette - Open Window (Original Mix).mp3")
    );
    setSound(sound);
    console.log("playing sound");
    await sound.playAsync();
  }
  React.useEffect(() => {
    return sound
      ? () => {
        console.log("Unloading sound");
        sound.unloadAsync();
      }
      : undefined;
  }, []);
  return (
    <ScrollView style={styles.container}>
      <PlaylistInfo style={{ flex: 2 }}>
        <TouchableHighlight>
          <Cover imageUrl={itemProps.imageUrl} type={itemProps.type} imageStyle={coverStyle} />
        </TouchableHighlight>
        <Info>
          <Title>
            {itemProps?.privacy === 10 && <Lock />}
            {itemProps?.name}
          </Title>
          <ArtistInfo>
            Playlist by{" "}
            {[
              5277771961, 5277965913, 5277969451, 5277778542, 5278068783,
            ].includes(itemProps.id)
              ? "Apple Music"
              : playlist?.creator?.nickname}
          </ArtistInfo>
          <Description ellipsizeMode="tail">
            {playlist?.description}
          </Description>
          <DateAndCount>
            Updated At {updateTime} · {playlist?.trackCount} Songs
          </DateAndCount>
        </Info>
      </PlaylistInfo>
      <ButtonBox>
        <Text>LIKE</Text>
        <HeartSolid {...svgStyle} />
        <Text>UNLIKE</Text>
        <Heart {...svgStyle} />
        <Plus {...svgStyle} color='white' />
        <Play {...svgStyle} />
      </ButtonBox>
      <TrackList tracks={tracks} />
    </ScrollView>
  )
  return (
    <ScrollView style={styles.container}>
      <Playlist>
        {itemProps && (
          <PlaylistInfo>
            <TouchableHighlight>
              <Cover imageUrl={itemProps.imageUrl} type={itemProps.type} imageStyle={itemProps.imageStyle} />
              {/* <route.params.Cover/> */}
            </TouchableHighlight>
            <Info>
              <Title>
                {itemProps?.privacy === 10 && <Lock />}
                {itemProps?.name}
              </Title>
              <ArtistInfo>
                Playlist by{" "}
                {[
                  5277771961, 5277965913, 5277969451, 5277778542, 5278068783,
                ].includes(itemProps.id)
                  ? "Apple Music"
                  : playlist?.creator?.nickname}
              </ArtistInfo>
              <DateAndCount>
                Updated At {updateTime} · {playlist?.trackCount} Songs
              </DateAndCount>
              <Description ellipsizeMode="tail">
                {playlist?.description}
              </Description>
            </Info>
          </PlaylistInfo>
        )}
        <ButtonBox>
          <Text>LIKE</Text>
          <HeartSolid width={16} height={16} />
          <Text>UNLIKE</Text>
          <Heart width={16} height={16} />
          {/* <SvgButton source={{uri: '/assets/icons/heart-solid.svg'}} /> */}
        </ButtonBox>
        <TrackList />
        {/* <MusicModal /> */}

        <ContextMenu />
        <Button onPress={playSound} title="play sound" />
      </Playlist>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignSelf: "stretch",
  },
});
