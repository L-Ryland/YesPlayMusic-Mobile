import { trackPlayer, useProgress } from "@/hydrate/player";
import { useSnapshot } from "valtio";
import React, { createRef, Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  StyleSheet,
  ViewStyle,
  FlatList,
  TextStyle,
  Dimensions,
  FlatListProps,
  ToastAndroid, LogBox
} from "react-native";
import { View, Text } from "@/components/Themed";
import { lyricParser } from "@/utils/lyric";


const { width } = Dimensions.get('window');


export const Lyrics: React.FC<{ lyric: ReturnType<typeof lyricParser> | undefined, onEnableScroll: (param: boolean) => void }> = ({ lyric, onEnableScroll }) => {
  //   const ease = [0.5, 0.2, 0.2, 0.8]
  // alert(`lyrics - ${JSON.stringify(lyric)}`)
  const lyricsFlatlistRef = useRef<FlatList>(null);
  const { position: progress, duration } = useProgress();
  const currentLine = useMemo(() => {
    const index =
      (lyric?.lyric.findIndex(({ time }) => time > progress) ?? 1) - 1;
    return {
      index: index < 1 ? 0 : index,
      time: lyric?.lyric?.[index]?.time ?? 0,
    };
  }, [lyric?.lyric, progress]);

  const displayLines = useMemo(() => {
    const index = currentLine.index;
    const lines =
      lyric?.lyric.slice(index === 0 ? 0 : index - 1, currentLine.index + 7) ??
      [];
    if (index === 0) {
      lines.unshift({
        time: 0,
        content: "",
        rawTime: "[00:00:00]",
      });
    }
    return lines;
  }, [currentLine.index, lyric?.lyric]);
  const renderItem = ({ item, index }) => {
    // ToastAndroid.show(`item - ${JSON.stringify(item)}`, ToastAndroid.LONG)
    const { content, time } = item;
    const isActive = index === currentLine.index;
    // const isActive = true
    return (
      <View style={styles.lrc} key={index}>
        {/*<Text style={styles.text}>{item?.content}</Text>*/}
        {renderText(item.content, isActive)}
        {/* {renderText(item.translation, isActive)} */}
      </View>
    )
  }
  const renderText = (text: string, isActive: boolean) => {
    return text ?
      // tslint:disable-next-line:jsx-wrap-multiline
      <Animated.Text
        style={[styles.text, isActive && { opacity, color: "black" }]}
      >
        {text}
      </Animated.Text> :
      null
  }
  const visible = true;
  const opacity: Animated.Value = new Animated.Value(0);
  const handleFallbackScroll = () => {
    if (lyricsFlatlistRef.current === null) return;
    lyricsFlatlistRef.current.scrollToIndex({ index: 0 });
  }
  useEffect(() => {
    // lyricsFlatlistRef.current?.scrollToIndex({index: currentLine.index})
    if (lyricsFlatlistRef.current === null || !lyric || lyric.lyric.length === 0 || currentLine.index < 0) return;
    // alert(`currentLine - ${currentLine.index}`)
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 2000,useNativeDriver: true }).start()
    } else {
      Animated.timing(opacity, { toValue: 0, useNativeDriver: true }).start()
    }
    lyricsFlatlistRef.current.scrollToIndex({ index: currentLine.index, viewPosition: 0.5, animated: true })
  }, [currentLine.index])
  // alert(`displayLines - ${JSON.stringify(displayLines)}`);
  const variants = {
    initial: { opacity: [0, 0.2], y: ["24%", 0] },
    current: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.5, 0.2, 0.2, 0.8],
        duration: 0.7,
      },
    },
    rest: (index: number) => ({
      opacity: 0.2,
      y: 0,
      transition: {
        delay: index * 0.04,
        ease: [0.5, 0.2, 0.2, 0.8],
        duration: 0.7,
      },
    }),
    exit: {
      opacity: 0,
      y: -132,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      transition: {
        duration: 0.7,
        ease: [0.5, 0.2, 0.2, 0.8],
      },
    },
  };


  return (
    <View style={[styles.frame]}>
      {/*<Text>{JSON.stringify(lyric.lyric)}</Text>*/}
      <FlatList
        style={ lyric && { height: 350, width: width - 40 }}
        // contentContainerStyle={{ height: 350 }}
        nestedScrollEnabled
        onMomentumScrollBegin={() => onEnableScroll(false)}
        onMomentumScrollEnd={() => onEnableScroll(true)}
        onScrollToIndexFailed={handleFallbackScroll}
        // initialScrollIndex={0}
        ref={lyricsFlatlistRef}
        data={lyric?.lyric}
        renderItem={renderItem}
        // getItemLayout={this.getItemLayout}
        keyExtractor={(_, index) => index.toString()}
        extraData={displayLines}
      // refreshing={this.props.refreshing}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  frame: {
    backgroundColor: "purple",
    borderRadius: 10,
    width: .8 * width,
  } as ViewStyle,
  lrc: {
    height: 40,
    width: .8 * width,
    backgroundColor: "transparent",
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  text: {
    textAlign: 'center',
    color: '#ccc',
    lineHeight: 17,
    fontSize: 18,
    fontWeight: "bold"
  } as TextStyle,
  active: {
    color: '#C10D0C'
  } as TextStyle,
});

