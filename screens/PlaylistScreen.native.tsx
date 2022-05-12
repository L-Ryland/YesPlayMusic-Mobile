import React, { Fragment, memo, useReducer } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  ToastAndroid,
  SafeAreaView,
  FlatList,
} from "react-native";
import styled from "styled-components/native";
import {
  Cover,
  ScrollView,
  Text,
  View,
  useSvgStyle,
  TrackItem,
} from "@/components";
import { RootStackScreenProps, PlaylistDetailProp } from "@/types";
import {
  fetchPlaylist,
  likeAPlaylist,
  deletePlaylist,
  fetchAudioSource,
} from "@/api";
import { Heart, HeartSolid, Plus, Play, Lock } from "@/components/icons";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { selectSettings } from "@/redux/slice/settingsSlice";
import { cacheTrackSource } from "@/utils/db";
import { selectData } from "@/redux/slice/dataSlice";
import { selectPlayer, setTracklist } from "@/redux/slice/playerSlice";
import { useSnapshot } from "valtio";
import {
  Mode as PlayerMode,
  TrackListSourceType,
  State as PlayerState,
} from "@/utils/player";
import { SvgProps } from "react-native-svg";
import { RootState } from "@/redux/store";
import usePlaylist from "@/hooks/usePlaylist";
import { formatDate, resizeImage } from "@/utils/common";
import useTracksInfinite from "@/hooks/useTracksInfinite";
function reducer(state, action) {
  switch (action) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
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
  const { trackPlayer } = useAppSelector<RootState["player"]>(selectPlayer);
  alert(JSON.parse(trackPlayer));
  const isThisPlaylistPlaying =
    trackPlayer.mode === PlayerMode.TrackList &&
    trackPlayer.trackListSource?.type === TrackListSourceType.Playlist &&
    trackPlayer.trackListSource?.id === playlist?.id;
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

// export function YAPlaylistScreen({
//   navigation,
//   route,
// }: RootStackScreenProps<"Playlist">) {
//   const [playlist, setPlaylist] = React.useState<Playlist>();
//   const [tracks, setTracks] = React.useState<Track[]>([]);
//   const [searchKeyWords, setSearchKeyWords] = React.useState("");
//   const data = useAppSelector(selectData);
//   const dispatch = useAppDispatch();
//   const svgStyle = useSvgStyle({});
//   console.log("playlist route param: ", route.params);
//   const { automaticallyCacheSongs } = useAppSelector(selectSettings);
//
//   const { itemProps } = route.params;
//   // console.log(itemProps);
//
//   const prefetchPlaylist = (id: number, next = undefined) => {
//     fetchPlaylist({ id }, true).then(async (data: any) => {
//       // alert(JSON.stringify(data));
//       setPlaylist(data.playlist);
//       // alert(JSON.stringify(data.playlist.tracks));
//
//       setTracks(data.playlist.tracks);
//       console.log("playlist", data.playlist, data.playlist.tracks);
//       dispatch(setTracklist(data.playlist.tracks));
//     });
//   };
//   React.useEffect(() => {
//     const {
//       likedSongs,
//       itemProps: { id },
//     } = route.params;
//     if (likedSongs) {
//       prefetchPlaylist(data.likedSongPlaylistID);
//     } else {
//       prefetchPlaylist(id);
//     }
//     return () => {};
//   }, [route.params.itemProps]);
//   let updateTime;
//   if (playlist) {
//     console.log(playlist);
//     updateTime = dayjs(playlist.updateTime).format(`MMM DD, YYYY`);
//   }
//   const handlePlay = async () => {
//     const currentQueue = await TrackPlayer.getQueue();
//     if (currentQueue) {
//       await TrackPlayer.reset();
//       console.log("playTrack currentQueue", await TrackPlayer.getQueue());
//     }
//     const {
//       likedSongs,
//       itemProps: { id },
//     } = route.params;
//     const { list } = useAppSelector(selectPlayer);
//     if (likedSongs) {
//       prefetchPlaylist(data.likedSongPlaylistID);
//     } else {
//       prefetchPlaylist(id);
//     }
//     await TrackPlayer.add(list);
//     TrackPlayer.play();
//   };
//
//   return (
//     <ScrollView style={styles.container}>
//       <PlaylistInfo style={{ flex: 2 }}>
//         <TouchableHighlight>
//           <Cover
//             imageUrl={itemProps.imageUrl}
//             type={itemProps.type}
//             imageStyle={coverStyle}
//           />
//         </TouchableHighlight>
//         <Info>
//           <Title>
//             {itemProps?.privacy === 10 && <Lock />}
//             {itemProps?.name}
//           </Title>
//           <ArtistInfo>
//             Playlist by{" "}
//             {[
//               5277771961, 5277965913, 5277969451, 5277778542, 5278068783,
//             ].includes(itemProps.id)
//               ? "Apple Music"
//               : playlist?.creator?.nickname}
//           </ArtistInfo>
//           <Description ellipsizeMode="tail">
//             {playlist?.description}
//           </Description>
//           <DateAndCount>
//             Updated At {updateTime} · {playlist?.trackCount} Songs
//           </DateAndCount>
//         </Info>
//       </PlaylistInfo>
//       <ButtonBox>
//         <View style={{ flexDirection: "row" }}>
//           <HeartSolid {...svgStyle} />
//           <Heart {...svgStyle} />
//           <Plus {...svgStyle} />
//         </View>
//         <TouchableHighlight
//           onPress={() => handlePlay()}
//           style={{ alignSelf: "flex-end" }}
//         >
//           <Play {...svgStyle} height={50} width={50} />
//         </TouchableHighlight>
//         <PlayButton
//           svgStyle={svgStyle}
//           playlist={playlist}
//           handlePlay={handlePlay}
//         />
//       </ButtonBox>
//       <TrackList
//         playlist={playlist}
//         handlePlay={handlePlay}
//         isLoadingPlaylist={isLoading}
//       />
//     </ScrollView>
//   );
// }

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
                : playlist?.creator.nickname}
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
          <TouchableHighlight
            onPress={() => handlePlay()}
            style={{ alignSelf: "flex-end" }}
          >
            <Play {...svgStyle} height={50} width={50} />
          </TouchableHighlight>
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
    handlePlay: () => void;
    isLoadingPlaylist: boolean;
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

    const renderTracks = ({ item }) => {
      return <TrackItem track={item} handlePlay={handlePlay} />;
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

export const PlaylistScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"Playlist">) => {
  const {
    likedSongs,
    itemProps: { id },
  } = route.params;
  const { likedSongPlaylistID } = useAppSelector<RootState["data"]>(selectData);
  const { trackPlayer } = useAppSelector<RootState["player"]>(selectPlayer);
  const { data, isLoading } = usePlaylist({
    id: likedSongs ? likedSongPlaylistID : id ?? 0,
  });
  const playlist = data?.playlist;

  const handlePlay = React.useCallback(
    (trackID: number | null = null) => {
      playlist && trackPlayer.playPlaylist(playlist.id, trackID);
      if (playlist?.id) {
        ToastAndroid.show("无法播放歌单", ToastAndroid.SHORT);
        return;
      }
    },
    [playlist]
  );
  return (
    <ScrollView style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignSelf: "stretch",
  },
});
