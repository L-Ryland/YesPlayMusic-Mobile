import React, { Fragment, memo } from "react";
import {
  Dimensions,
  FlatList,
  LogBox,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableHighlight,
} from "react-native";
import styled from "styled-components/native";
import {
  Cover,
  ScrollView,
  Text,
  Tracker,
  TrackItem,
  useSvgStyle,
  View,
} from "@/components";
import { RootStackScreenProps } from "@/types";
import { Heart, HeartSolid, Lock, Play, Plus } from "@/components/icons";
import { useSnapshot } from "valtio";
import { SvgProps } from "react-native-svg";
import usePlaylist from "@/hooks/usePlaylist";
import { formatDate, resizeImage } from "@/utils/common";
import useTracksInfinite from "@/hooks/useTracksInfinite";
import { PlayerMode, TrackListSourceType, trackPlayer } from "@/hydrate/player";
import useUserPlaylists from "@/hooks/useUserPlaylists";

const { width } = Dimensions.get("window");

const coverStyle = {
  width: width / 3,
  height: width / 3,
  margin: 20,
};
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
  height: ${coverStyle.height - coverStyle.margin * 2};
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
const ButtonBox = styled(View)`
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PlayButton = ({
  svgStyle,
  playlist,
  handlePlay,
}: {
  svgStyle: SvgProps;
  playlist: Playlist | undefined;
  handlePlay: () => void;
}) => {
  const { mode, trackListSource } = useSnapshot(trackPlayer);
  const isThisPlaylistPlaying =
    mode === PlayerMode.TrackList &&
    trackListSource?.type === TrackListSourceType.Playlist &&
    trackListSource?.id === playlist?.id;
  const wrappedHandlePlay = () => {
    if (isThisPlaylistPlaying) {
      trackPlayer.playOrPause();
    } else {
      handlePlay();
    }
  };
  return (
    <TouchableHighlight
      onPress={wrappedHandlePlay}
      style={{ alignSelf: "flex-end" }}
    >
      <Play {...svgStyle} height={50} width={50} />
    </TouchableHighlight>
  );
};

const Header = memo(
  ({
    playlist,
    isLoading,
    handlePlay,
  }: {
    playlist?: Playlist;
    isLoading: boolean;
    handlePlay: () => void;
  }) => {
    const coverUrl = resizeImage(playlist?.coverImgUrl || "", "lg");
    const svgStyle = useSvgStyle({});
    return (
      <Fragment>
        <PlaylistInfo style={{ flex: 2 }}>
          <Cover imageUrl={coverUrl} imageStyle={coverStyle} />
          <Info>
            <Title>
              {playlist?.privacy === 10 && <Lock />}
              {playlist?.name}
            </Title>
            <ArtistInfo>
              Playlist by{" "}
              {[
                5277771961, 5277965913, 5277969451, 5277778542, 5278068783,
              ].includes(playlist?.id ?? 0)
                ? "Apple Music"
                : playlist?.creator?.nickname}
            </ArtistInfo>
            <Description ellipsizeMode="tail">
              {playlist?.description}
            </Description>
            <DateAndCount>
              Updated At {formatDate(playlist?.updateTime || 0, "zh-CN")} ·{" "}
              {playlist?.trackCount} Songs
            </DateAndCount>
          </Info>
        </PlaylistInfo>
        <ButtonBox>
          <View style={{ flexDirection: "row" }}>
            <HeartSolid {...svgStyle} />
            <Heart {...svgStyle} />
            <Plus {...svgStyle} />
          </View>
          <PlayButton
            svgStyle={svgStyle}
            playlist={playlist}
            handlePlay={handlePlay}
          />
        </ButtonBox>
      </Fragment>
    );
  }
);
Header.displayName = "Header";

const TrackList = memo(
  ({
    playlist,
    handlePlay,
    isLoadingPlaylist,
  }: {
    playlist: Playlist | undefined;
    handlePlay: (param: number) => void;
    isLoadingPlaylist: boolean;
  }) => {
    const {
      data: tracksPages,
      hasNextPage,
      isLoading: isLoadingTracks,
      isFetchingNextPage,
      fetchNextPage,
    } = useTracksInfinite({
      ids: playlist?.trackIds?.map((t) => t.id) || [],
    });
    const tracks = React.useMemo(() => {
      if (!tracksPages) return [];
      const allTracks: Track[] = [];
      tracksPages.pages.forEach((page) =>
        allTracks.push(...(page?.songs ?? []))
      );
      return allTracks;
    }, [tracksPages]);

    const renderTracks = ({ item, index }) => {
      return <TrackItem track={item} handlePlay={() => handlePlay(index)} />;
    };
    return (
      <SafeAreaView>
        <FlatList
          data={
            isLoadingPlaylist ? [] : isLoadingTracks ? playlist?.tracks : tracks
          }
          renderItem={renderTracks}
          keyExtractor={(item, index) => item.id + index.toString()}
          nestedScrollEnabled={true}
        />
      </SafeAreaView>
    );
  }
);
TrackList.displayName = "TrackList";

export const PlaylistScreen = ({ route }: RootStackScreenProps<"Playlist">) => {
  const { likedSongs, id } = route.params;
  const likedSongPlaylistID = useUserPlaylists().data?.playlist[0].id;
  const { data, isLoading } = usePlaylist({
    id: likedSongs ? likedSongPlaylistID || 0 : id || 0,
  });
  const playlist = data?.playlist;

  const handlePlay = React.useCallback(
    async (trackID: number | null = null) => {
      if (!playlist?.id) {
        ToastAndroid.show("无法播放歌单", ToastAndroid.SHORT);
        return;
      }
      // ToastAndroid.show(`TrackID - ${trackID}, Playlist ID - ${playlist.id}`, ToastAndroid.CENTER);
      playlist && await trackPlayer.playPlaylist(playlist.id, trackID);
    },
    [playlist]
  );
  // React.useEffect(() =>
  //   LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  // );
  return (
    <View style={styles.container}>
      <ScrollView>
        <Header
          playlist={playlist}
          isLoading={isLoading}
          handlePlay={handlePlay}
        />

        <TrackList
          playlist={playlist}
          handlePlay={handlePlay}
          isLoadingPlaylist={isLoading}
        />
      </ScrollView>
      <Tracker />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignSelf: "stretch",
  },
});
