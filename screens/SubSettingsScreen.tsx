import * as React from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

import { Text, useThemeColor, View } from "@/components/Themed";
// import { SubSettings } from '../components';
import type { OptionType, SettingsStackScreenProps } from "@/types";
import { createSettingsDataFactory } from "react-native-settings-template";
import {
  Appearance,
  Lang,
  LyricsBackground,
  LyricsFontSize,
  MusicLang,
  MusicQuality,
  settings
} from "@/hydrate/settings";
import { useSnapshot } from "valtio";

const SubSettings = createSettingsDataFactory();
const SectionData = SubSettings.createSectionFactory();

const languageOptions: OptionType<"lang">[] = [
  { option: Lang.EN ,name: "🇬🇧 English" },
  { option: Lang.TR, name: "🇹🇷 Türkçe" },
  { option: Lang.CN, name: "🇨🇳 简体中文" },
  { option: Lang.TW, name: "繁體中文" },
];

const appearanceOptions: OptionType<"appearance">[] = [
  { option: Appearance.Auto, name: "Auto" },
  { option: Appearance.Light, name: "Bright" },
  { option: Appearance.Dark, name: "Dark" },
];

const musicLangOptions: OptionType<"musicLanguage">[] = [
  { option: undefined, name: "No Preference" },
  { option: MusicLang.zh, name: "China-Pop" },
  { option: MusicLang.ea, name: "Western" },
  { option: MusicLang.jp, name: "Jan-Pop" },
  { option: MusicLang.kr, name: "K-Pop" },
];

const musicQualityOptions: OptionType<"musicQuality">[] = [
  { option: MusicQuality.Low, name: "128Kbps"},
  { option: MusicQuality.Normal, name: "192Kbps" },
  { option: MusicQuality.High, name: "320Kbps" },
  { option: MusicQuality.FLAC, name: "FLAC" },
];

const lyricsBgOptions: OptionType<"lyricsBackground">[] = [
  { option: LyricsBackground.On, name: "On" },
  { option: LyricsBackground.Off, name: "Off" },
  { option: LyricsBackground.Blur, name: "Blur" },
];

const lyricsFsizeOptions: OptionType<"lyricFontSize">[] = [
  { option: LyricsFontSize.Small, name: "16px" },
  { option: LyricsFontSize.Medium, name: "22px" },
  { option: LyricsFontSize.Large, name: "28px" },
  { option: LyricsFontSize.Xlarge, name: "36px" },
];

export function SubSettingsScreen({
  route,
}: SettingsStackScreenProps<"SubSettings">) {
  const snappedSettings = useSnapshot(settings);
  const viewStyle: ViewStyle = {
    backgroundColor: useThemeColor({}, "tintBackground"),
  };
  const textStyle: TextStyle = {
    color: useThemeColor({}, "text"),
  };
  const [subElements, setSubElements] = React.useState<OptionType[]>();
  const handleSettingsDispatch = (option: OptionType) => {
    if (!route.params) return;
    const { requestSubSettings } = route.params;
    settings[requestSubSettings.toString()] = option.option;
  };
  const handleRenderAccessory = (option: OptionType) => {
    if (!route.params) return <></>;
    const { requestSubSettings } = route.params;
    return (
      <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
        {option.option == snappedSettings[requestSubSettings] ? "Selected" : ""}
      </Text>
    );
  };
  React.useEffect(() => {
    if (!route.params) return;
    const { requestSubSettings } = route.params;
    switch (requestSubSettings) {
      case "lang":
        setSubElements(languageOptions);
        break;
      case "appearance":
        setSubElements(appearanceOptions);
        break;
      case "musicLanguage":
        setSubElements(musicLangOptions);
        break;
      case "musicQuality":
        setSubElements(musicQualityOptions);
        break;
      case "lyricsBackground":
        setSubElements(lyricsBgOptions);
        break;
      case "lyricFontSize":
        setSubElements(lyricsFsizeOptions);
        break;
    }
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      {/* <SubSettings {...props}/> */}
      <SubSettings.SettingsScreen viewStyle={viewStyle} textStyle={textStyle}>
        <SectionData.Section>
          {subElements?.map((option, index) => (
            <SectionData.Row
              title={option.name}
              key={option.option}
              onPress={() => handleSettingsDispatch(option)}
              renderAccessory={() => handleRenderAccessory(option)}
            />
          ))}
        </SectionData.Section>
      </SubSettings.SettingsScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

