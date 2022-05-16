import React, { Fragment, memo, useMemo } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  ToastAndroid,
  SafeAreaView,
  FlatList, LogBox,
} from "react-native";
import styled from "styled-components/native";
import {
  Cover,
  ScrollView,
  Text,
  View,
  useSvgStyle,
  TrackItem, SvgIcon
} from "@/components";
import { RootStackScreenProps} from "@/types";
import { Heart, HeartSolid, Plus, Play, Lock } from "@/components/icons";
import { useSnapshot } from "valtio";
import { SvgProps } from "react-native-svg";
import usePlaylist from "@/hooks/usePlaylist";
import { formatDate, formatDuration, resizeImage } from "@/utils/common";
import useTracksInfinite from "@/hooks/useTracksInfinite";
import {PlayerMode, TrackListSourceType, trackPlayer} from "@/hydrate/player";
import useUserPlaylists from "@/hooks/useUserPlaylists";
import useAlbum from "@/hooks/useAlbum";
import useUserAlbums, { useMutationLikeAAlbum } from "@/hooks/useUserAlbums";
import { useNavigation } from "@react-navigation/core";
import dayjs from "dayjs";
import useTracks from "@/hooks/useTracks";
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

const PlayButton: React.FC<{
  svgStyle: SvgProps;
  album: Album | undefined;
  handlePlay: () => void;
}> = ({
  svgStyle,
  album,
  handlePlay,
}) => {
  const {mode, trackListSource} = useSnapshot(trackPlayer);
  const isThisAlbumPlaying  =
    mode === PlayerMode.TrackList &&
    trackListSource?.type === TrackListSourceType.Album &&
    trackListSource?.id === album?.id;
  const wrappedHandlePlay = () => {
    if (isThisAlbumPlaying) {
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



const Header: React.FC<{
  album?: Album;
  isLoading: boolean;
  handlePlay: () => void;
}> = memo(
  ({
    album,
    isLoading,
    handlePlay,
  }) => {
    const navigation = useNavigation();
    const svgStyle = useSvgStyle({});
    const coverUrl = resizeImage(album?.picUrl || '', 'lg')
    const albumDuration = useMemo(() => {
      const duration = album?.songs?.reduce((acc, cur) => acc + cur.dt, 0) || 0
      return formatDuration(duration, 'zh-CN', 'hh[hr] mm[min]')
    }, [album?.songs])

    const [isCoverError, setCoverError] = React.useState(
      coverUrl.includes('3132508627578625')
    )

    const { data: userAlbums } = useUserAlbums()
    const isThisAlbumLiked = useMemo(() => {
      if (!album) return false
      return !!userAlbums?.data?.find(a => a.id === album.id)
    }, [album, userAlbums?.data])
    const mutationLikeAAlbum = useMutationLikeAAlbum()
    return (
      <Fragment>
        <PlaylistInfo style={{ flex: 2 }}>
          <Cover imageUrl={coverUrl} imageStyle={coverStyle} />
          <Info>
            <Title>
              {album?.name}
            </Title>
            <ArtistInfo>
              Album by{' '}
              <Text
                onPress={() => navigation.navigate("Artist", {id: album?.artist.id})}
              >
                {album?.artist.name}
              </Text>
            </ArtistInfo>
            <Description ellipsizeMode="tail" numberOfLines={3}>
              {album?.description}
            </Description>
            <DateAndCount>
              {album?.mark === 1056768 && (
                <SvgIcon
                  name='Explicit'
                  {...svgStyle}
                />
              )}
              {dayjs(album?.publishTime || 0).year()} · {album?.size} Songs ·{' '}
              {albumDuration}
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
            album={album}
            handlePlay={handlePlay}
          />
        </ButtonBox>
      </Fragment>
    );
  }
);
Header.displayName = "Header";

const TrackList: React.FC<{
  album: Album | undefined;
  handlePlay: () => void;
  isLoadingAlbum: boolean;
}> = memo(
  ({
    album,
    handlePlay,
    isLoadingAlbum
  }) => {
    // const tracks = [
    //   { id: "001", title: " Change Season ", artist: "  Tkko" },
    //   { id: "002", title: " 带刺的草莓 ", artist: " Mit-F " },
    //   { id: "003", title: " 带刺的草莓 ", artist: " Mit-F " },
    //   { id: "004", title: " 带刺的草莓 ", artist: " Mit-F " },
    //   { id: "005", title: " 带刺的草莓 ", artist: " Mit-F " },
    //   { id: "006", title: " 带刺的草莓 ", artist: " Mit-F " },
    //   { id: "007", title: " 带刺的草莓 ", artist: " Mit-F " },
    // ];
    const {data: tracks, isLoading: isLoadingTracks} = useTracks({ids: album ? album.songs.map(t => t.id) :[]})

    const renderTracks = ({ item }) => {
      return <TrackItem track={item} handlePlay={handlePlay} />;
    };
    return (
      <SafeAreaView>
        <FlatList
          data={
            isLoadingAlbum? [] : album?.songs
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

export const AlbumScreen = ({
  route,
}: RootStackScreenProps<"Album">) => {
  const {
    id,
  } = route.params;
  const {data, isLoading } = useAlbum({id: id || 0});
  const album = data?.album;

  const handlePlay = React.useCallback(
    (trackID: number | null = null) => {
      if (!album?.id) {
        ToastAndroid.show("无法播放专辑，该专辑不存在", ToastAndroid.SHORT);
        return;
      }
      // ToastAndroid.show(`TrackID - ${trackID}, Playlist ID - ${playlist.id}`, ToastAndroid.CENTER);
      album && trackPlayer.playAlbum(album.id, trackID);
    },
    [album]
  );
  React.useEffect(() => LogBox.ignoreLogs(['VirtualizedLists should never be nested']))
  return (
    <ScrollView style={styles.container}>
      <Header
        album={album}
        isLoading={isLoading}
        handlePlay={handlePlay}
      />

      <TrackList
        album={album}
        handlePlay={handlePlay}
        isLoadingAlbum={isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignSelf: "stretch",
  },
});
