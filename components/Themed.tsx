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
} from "react-native";
import { SettingsScreen as DefaultSettingsScreen } from "react-native-settings-screen";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
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

  return <DefaultSettingsScreen data={data} style={{backgroundColor}} {...otherProps} />;
}
export function Button(props: ThemeProps & DefaultButton["props"]) {
  return <DefaultButton {...props} />;
}


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
export const TextInput = React.forwardRef((props: ThemeProps & DefaultTextInput["props"], ref: React.Ref<DefaultTextInput>|undefined)=>{
  let { style, lightColor, darkColor, ...otherProps } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return <DefaultTextInput style={[{backgroundColor}, {color}, style]} ref={ref} {...otherProps} />;
})