import React, {ForwardedRef, useRef} from "react";
import {
  Dimensions, FlatListProps,
  ImageStyle, LogBox,
  StyleSheet,
  TouchableHighlight,
  FlatList
} from "react-native";
import { SafeAreaView, ListRenderItem } from "react-native";
import styled from "styled-components/native";

import { Cover, CoverProps } from "@/components/Cover";
import { useNavigation } from "@react-navigation/core";
import { formatDate, resizeImage } from "@/utils/common";

const {height} = Dimensions.get("window");

export enum Subtitle {
  Copywriter = "copywriter",
  Creator = "creator",
  TypeReleaseYear = "type+releaseYear",
  Artist = "artist",
  AppleMusic = "appleMusic",
  UpdateFrequency = "updateFrequency",
}

export type CoverRowProps = {
  title?: string;
  items?: {}[];
  albums?: Album[];
  artists?: Artist[];
  playlists?: Playlist[];
  subtitle?: Subtitle;
  seeMoreLink?: string;
  verticalStyle?: boolean;
  navigateCallback?: () => void;
  type: "playlist" | "artist" | "album";
  subTextFontSize?: String;
  showPlayCount?: Boolean;
  playButtonSize?: Number;
  imageSize?: Number;
  setOuterScroll?: (param: boolean) => void,
  setInnerScroll?: boolean
  flatListStyle?: FlatListProps<"style">,
  isHorizontal?: boolean,
};
export const CoverRow: React.FC<CoverRowProps> = (props) => {
  const navigation = useNavigation();
  const { type, items, verticalStyle, subtitle, isHorizontal, setInnerScroll, setOuterScroll } = props;

  const handleScrollBegin = () => {
    if (setOuterScroll) {
      // if (!setInnerScroll) setOuterScroll(true)
      setOuterScroll(false);
    }
  }
  const handleScrollEnd = () => {
    const {setOuterScroll} = props;
    if (setOuterScroll) {
      // if (setInnerScroll) setOuterScroll(false)
      setOuterScroll(true)
    }
  }
  const isFlatListScrollable = React.useMemo(() => isHorizontal ? true : setInnerScroll !== false, [setInnerScroll, isHorizontal])

  const { width } = Dimensions.get("window");
  const getImageUrl = (item: Album | Playlist | Artist) => {
    let cover: string | undefined = "";
    if ("coverImgUrl" in item) cover = item.coverImgUrl;
    if ("picUrl" in item) cover = item.picUrl;
    if ("img1v1Url" in item) cover = item.img1v1Url;
    return resizeImage(cover || "", "md");
  };

  const renderItem = ({ item }: any) => {
    // let subText = getSubText(item);
    const universalStyle: ImageStyle = {
      borderRadius: 22,
      marginLeft: 20,
      marginBottom: 5,
    };
    const circleStyle: ImageStyle = {
      borderRadius: 100,
      marginLeft: 20,
      marginBottom: 5,
    };
    const rowStyle: ImageStyle = {
      height: 200,
      width: 200,
      marginRight: 20,
    };
    const listStyle: ImageStyle = {
      height: width / 2 - 30,
      width: width / 2 - 30,
      marginLeft: 20,
      marginRight: 20,
      // margin: 20
      // marginLeft: 20,
    };
    const itemProps: CoverProps = {
      // id: item.id,
      imageUrl: getImageUrl(item),
      type,
      name: item.name,
      isExplicit: Boolean(
        type === "album" && "mark" in item && item.mark === 1056768
      ),
      isPrivacy: Boolean(
        type === "playlist" && "privacy" in item && item.privacy === 10
      ),
      subTitle: subtitle ? getSubtitleText(item, subtitle) : undefined,
      // imageStyle: type=="artist"?circleStyle:!isHorizontal?listStyle:universalStyle,
      imageStyle: [
        type === "artist" ? circleStyle : universalStyle,
        isHorizontal ? rowStyle : listStyle,
      ],
      viewStyle: isHorizontal
        ? { width: 240, height: 260 }
        : { width: width / 2, height: width / 2 + 10 },
    };
    const handlePress = (id: number) => {
      console.log(itemProps);
      switch (type) {
        case "album":
          navigation.navigate("Album", { id });
          break;
        case "artist":
          navigation.navigate("Artist", { id });
          break;
        case "playlist":
          navigation.navigate("Playlist", { id });
          break;
      }
    };

    return (
      <TouchableHighlight onPress={() => handlePress(item.id)}>
        <Cover {...itemProps} />
      </TouchableHighlight>
    );
  };
  // alert(`isFlatListScrollable - ${isFlatListScrollable.valueOf()}`)
  return (
    <SafeAreaView>
      <FlatList
        data={items}
        renderItem={renderItem}
        key={isHorizontal ? "#" : "_"}
        keyExtractor={(item, index) => "#" + index.toString()}
        horizontal={isHorizontal}
        numColumns={isHorizontal ? undefined : 2}
        onMomentumScrollBegin={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        style={!isHorizontal && items && items.length > 6 &&{height: height - 100}}
        nestedScrollEnabled
        scrollEnabled={isFlatListScrollable}
      />
    </SafeAreaView>
  );
};
const getSubtitleText = (
  item: Album | Playlist | Artist,
  subtitle: Subtitle
) => {
  const nickname =
    "creator" in item
      ? item.creator
        ? item.creator.nickname
        : "someone"
      : "someone";
  const artist =
    "artist" in item
      ? item.artist.name
      : "artists" in item
      ? item.artists?.[0]?.name
      : "unknown";
  const copywriter = "copywriter" in item ? item.copywriter : "unknown";
  const releaseYear =
    ("publishTime" in item &&
      formatDate(item.publishTime ?? 0, "en", "YYYY")) ||
    "unknown";
  const updateFrequency =
    "updateFrequency" in item
      ? item.updateFrequency
        ? item.updateFrequency
        : "updateFrequency"
      : "updateFrequency";

  const type = {
    playlist: "playlist",
    album: "Album",
    专辑: "Album",
    Single: "Single",
    "EP/Single": "EP",
    EP: "EP",
    unknown: "unknown",
    精选集: "Collection",
  }[
    ("type" in item && typeof item.type !== "number" && item.type) || "unknown"
  ];

  const table = {
    [Subtitle.Creator]: `by ${nickname}`,
    [Subtitle.TypeReleaseYear]: `${type} · ${releaseYear}`,
    [Subtitle.Artist]: artist,
    [Subtitle.Copywriter]: copywriter,
    [Subtitle.AppleMusic]: `by Apple Music`,
    [Subtitle.UpdateFrequency]: updateFrequency,
  };
  return table[subtitle];
};

const styles = StyleSheet.create({
  coverRow: {
    display: "flex",
  },
  flatListStyle: {
    alignSelf: "center",
    alignContent: "center",
  },
});
