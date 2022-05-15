import { CoverRowProps, CoverProps } from "@/types";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  ViewProps,
  ViewStyle,
} from "react-native";
import { SafeAreaView, ListRenderItem } from "react-native";
import styled from "styled-components/native";

import { Cover } from "@/components/Cover";
import { useNavigation } from "@react-navigation/core";

const FlatList = styled.FlatList`
  display: flex;
`;

export function CoverRow(props: CoverRowProps | any) {
  const [isHorizontal, setIsHorizontal] = React.useState(true);
  const [numColumns, setNumColumns] = React.useState<number>();
  const navigation = useNavigation();
  let { items, type, subText, verticalStyle, imageSize } = props;
  React.useEffect(() => {
    if (verticalStyle) {
      setIsHorizontal(false);
      setNumColumns(2);
    }
    // console.log("isHorizontal", isHorizontal);
  }, [verticalStyle]);

  // console.log(items, subText);
  const { width } = Dimensions.get("window");
  const getImageUrl = (item: CoverProps) => {
    if (item.img1v1Url) {
      let img1v1ID = item.img1v1Url.split("/");
      let imgName = img1v1ID[img1v1ID.length - 1];
      if (imgName === "5639395138885805.jpg") {
        // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
        return `https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=${imageSize}y${imageSize}`;
      }
    }
    let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
    return `${img?.replace(
      "http://",
      "https://"
    )}?param=${imageSize}y${imageSize}`;
  };

  const renderItem = ({ item }: any) => {
    // let subText = getSubText(item);
    const universalStyle: ViewStyle = {
      borderRadius: 22,
      marginLeft: 20,
      marginBottom: 5,
    };
    const circleStyle: ViewStyle = {
      borderRadius: 100,
      marginLeft: 20,
      marginBottom: 5,
    };
    const rowStyle: ViewStyle = {
      height: 200,
      width: 200,
      marginRight: 20,
    };
    const listStyle: ViewStyle = {
      height: width / 2 - 30,
      width: width / 2 - 30,
      marginLeft: 20,
      marginRight: 20,
      // margin: 20
      // marginLeft: 20,
    };
    const itemProps = {
      id: item.id,
      imageUrl: getImageUrl(item),
      type,
      name: item.name,
      isExplicit: Boolean(type === "album" && item.mark === 1056768),
      isPrivacy: Boolean(type === "playlist" && item.privacy === 10),
      subText: subText ?? undefined,
      // imageStyle: type=="artist"?circleStyle:!isHorizontal?listStyle:universalStyle,
      imageStyle: [
        type == "artist" ? circleStyle : universalStyle,
        isHorizontal ? rowStyle : listStyle,
      ],
      viewStyle: isHorizontal
        ? { width: 240, height: 260 }
        : { width: width / 2, height: width / 2 + 10 },
    };
    const handlePress = () => {
      console.log(itemProps);
      navigation.navigate("Playlist", { itemProps });
    };
    // console.log(item, itemProps);

    return (
      <TouchableHighlight onPress={handlePress}>
        <Cover {...itemProps} />
      </TouchableHighlight>
    );
    // return <Text>test</Text>
  };

  return (
    <SafeAreaView>
      <FlatList
        data={items}
        renderItem={renderItem}
        key={isHorizontal ? "#" : "_"}
        keyExtractor={(item, index) => "#" + index.toString()}
        horizontal={isHorizontal}
        numColumns={numColumns}
        nestedScrollEnabled={true}
        // style={isHorizontal?null:styles.flatListStyle}
      />
    </SafeAreaView>
  );
}

function getSubText(item) {
  if (item.subText === "copywriter") return item.copywriter;
  if (item.subText === "description") return item.description;
  if (item.subText === "updateFrequency") return item.updateFrequency;
  if (item.subText === "creator") return "by " + item.creator.nickname;
  if (item.subText === "releaseYear")
    return new Date(item.publishTime).getFullYear();
  if (item.subText === "artist") {
    if (item.artist !== undefined)
      return `<a href="/#/artist/${item.artist.id}">${item.artist.name}</a>`;
    if (item.artists !== undefined)
      return `<a href="/#/artist/${item.artists[0].id}">${item.artists[0].name}</a>`;
  }
  if (item.subText === "albumType+releaseYear") {
    let albumType = item.type;
    if (item.type === "EP/Single") {
      albumType = item.size === 1 ? "Single" : "EP";
    } else if (item.type === "Single") {
      albumType = "Single";
    } else if (item.type === "专辑") {
      albumType = "Album";
    }
    return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
  }
  if (item.subText === "appleMusic") return "by Apple Music";
}

const styles = StyleSheet.create({
  coverRow: {
    display: "flex",
  },
  flatListStyle: {
    alignSelf: "center",
    alignContent: "center",
  },
});
