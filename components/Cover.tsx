import { StyleSheet, Pressable, Image } from "react-native";

import { View } from "./Themed";

const handleCoverPress = () => {};
const handleCoverContainerPress = () => {};
const imageUrl: string = '';

export function Cover(props:any) {
  console.log(props);
  
  return (
    <View>
      <Pressable onPress={handleCoverPress}>
        <View style={styles.cover}></View>
      </Pressable>
      <Pressable onPress={handleCoverContainerPress}>
        <View style={styles.coverContainer}>
          {/* <Image source={require(imageUrl)} /> */}
        </View>
      </Pressable>
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
});
