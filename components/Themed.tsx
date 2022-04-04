/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import React from "react";
import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  Image as DefaultImage,
  Button as DefaultButton,
  TextInput as DefaultTextInput,
  TouchableHighlight,
  StyleSheet
} from "react-native";
import { Props, SettingsScreen as DefaultSettingsScreen } from "react-native-settings-screen";
import styled from "styled-components/native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string; },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function useSvgStyle(
  { height = 35, width = 35 }
) {
  const theme = useColorScheme();
  const svgColor = Colors[theme]['tint'];
  console.log('current svgColor', svgColor);

  return {
    height, width,
    color: svgColor,
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ScrollViewProps = ThemeProps & DefaultScrollView["props"];
export type ImageProps = ThemeProps & DefaultImage["props"];
export type SettingsScreenProps = ThemeProps &
  DefaultSettingsScreen["props"] &
  DefaultScrollView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

export function Image(props: ImageProps) {
  const { style, source, lightColor, darkColor, ...otherProps } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultImage
      source={source}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export function SettingsScreen(props: SettingsScreenProps) {
  let { style, data, lightColor, darkColor, ...otherProps } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultSettingsScreen data={data} style={{ backgroundColor }} {...otherProps} />;
}
// export function Button(props: ThemeProps & DefaultButton["props"]) {
//   return <DefaultButton {...props} />;
// }
export const Button: React.FC<ThemeProps & TouchableHighlight["props"]> = (props) => {
  const { lightColor,  darkColor, onPress, children, ...otherProps } = props;
  const buttonColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'buttonColor'
  )
  const styles = StyleSheet.create({
    middleButton: {
      backgroundColor: buttonColor,
      margin: 10,
      paddingTop: 6,
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 6,
      alignContent: 'center',
      borderRadius: 10
    },
    middleTitle: {
      fontSize: 16
    },
  })
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.middleButton}>
        <Text style={styles.middleTitle}>{children}</Text>
      </View>
    </TouchableHighlight>
  );
}

export const Title: React.FC = styled(Text).attrs(() => ({
  adjustsFontSizeToFit: true
}))`
  display: flex;
  justifyContent: space-between;
  alignItems: flex-end;
  margin-bottom: 20;
  fontSize: 40;
  fontWeight: 700;
  padding: 0px 0px 8px 8px;
`
export const CoverTitle: React.FC = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  line-height: 20;
  overflow: hidden;
  margin: auto 20px auto 20px;
  text-align: justify;
  flex-wrap: wrap;
`;
export const CoverSubTitle: React.FC = styled(Text)`
  font-size: 13px;
  color: #e8e6e3;
  opacity: 0.68;
  line-height: 18;
  overflow: hidden;
  margin: auto 20px auto 20px;
  text-align: justify;
  flex-wrap: wrap;
`;
// export function TextInput(props: ThemeProps & React.LegacyRef<DefaultTextInput> & DefaultTextInput["props"]) {
// export function TextInput(props: any) {
//   let { style, lightColor, darkColor, ref, ...otherProps } = props;

//   const backgroundColor = useThemeColor(
//     { light: lightColor, dark: darkColor },
//     "background"
//   );
//   const color = useThemeColor(
//     { light: lightColor, dark: darkColor },
//     "text"
//   );

//   return <DefaultTextInput style={[{backgroundColor}, {color}, style]} ref={ref} {...otherProps} />;
// }
export const TextInput: React.FC = React.forwardRef((props: ThemeProps & DefaultTextInput["props"], ref: React.Ref<DefaultTextInput> | undefined) => {
  const { style, lightColor, darkColor, ...otherProps } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return <DefaultTextInput style={[{ backgroundColor }, { color }, style]} ref={ref} {...otherProps} />;
})
