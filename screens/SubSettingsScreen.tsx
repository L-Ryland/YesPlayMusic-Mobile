import * as React from "react";
import { StyleSheet } from "react-native";
import type { ViewStyle, TextStyle } from "react-native";

import { useThemeColor, View, Text } from "../components/Themed";
// import { SubSettings } from '../components';
import type { OptionType, SettingsStackScreenProps } from "@/types";
import { createSettingsDataFactory } from "react-native-settings-template";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/redux/store";
import { switchLang, updateSettings } from "@/redux/slice/settingsSlice";

const SubSettings = createSettingsDataFactory();
const SectionData = SubSettings.createSectionFactory();

const languageOptions: OptionType<"lang">[] = [
  { option: "en", name: "🇬🇧 English" },
  { option: "tr", name: "🇹🇷 Türkçe" },
  { option: "zh-CN", name: "🇨🇳 简体中文" },
  { option: "zh-TW", name: "繁體中文" },
];

const appearanceOptions: OptionType<"appearance">[] = [
  { option: "auto", name: "Auto" },
  { option: "light", name: "Bright" },
  { option: "dark", name: "Dark" },
];

const musicLangOptions: OptionType<"musicLanguage">[] = [
  { option: "all", name: "No Preference" },
  { option: "zh", name: "China-Pop" },
  { option: "ea", name: "Western" },
  { option: "jp", name: "Jan-Pop" },
  { option: "kr", name: "K-Pop" },
];

const musicQualityOptions: OptionType<"musicQuality">[] = [
  { option: 192000, name: "192Kbps" },
  { option: 320000, name: "320Kbps" },
  { option: 999000, name: "FLAC" },
];

const lyricsBgOptions: OptionType<"lyricsBackground">[] = [
  { option: "on", name: "On" },
  { option: "off", name: "Off" },
  { option: "blur", name: "Blur" },
];

const lyricsFsizeOptions: OptionType<"lyricFontSize">[] = [
  { option: "small", name: "16px" },
  { option: "medium", name: "22px" },
  { option: "large", name: "28px" },
  { option: "xlarge", name: "36px" },
];

function SubSettingsScreenView({
  dispatch,
  settings,
  navigation,
  route,
}: SubSettingsScreenConnectedProps) {
  const viewStyle: ViewStyle = {
    backgroundColor: useThemeColor({}, "tintBackground"),
  };
  const textStyle: TextStyle = {
    color: useThemeColor({}, "text"),
  };
  const [subElements, setSubElements] = React.useState<OptionType[]>();
  const {
    lang,
    appearance,
    musicLanguage,
    musicQuality,
    lyricsBackground,
    lyricFontSize,
  } = settings;
  const handleSettingsDispatch = (option: OptionType) => {
    if (!route.params) return;
    const { requestSubSettings } = route.params;
    if (requestSubSettings == "lang") {
      // @ts-ignore
      dispatch(switchLang(option.option)).then();
    } else {
      dispatch(
        updateSettings({ key: requestSubSettings, value: option.option })
      );
    }
  };
  const handleRenderAccessory = (option: OptionType) => {
    if (route.params) {
      const { requestSubSettings } = route.params;
      if (option.option == settings[requestSubSettings]) {
        return (
          <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
            Selected
          </Text>
        );
      }
    }
    return  <></>
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

function mapStateToProps(
  state: RootState,
  { navigation, route }: SettingsStackScreenProps<"SubSettingsScreen">
) {
  const { settings } = state;
  return { settings, navigation, route };
}

type SubSettingsScreenConnectedProps = ConnectedProps<typeof connector>;
const connector = connect(mapStateToProps);
export const SubSettingsScreen = connector(SubSettingsScreenView);
