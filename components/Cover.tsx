import { CoverProps } from "@/types";
import { StyleSheet, Pressable, Image } from "react-native";
import styled from "styled-components/native";

import { View, Text, ExplicitSymbol, LockSymbol } from "./Themed";




const CoverTitle = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  display: flex;
  overflow: hidden;
  numberoflines: "3";
  ellipsizemode: middle;
`;
const SubTitle = styled.Text`
  font-size: 12px;
  color: #e8e6e3;
  opacity: 0.68;
  line-height: 18px;
  display: flex;
  overflow: hidden;
`;
export function Cover(props: CoverProps) {
  // console.log(props);
  const { imageUrl, subText, name, isPrivacy, isExplicit } = props;
  return (
    <View>
      <View style={styles.coverContainer}>
        <Image
          source={{
            uri: imageUrl,
          }}
          style={styles.imageStyles}
        />
        <CoverTitle>
          {isExplicit && <ExplicitSymbol />}
          {isPrivacy && <LockSymbol />}
          {name}
        </CoverTitle>
        {/* <Text>{name}</Text> */}
        <SubTitle>{subText}</SubTitle>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    position: "relative",
    // transition: transform 0.3s,
  },
  coverContainer: {
    position: "relative",
  },
  imageStyles: {
    width: 200,
    height: 200,
    resizeMode: "stretch",
  },
});
