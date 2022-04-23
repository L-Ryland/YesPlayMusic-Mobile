import type { SettingsData } from "react-native-settings-screen";
import { SettingsStackScreenProps } from "../types";
import { SettingsScreen as SettingsPage } from "./Themed";
import {
  appreanceProp,
  langProp,
  lyricFontSizeProp,
  lyricsBackgroundProp,
  musicLangProp,
  musicQualityProp,
  SettingsState,
  switchLang,
  updateSettings
} from "../redux/slice/settingsSlice";
import { Text } from "./Themed";
import type { OptionType } from "../types";
import { connect } from "react-redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";


const languageOptions: OptionType<'lang'>[] = [
  { option: "en", name: "🇬🇧 English" },
  { option: "tr", name: "🇹🇷 Türkçe" },
  { option: "zh-CN", name: "🇨🇳 简体中文" },
  { option: "zh-TW", name: "繁體中文" },
];

const appearanceOptions: OptionType<'appearance'>[] = [
  { option: "auto", name: "Auto" },
  { option: "light", name: "Bright" },
  { option: "dark", name: "Dark" },
];


const musicLangOptions: OptionType<'musicLanguage'>[] = [
  { option: "all", name: "No Preference" },
  { option: "zh", name: "China-Pop" },
  { option: "ea", name: "Western" },
  { option: "jp", name: "Jan-Pop" },
  { option: "kr", name: "K-Pop" },
];


const musicQualityOptions: OptionType<'musicQuality'>[] = [
  { option: 192000, name: "192Kbps" },
  { option: 320000, name: "320Kbps" },
  { option: 999000, name: "FLAC" },
];

const lyricsBgOptions: OptionType<'lyricsBackground'>[] = [
  { option: "on", name: "On" },
  { option: "off", name: "Off" },
  { option: "blur", name: "Blur" },
];

const lyricsFsizeOptions: OptionType<'lyricFontSize'>[] = [
  { option: "small", name: "16px" },
  { option: "medium", name: "22px" },
  { option: "large", name: "28px" },
  { option: "xlarge", name: "36px" },
];

export function SubSettingsView({
  settings,
  dispatch,
  navigation,
  route,
}) {
  const { lang, appearance, musicLanguage, musicQuality, lyricsBackground, lyricFontSize } = settings;
  // const dispatch = useAppDispatch();
  // const { navigation, route } = props
  console.log("subsetting received props ", settings, navigation, route, dispatch);

  const { params } = route;

  // select methods as parameters passedd to settingsData Array. 
  function selectGeneral(optionName?: keyof SettingsState) {

    let optionsName: OptionType[] = [];
    let currentState: typeof settings[keyof typeof settings];
    let optionKey = optionName;
    switch (optionKey) {
      case "lang":
        optionsName = languageOptions;
        currentState = lang;
        break;
      case "appearance":
        optionsName = appearanceOptions;
        currentState = appearance;
        break;
      case "musicLanguage":
        optionsName = musicLangOptions;
        currentState = musicLanguage;
        break;
      case "musicQuality":
        optionsName = musicQualityOptions;
        currentState = musicQuality;
        break;
      case "lyricsBackground":
        optionsName = lyricsBgOptions;
        currentState = lyricsBackground;
        break;
      case "lyricFontSize":
        optionsName = lyricsFsizeOptions;
        currentState = lyricFontSize;
        break;

      default:
        break;
    }

    return { optionsName, currentState, optionKey };
  }
  const { optionsName, currentState, optionKey } = selectGeneral(params?.requestSubSettings);
  if (optionsName.length > 0 && currentState) {
    currentOptions = [
      {
        type: "SECTION",
        key: "test",
        rows: optionsName.map(
          (optionName: OptionType) => {
            if (optionName.option === currentState) {
              return {
                title: optionName.name,
                showDisclosureIndicator: false,
                renderAccessory: () => (
                  <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
                    Selected
                  </Text>
                ),
                onPress: () => {
                  // dispatch(currentAction(optionName.option as never));
                  if (optionKey) {
                    if (optionKey == 'lang') {
                      dispatch(switchLang(optionName.option)).then();
                      return;
                    }
                    dispatch(updateSettings({
                      key: optionKey,
                      value: optionName.option
                    }))
                  }

                }
              };
            }
            return {
              title: optionName.name,
              showDisclosureIndicator: false,
              onPress: () => {
                if (optionKey) {
                  if (optionKey == 'lang') {
                    dispatch(switchLang(optionName.option)).then();
                    return;
                  }
                  dispatch(updateSettings({
                    key: optionKey,
                    value: optionName.option
                  }))
                }
                // dispatch(currentAction(optionName.option as never))
              },
            };
          }
        ),
      },
    ];
  }

  return (
    // <View>
    <SettingsPage data={currentOptions} />
  );
}

function mapStateToProps(state, { navigation, route }: SettingsStackScreenProps<"SubSettingsScreen">) {
  const { settings } = state;
  return { settings, navigation, route }
}

export const SubSettings = connect(mapStateToProps)(SubSettingsView)
let currentOptions: SettingsData;
