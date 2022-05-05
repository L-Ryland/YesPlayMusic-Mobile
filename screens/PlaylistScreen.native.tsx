import React from "react";
import { StyleSheet, TouchableHighlight, Dimensions } from "react-native";
import styled from "styled-components/native";
import TrackPlayer, { Capability, State, Event } from "react-native-track-player";
import { Cover, ScrollView, TrackList, Text, View, useSvgStyle } from "@/components";
import {
  RootStackScreenProps,
  PlaylistDetailProp,
} from "@/types";
import { fetchPlaylist, likeAPlaylist, deletePlaylist, fetchAudioSource } from "@/api";
import { Heart, HeartSolid, Plus, Play, Lock } from "@/components/icons";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { selectSettings } from "@/redux/slice/settingsSlice";
import { cacheTrackSource } from "@/utils/db";
import { selectData } from "@/redux/slice/dataSlice";
import { selectPlayer, setTracklist } from "@/redux/slice/playerSlice";

const { width } = Dimensions.get('window');
const coverStyle = {
  width: width / 3,
  height: width / 3,
  margin: 20
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


export function PlaylistScreen({
  navigation,
  route,
}: RootStackScreenProps<"Playlist">) {
  const [playlist, setPlaylist] = React.useState<PlaylistDetailProp>();
  const [tracks, setTracks] = React.useState([]);
  const [searchKeyWords, setSearchKeyWords] = React.useState('');
  const data = useAppSelector(selectData);
  const player = useAppSelector(selectPlayer);
  const dispatch = useAppDispatch();
  const svgStyle = useSvgStyle({});
  console.log("playlist route param: ", route.params);
  const { automaticallyCacheSongs } = useAppSelector(selectSettings)

  const { itemProps } = route.params;
  // console.log(itemProps);

  const loadData = (id: number, next = undefined) => {
    fetchPlaylist({id}, true).then(async (data: any) => {
      // alert(JSON.stringify(data));
      setPlaylist(data.playlist);
      // alert(JSON.stringify(data.playlist.tracks));

      setTracks(data.playlist.tracks);
      console.log("playlist", data.playlist, data.playlist.tracks);
      dispatch(setTracklist(data.playlist.tracks));
    })
  }
  React.useEffect(() => {
    const { likedSongs, itemProps: { id } } = route.params;
    if (likedSongs) {
      loadData(data.likedSongPlaylistID);
    } else {
      loadData(id);
    }
    return () => { };
  }, [route.params.itemProps]);
  let updateTime;
  if (playlist) {
    console.log(playlist);
    updateTime = dayjs(playlist.updateTime).format(`MMM DD, YYYY`);
  }
  const playTrack = async () => {
    
    const currentQueue = await TrackPlayer.getQueue();
    if (currentQueue) {
      await TrackPlayer.reset();
      console.log("playTrack currentQueue", await TrackPlayer.getQueue());
    }
    const { likedSongs, itemProps: { id } } = route.params;
    const { list } = player;
    if (likedSongs) {
      loadData(data.likedSongPlaylistID);
    } else {
      loadData(id);
    }
    await TrackPlayer.add(list);
    TrackPlayer.play();

  }

  const ButtonBox = styled(View)`
    margin-top: 32px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `;
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
      <View  style={{ flexDirection: 'row' }}>
        <HeartSolid {...svgStyle} />
        <Heart {...svgStyle} />
        <Plus {...svgStyle} />
      </View>
      <TouchableHighlight onPress={()=>playTrack()} style={{ alignSelf: 'flex-end' }} >
        <Play {...svgStyle} height={50} width={50} />
      </TouchableHighlight>
      </ButtonBox>
      <TrackList tracks={tracks} navigate={navigation.navigate} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignSelf: "stretch",
  },
});
