import { CoverProps } from "@/types";
import { StyleSheet, Pressable, Image } from "react-native";
import styled from "styled-components/native";

import { View, Text } from "./Themed";
import { Explicit, Lock } from "./icons";

const CoverTitle = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  display: flex;
  overflow: hidden;
  width: 200px;
  margin: auto 20px auto 20px;
`;
const SubTitle = styled.Text`
  font-size: 13px;
  color: #e8e6e3;
  opacity: 0.68;
  line-height: 18px;
  display: flex;
  overflow: hidden;
  margin: auto 20px auto 20px;
`;
export function Cover(props: any) {
  // console.log('@', props);
  const { imageUrl, subText, name, isPrivacy, isExplicit, imageStyle } = props;
  return (
    <View>
      <View style={styles.coverContainer}>
        <Image
          source={{
            uri: imageUrl, 
          }}
          style={[imageStyle, styles.imageStyles]}
        />
        <View >
          <CoverTitle>
            {isExplicit && <Explicit />}
            {isPrivacy && <Lock />}
            {name??''}
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
  imageStyles: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
});
