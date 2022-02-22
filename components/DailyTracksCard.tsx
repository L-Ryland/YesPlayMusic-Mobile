import * as React from "react";
import {
  Animated,
  StyleSheet,
  Image,
  Easing,
  ImageBackground,
  SafeAreaView,
  Button,
} from "react-native";
import styled from "styled-components/native";
const Title = styled.Text`
  height: 100%;
  width: 100%;
  font-weight: 600;
  font-size: 64px;
  line-height: 48px;
  opacity: 0.96;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  place-items: center;
`;
const TitleBox = styled.View`
  height: 100%;
  width: 100%;
  font-weight: 600;
  font-size: 64px;
  line-height: 48px;
  opacity: 0.96;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  place-items: center;
`;
const Container = styled.View`
  // background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.28));
  height: 198px;
  width: 50%;
  display: flex;
  align-items: center;
  border-radius: 0.94rem;
  z-index: 2;
`;

// transfrom: translate(${translateValue.x.toString()}, ${translateValue.y.toString()});
// animation: move 38s infinite;
// animation-direction: alternate;
const DailyRecommendCard = styled.View`
  border-radius: 1rem;
  height: 198px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;
const CoverImage = styled(Animated.createAnimatedComponent(ImageBackground))`
  // position: center;
  // top: 0;
  // left: 0;
  width: 400%;
  height: 400%;
  z-index: -1;
  // flex: 1;
`;
const defaultCovers = [
  "https://p2.music.126.net/0-Ybpa8FrDfRgKYCTJD8Xg==/109951164796696795.jpg",
  "https://p2.music.126.net/QxJA2mr4hhb9DZyucIOIQw==/109951165422200291.jpg",
  "https://p1.music.126.net/AhYP9TET8l-VSGOpWAKZXw==/109951165134386387.jpg",
];

// const CoverImage = Animated.createAnimatedComponent(ImageBackground);
export function DailyTracksCard2(props) {
  const translateValue = React.useRef(new Animated.Value(0)).current;

  // const translateValue = React.useRef(new Animated.Value(0)).current;
  const AnimationTranslate = translateValue.interpolate({
    inputRange: [0, 2],
    outputRange: [-198, -792],
  });
  // console.log(translateValue, AnimationTranslate);

  const mounted = React.useRef(false);

  // }).start(() => startMoving());
  // }).stop(() => startMoving());
  React.useEffect(() => {
    mounted.current = true;
    if (mounted.current) {
      Animated.timing(translateValue, {
        toValue: -792,
        duration: 3800,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {});
      // startMoving.stop();
    }
    return () => {
      mounted.current = false;
      // translateValue
    };
  }, [translateValue]);

  // console.log(AnimationTranslate, translateValue);

  // const AnimatedCover = Animated.createAnimatedComponent(CoverImage);
  return (
    <SafeAreaView>
      <DailyRecommendCard>
        <Container>
          <TitleBox>
            <Title>每日推荐</Title>
          </TitleBox>
        </Container>
        <CoverImage
          source={{ uri: defaultCovers[1] }}
          resizeMode="repeat"
          style={{
            transform: [{ translateY: translateValue }],
          }}
        />
        {props.childs}
        {/* <ImageBackground style={{height: '100%',width: '100%'}} source={{uri: defaultCovers[1]}}/> */}
      </DailyRecommendCard>
    </SafeAreaView>
  );
}

export class DailyTracksCard extends React.Component {
  translateValue = new Animated.Value(0);
  animationTranslate = this.translateValue.interpolate({
    inputRange: [0, 2],
    outputRange: [-198, -792],
  });
  componentDidMount(){

    Animated.timing(this.translateValue, {
      toValue: 2,
      duration: 3800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {});
  }
  render() {
    return (
      <SafeAreaView>
        <DailyRecommendCard>
          <Container>
            <TitleBox>
              <Title>每日推荐</Title>
            </TitleBox>
          </Container>
          <CoverImage
            source={{ uri: defaultCovers[1] }}
            resizeMode="repeat"
            style={{
              transform: [{ translateY: this.animationTranslate }],
            }}
          />
          {/* <ImageBackground style={{height: '100%',width: '100%'}} source={{uri: defaultCovers[1]}}/> */}
        </DailyRecommendCard>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  coverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    // animationKeyFrames: "move 38s infinite",
    // animationDirection: "alternate",
    // zIndex: -1,
  },
});
