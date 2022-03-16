import { CoverProps } from "@/types";
import { StyleSheet, Pressable, Image } from "react-native";
import styled from "styled-components/native";

import { View, Text } from "./Themed";
import { Explicit, Lock } from "./icons";

const CoverTitle = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 20;
  overflow: hidden;
  margin: auto 20px auto 20px;
  text-align: justify;
  flex-wrap: wrap;
`;
const SubTitle = styled.Text`
  font-size: 13px;
  color: #e8e6e3;
  opacity: 0.68;
  line-height: 18;
  overflow: hidden;
  margin: auto 20px auto 20px;
  text-align: justify;
  flex-wrap: wrap;
`;
export function Cover(props: any) {
  // console.log('@', props);
  const { imageUrl, subText, name, isPrivacy, isExplicit, imageStyle, componentWidth } = props;
  return (
    <View style={{ width: imageStyle.width+imageStyle.margin*2 }}>
      <View >
        <Image
          source={{
            uri: imageUrl,
          }}
          style={imageStyle}
        />
        <View >
          <CoverTitle>
            {isExplicit && <Explicit />}
            {isPrivacy && <Lock />}
            {name ?? ''}
          </CoverTitle>
          {subText && <SubTitle>{subText}</SubTitle>}
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
