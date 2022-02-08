import { LockSymbol } from "@/components";
import React from "react";
import styled from "styled-components/native";
import { MusicModal, TrackList, ContextMenu } from "@/components";
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from "@/types";
import { useGetPlaylistDetailQuery } from "@/redux/slice/apiSlice";

const Playlist = styled.ScrollView`
  margin=top: 32px;
`;
const PlaylistInfo = styled.View`
  display: flex;
  margin-bottom: 72px;
  position: relative;
`;
const Info = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;
const Title = styled.Text`
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
`;
const ArtistTitle = styled.Text`
font-size: 18px;
opacity: 0.88;
color: var(--color-text);
margin-top: 24px;
`
export function PlaylistScreen({navigation, route}: RootStackParamList<"Playlist">) {
  const {playlist} = route.params;
  console.log(doPlaylistQuery(playlist.id));
  
  return (
    <Playlist>
      <PlaylistInfo>
        <Info>
          <Title>
            {playlist.privacy === 10 && <LockSymbol />}
            {playlist.name}aaa
          </Title>
          <ArtistTitle></ArtistTitle>
        </Info>
      </PlaylistInfo>
      <TrackList />
      <MusicModal />
      <ContextMenu />
    </Playlist>
  );
}
function doPlaylistQuery(id:Number) {
  console.log(useGetPlaylistDetailQuery(id))
  // if (isSuccess) {
  //   return data;
  // }
}