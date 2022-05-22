import React, { Fragment, memo, useMemo, useState } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  ToastAndroid,
  SafeAreaView,
  FlatList,
  LogBox,
} from "react-native";
import styled from "styled-components/native";
import {
  Cover,
  ScrollView,
  Text,
  View,
  useSvgStyle,
  TrackItem,
  SvgIcon,
  Button,
  CoverRow, Tracker,
} from "@/components";
import { RootStackParamList, RootStackScreenProps } from "@/types";
import { Heart, HeartSolid, Plus, Play, Lock } from "@/components/icons";
import { useSnapshot } from "valtio";
import { SvgProps } from "react-native-svg";
import usePlaylist from "@/hooks/usePlaylist";
import { formatDate, formatDuration, resizeImage } from "@/utils/common";
import useTracksInfinite from "@/hooks/useTracksInfinite";
import { PlayerMode, TrackListSourceType, trackPlayer } from "@/hydrate/player";
import useUserPlaylists from "@/hooks/useUserPlaylists";
import useAlbum from "@/hooks/useAlbum";
import useUserAlbums, { useMutationLikeAAlbum } from "@/hooks/useUserAlbums";
import { useNavigation } from "@react-navigation/core";
import dayjs from "dayjs";
import useTracks from "@/hooks/useTracks";
import useArtist from "@/hooks/useArtist";
import useArtistAlbums from "@/hooks/useArtistAlbums";
import { t } from "i18n-js";
import { RouteProp, useRoute } from "@react-navigation/native";
import tr from "@/locale/lang/tr";

const { width } = Dimensions.get("window");

const coverStyle = {
  width: width / 3,
  height: width / 3,
  margin: 20,
};
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
  hotSongs: Track[] | undefined;
  handlePlay: () => void;
}> = ({ svgStyle, hotSongs, handlePlay }) => {
  const { track } = useSnapshot(trackPlayer);
  const isArtistHotSongsPlaying = hotSongs
    ?.map((t) => t.id)
    .includes(track?.id ?? 0);
  const wrappedHandlePlay = () => {
    if (isArtistHotSongsPlaying) {
      trackPlayer.skipToNext();
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
  artist: Artist | undefined;
  hotSongs: Track[] | undefined;
  handlePlay: () => void;
}> = memo(({ artist, hotSongs, handlePlay }) => {
  const svgStyle = useSvgStyle({});
  const coverUrl = resizeImage(artist?.picUrl || "", "lg");

  return (
    <Fragment>
      <PlaylistInfo style={{ flex: 2 }}>
        <Cover imageUrl={coverUrl} imageStyle={coverStyle} />
        <Info>
          <Title>{artist?.name}</Title>
          <ArtistInfo>{"Artist"}</ArtistInfo>
          <Description ellipsizeMode="tail" numberOfLines={3}>
            {artist?.briefDesc}
          </Description>
          <DateAndCount>
            {`${artist?.musicSize} Songs · ${artist?.albumSize} Albums · ${artist?.mvSize} Music Videos`}
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
          hotSongs={hotSongs}
          handlePlay={handlePlay}
        />
      </ButtonBox>
    </Fragment>
  );
});
Header.displayName = "Header";

const TrackList: React.FC<{
  hotSongs: Track[] | undefined;
  handlePlay: () => void;
  isLoadingSongs: boolean;
}> = memo(({ hotSongs, handlePlay, isLoadingSongs }) => {
  // const tracks = [
  //   { id: "001", title: " Change Season ", artist: "  Tkko" },
  //   { id: "002", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "003", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "004", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "005", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "006", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "007", title: " 带刺的草莓 ", artist: " Mit-F " },
  // ];

  const renderTracks = ({ item }) => {
    return <TrackItem track={item} handlePlay={handlePlay} />;
  };
  return (
    <SafeAreaView>
      <FlatList
        data={hotSongs?.slice(0, 9)}
        renderItem={renderTracks}
        keyExtractor={(item, index) => item.id + index.toString()}
        nestedScrollEnabled={true}
      />
    </SafeAreaView>
  );
});
TrackList.displayName = "TrackList";

const ArtistAlbums: React.FC<{
  albums: Album[];
}> = ({ albums }) => <CoverRow items={albums} type="album" verticalStyle={true} />;

const ArtistSingles: React.FC<{singles: Album[]}> = ({singles}) => <CoverRow type="album" items={singles} verticalStyle={true}/>

const SwitchCategory: React.FC<{ category: ArtistCategory, handlePlay: () => void }> = ({
  category, handlePlay
}) => {
  const {params: {id}} = useRoute<RootStackScreenProps<"Artist">["route"]>();
  const { data: artist, isLoading: isLoadingArtist } = useArtist({
    id: id || 0,
  });
  const { data: albumsRaw, isLoading: isLoadingAlbums } = useArtistAlbums({
    id: id || 0,
    limit: 1000,
  });

  const albums = useMemo(() => {
    if (!albumsRaw?.hotAlbums) return [];
    const albums: Album[] = [];
    albumsRaw.hotAlbums.forEach((album) => {
      if (album.type !== "专辑") return false;
      if (["混音版", "精选集", "Remix"].includes(album.subType)) return false;

      // No singles
      if (album.size <= 1) return false;

      // No remixes
      if (
        /(\(|\[)(.*)(Remix|remix)(.*)(\)|\])/.test(
          album.name.toLocaleLowerCase()
        )
      ) {
        return false;
      }

      // If have same name album only keep the Explicit version
      const sameNameAlbumIndex = albums.findIndex((a) => a.name === album.name);
      if (sameNameAlbumIndex !== -1) {
        if (album.mark === 1056768) albums[sameNameAlbumIndex] = album;
        return;
      }

      albums.push(album);
    });
    return albums;
  }, [albumsRaw?.hotAlbums]);

  const singles = useMemo(() => {
    if (!albumsRaw?.hotAlbums) return [];
    const albumsIds = albums.map((album) => album.id);
    return albumsRaw.hotAlbums.filter(
      (album) => albumsIds.includes(album.id) === false
    );
  }, [albums, albumsRaw?.hotAlbums]);
  const { data, isLoading } = useAlbum({ id: id || 0 });
  const album = data?.album;
  switch (category) {
    case ArtistCategory.HotSongs:
      return (
        <TrackList
          hotSongs={artist?.hotSongs}
          handlePlay={handlePlay}
          isLoadingSongs={isLoadingArtist}
        />
      );
    case ArtistCategory.Albums:
      return <ArtistAlbums albums={albums} />;
    case ArtistCategory.EP:
      return <ArtistSingles singles={singles}/>
    case ArtistCategory.MV:
      ToastAndroid.show(`Still Working on that`, ToastAndroid.SHORT);
      return <Fragment />;
  }
};

enum ArtistCategory {
  HotSongs = "Popular Songs",
  Albums = "Albums",
  EP = "EP & Singles",
  MV = "MVs",
}

export const ArtistScreen = ({ route }: RootStackScreenProps<"Artist">) => {
  const [category, setCategory] = useState<ArtistCategory>(ArtistCategory.HotSongs);
  const { id } = route.params;
  const { data: artist, isLoading: isLoadingArtist } = useArtist({
    id: id || 0,
  });
  const tracks = artist?.hotSongs;
  const handlePlay = React.useCallback(
    (trackID: number | null = null) => {
      if (!tracks?.length) {
        ToastAndroid.show('无法播放歌单', ToastAndroid.SHORT)
        return
      }
      trackPlayer.playAList(
        tracks.map(t => t.id),
        trackID
      )
    },
    [tracks]
  )
  React.useEffect(() =>
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  );
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <Header
        artist={artist?.artist}
        hotSongs={artist?.hotSongs}
        handlePlay={handlePlay}
      />
      <ScrollView horizontal={true}>
        <Button
          title={`Hot Songs`}
          onPress={() => setCategory(ArtistCategory.HotSongs)}
        />
        <Button
          title={`Albums`}
          onPress={() => setCategory(ArtistCategory.Albums)}
        />
        <Button
          title={`EP & Singles`}
          onPress={() => setCategory(ArtistCategory.EP)}
        />
        <Button title={`MVs`} onPress={() => setCategory(ArtistCategory.MV)} />
      </ScrollView>
      <SwitchCategory category={category} handlePlay={handlePlay}/>
    </ScrollView>
      <Tracker/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignSelf: "stretch",
  },
});
