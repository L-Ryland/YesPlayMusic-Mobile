import { CoverRowProps, CoverProps } from "@/types";
import { iteratorSymbol } from "immer/dist/internal";
import { StyleSheet, TouchableHighlight, ViewProps } from "react-native";
import { SafeAreaView, ListRenderItem } from "react-native";
import styled from "styled-components/native";

import { View, Text, Cover } from ".";



const FlatList = styled.FlatList`
  display: flex;
`;

export function CoverList(props: any) {
  let { items, type, subText, rowNumber, setCallback} = props;
  // console.log(items, subText);

  const getImageUrl = (item: CoverProps) => {
    if (item.img1v1Url) {
      let img1v1ID = item.img1v1Url.split("/");
      let imgName = img1v1ID[img1v1ID.length - 1];
      if (imgName === "5639395138885805.jpg") {
        // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
        return "https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512";
      }
    }
    let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
    return `${img?.replace("http://", "https://")}?param=512y512`;
  }
  const handlePress = (item) => {
    // console.log(item, props);
    props.navigate('Playlist', {currentPlaylist: item})
  };
  
  const renderItem = ({item}: any) => {
    // let subText = getSubText(item);
    const universalStyle = {
      // height: 256,
      // width: 256,
      borderRadius: 22,
      margin: 20
    }
    const circleStyle = {
      // height: 256,
      // width: 256,
      borderRadius: 128,
      margin: 20
    };
    const itemProps = {
      id: item.id, imageUrl: getImageUrl(item), type, name: item.name,
      isExplicit: Boolean(type === "album" && item.mark === 1056768),
      isPrivacy: Boolean(type === "playlist" && item.privacy === 10),
      subText: subText??undefined,
      imageStyle: type=="artist"?circleStyle:universalStyle,
    }
    // console.log(item, itemProps);
    
    return (
      <TouchableHighlight onPress={()=>handlePress(item)}>
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
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  coverRow: {
    display: "flex",
  },
});
function getSubText(item) {
  if (item.subText === 'copywriter') return item.copywriter;
  if (item.subText === 'description') return item.description;
  if (item.subText === 'updateFrequency') return item.updateFrequency;
  if (item.subText === 'creator') return 'by ' + item.creator.nickname;
  if (item.subText === 'releaseYear')
    return new Date(item.publishTime).getFullYear();
  if (item.subText === 'artist') {
    if (item.artist !== undefined)
      return `<a href="/#/artist/${item.artist.id}">${item.artist.name}</a>`;
    if (item.artists !== undefined)
      return `<a href="/#/artist/${item.artists[0].id}">${item.artists[0].name}</a>`;
  }
  if (item.subText === 'albumType+releaseYear') {
    let albumType = item.type;
    if (item.type === 'EP/Single') {
      albumType = item.size === 1 ? 'Single' : 'EP';
    } else if (item.type === 'Single') {
      albumType = 'Single';
    } else if (item.type === '专辑') {
      albumType = 'Album';
    }
    return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
  }
  if (item.subText === 'appleMusic') return 'by Apple Music';
}

