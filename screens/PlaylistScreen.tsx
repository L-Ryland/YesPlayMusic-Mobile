import React from "react";
import { StyleSheet, TouchableHighlight, Image, Button } from "react-native";
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
import { Heart, HeartSolid } from "@/components/icons";
import dayjs from "dayjs";

const Playlist = styled.View`
  margin-top: 32px;
  margin-left: 32px;
  flex: 1;
`;
const PlaylistInfo = styled.View`
  display: flex;
  margin-bottom: 72px;
  position: relative;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Info = styled.View`
  display: flex;
  // flex-direction: column;
  // justify-content: center;
  text-align: left;
  margin-bottom: 72px;
`;
const Title = styled.Text`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 18px;
`;
const ArtistTitle = styled(Text)`
  font-size: 18px;
  opacity: 0.88;
  margin-top: 24px;
`;
const ArtistInfo = styled.Text`
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
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3px;
  overflow: hidden;
`;
const ButtonBox = styled(View)`
  margin-top: 32px;
  display: flex;
`;
const SvgButton = styled.Image`
  width: 16px;
  height: 16px;
`;
export function PlaylistScreen({
  navigation,
  route,
}: RootStackScreenProps<"Playlist">) {
  const [playlist, setPlaylist] = React.useState<PlaylistDetailProp>();
  const [sound, setSound] = React.useState<any>();
  const mounted = React.useRef(true);
  console.log(route.params);

  const { itemProps } = route.params;
  // console.log(itemProps);
  const {
    itemProps: { id },
  } = route.params;

  let response;
  const fetchData = async (id) => {

    response = await getPlaylistDetail(id);
    console.log(response.playlist);

    setPlaylist(response.playlist);
    mounted.current = false;
  };
  getPlaylistDetail(id).then((data) => console.log(data));
  React.useEffect(() => {
    mounted.current && fetchData(id);
    return () => {
      console.log("@unmount");
      mounted.current = false;
    };
  }, [mounted]);
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
      <Playlist>
        {itemProps && (
          <PlaylistInfo>
            <TouchableHighlight>
              <Cover imageUrl={itemProps.imageUrl} type={itemProps.type} />
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
    flex: 1,
    alignSelf: "stretch",
  },
});
