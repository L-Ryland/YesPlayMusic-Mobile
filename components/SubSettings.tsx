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
  selectSettings,
  switchLang, 
  switchAppearance, 
  switchMusicLang,
  switchMusicQuality,
  switchLyricsBackGround,
  switchLyricsFontSize
} from "../redux/slice/settingsSlice";
import { Text } from "./Themed";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import type { OptionType } from "../types";
import { connect } from "react-redux";

interface LangOptionType extends OptionType {
  option: langProp;
}
const languageOptions: LangOptionType[] = [
  { option: "en", name: "🇬🇧 English" },
  { option: "tr", name: "🇹🇷 Türkçe" },
  { option: "zh-CN", name: "🇨🇳 简体中文" },
  { option: "zh-TW", name: "繁體中文" },
];

interface AppearnceOptionType extends OptionType {
  option: appreanceProp;
}
const appearanceOptions: AppearnceOptionType[] = [
  { option: "auto", name: "Auto" },
  { option: "light", name: "Bright" },
  { option: "dark", name: "Dark" },
];

interface MusicLangOptionType extends OptionType {
  option: musicLangProp;
}
const musicLangOptions: MusicLangOptionType[] = [
  { option: "all", name: "No Preference" },
  { option: "zh", name: "China-Pop" },
  { option: "ea", name: "Western" },
  { option: "jp", name: "Jan-Pop" },
  { option: "kr", name: "K-Pop" },
];

interface MusicQualityOptionType extends OptionType {
  option: musicQualityProp;
}
const musicQualityOptions: MusicQualityOptionType[] = [
  { option: 128000, name: "128Kbps" },
  { option: 192000, name: "192Kbps" },
  { option: 320000, name: "320Kbps" },
  { option: 999000, name: "FLAC" },
];

interface LyricsBgOptionType extends OptionType {
  option: lyricsBackgroundProp;
}
const lyricsBgOptions: LyricsBgOptionType[] = [
  { option: "on", name: "On" },
  { option: "off", name: "Off" },
  { option: "blur", name: "Blur" },
];

interface LyricsFsizeOptionType extends OptionType {
  option: lyricFontSizeProp;
}
const lyricsFsizeOptions: LyricsFsizeOptionType[] = [
  { option: "small", name: "16px" },
  { option: "medium", name: "22px" },
  { option: "large", name: "28px" },
  { option: "xlarge", name: "36px" },
];

export function SubSettings({
  navigation,
  route,
}: SettingsStackScreenProps<"SubSettingsScreen">) {
  const { lang, appearance, musicLanguage, musicQuality, lyricsBackground, lyricFontSize } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { params } = route;

  // select methods as parameters passedd to settingsData Array. 
  function selectGeneral(optionName?: String) {

    let optionsName: OptionType[] = [];
    let currentAction, currentState;
    switch (optionName) {
      case "Language":
        optionsName = languageOptions;
        currentAction = switchLang;
        currentState = lang;
        break;
      case "Appearance": 
        optionsName = appearanceOptions;
        currentAction = switchAppearance;
        currentState = appearance;
        break;
      case "MusicPreference": 
        optionsName = musicLangOptions;
        currentAction = switchMusicLang;
        currentState = musicLanguage;
        break;
      case "StreamQuality": 
        optionsName = musicQualityOptions;
        currentAction = switchMusicQuality;
        currentState = musicQuality;
        break;
      case "LyricsBg": 
        optionsName = lyricsBgOptions;
        currentAction = switchLyricsBackGround;
        currentState = lyricsBackground;
        break;
      case "LyricsFsize": 
        optionsName = lyricsFsizeOptions;
        currentAction = switchLyricsFontSize;
        currentState = lyricFontSize;
        break;
      
      default:
        break;
    }
    
    return { optionsName, currentAction, currentState};
  }
  const {optionsName, currentAction, currentState} = selectGeneral(params?.requestSubSettings);
  if (optionsName.length > 0 && currentAction && currentState) {
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
                  dispatch(currentAction(optionName.option as never))
                },
              };
            }
            return {
              title: optionName.name,
              showDisclosureIndicator: false,
              onPress: () => {
                  dispatch(currentAction(optionName.option as never))
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

let currentOptions:SettingsData;
