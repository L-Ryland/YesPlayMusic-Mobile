import { StyleSheet, Pressable, Image, ImageStyle, ViewStyle } from "react-native";
import styled from "styled-components/native";

import { View, Text, CoverTitle, CoverSubTitle } from "./Themed";
import { Explicit, Lock } from "./icons";

export type CoverProps = {
  // id: number;
  imageStyle: ImageStyle | ImageStyle[],
  viewStyle?: ViewStyle | ViewStyle[],
  coverImgUrl?: string;
  img1v1ID?: string;
  name?: string;
  mark?: number;
  picUrl?: string;
  privacy?: number;
  type?: 'playlist' | 'artist' | 'album';
  imageUrl?: string;
  subTitle?: string | undefined;
  isPrivacy?;
  isExplicit?: boolean;
};
// const CoverTitle = styled(Text)`
//   font-size: 16px;
//   font-weight: 600;
//   line-height: 20;
//   overflow: hidden;
//   margin: auto 20px auto 20px;
//   text-align: justify;
//   flex-wrap: wrap;
// `;
// const CoverSubTitle = styled(Text)`
//   font-size: 13px;
//   color: #e8e6e3;
//   opacity: 0.68;
//   line-height: 18;
//   overflow: hidden;
//   margin: auto 20px auto 20px;
//   text-align: justify;
//   flex-wrap: wrap;
// `;
export const Cover: React.FC<CoverProps> = (props) => {
  // console.log('@', props);
  const { imageUrl, subTitle, name, isPrivacy, isExplicit, imageStyle, viewStyle, type } = props;
  return (
    <View style={viewStyle}>
      <View >
        <Image
          source={{
            uri: imageUrl,
          }}
          style={imageStyle}
        />
        <View >
          <CoverTitle style={{textAlign: type == "artist" ? 'center' : "justify" }}>
            {isExplicit && <Explicit />}
            {isPrivacy && <Lock />}
            {name ?? ''}
          </CoverTitle>
          {subTitle && <CoverSubTitle>{subTitle}</CoverSubTitle>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    position: "relative",
  },
  coverContainer: {
    position: "relative",
  },
});
