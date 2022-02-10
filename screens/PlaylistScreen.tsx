import { Cover, LockSymbol, ScrollView } from "@/components";
import React from "react";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";
import { MusicModal, TrackList, ContextMenu } from "@/components";
import { RootStackScreenProps, PlaylistProps } from "@/types";
import { useGetPlaylistDetailQuery } from "@/redux/slice/apiSlice";
import { apiSlice } from "@/redux/slice/apiSlice";

const Playlist = styled.ScrollView`
  margin-top: 32px;
  flex: 1;
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
`;
export function PlaylistScreen({
  navigation,
  route,
}: RootStackScreenProps<"Playlist">) {
  const [playlist, setPlaylist] = React.useState<PlaylistProps>();
  const {currentPlaylist} = route.params;
  console.log(currentPlaylist);
  
  setPlaylist(currentPlaylist)
  const {currentData, isLoading} = useGetPlaylistDetailQuery(currentPlaylist.id)
  const fetchedPlaylist = currentData?.result;
  console.log(currentData,fetchedPlaylist,isLoading);
  
  return (
    <ScrollView style={styles.container}>
      <Playlist>
        {playlist && (
          <PlaylistInfo>
            {/* <Cover
              id={playlist.id}
              imageUrl={playlist.coverImgUrl}
              type="playlist"
            /> */}
            <Info>
              <Title>
                {/* {fetchedPlaylist?.privacy === 10 && <LockSymbol />}
                {fetchedPlaylist?.name}aa */}
              </Title>
              <ArtistTitle></ArtistTitle>
            </Info>
          </PlaylistInfo>
        )}

        <TrackList />
        <MusicModal />
        <ContextMenu />
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
