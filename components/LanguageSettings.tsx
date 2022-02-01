import type { SettingsData } from "react-native-settings-screen";
import { SettingsStackScreenProps } from "../types";
import {
  SettingsScreen as SettingsPage,
} from "./Themed";
import { switchLang, langProp, selectSettings } from "../redux/slice/settingsSlice";
import { Text } from "./Themed";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import type { OptionType } from "../types";

export function LanguageSettings(
  props: SettingsStackScreenProps<"AppearanceSettings">
) {
  interface LangOptionType extends OptionType {
    option: langProp;
  }
  const {lang} = useAppSelector(selectSettings)
  console.log(lang);
  
  const dispatch = useAppDispatch();
  const options:LangOptionType[] = [
    {option: 'en', name: '🇬🇧 English'},
    {option: 'tr', name: '🇹🇷 Türkçe'},
    {option: 'zh-CN', name: '🇨🇳 简体中文' },
    {option: 'zh-TW', name: '繁體中文'}
  ];

  const languageOptions: SettingsData = [
    {
      type: "SECTION",
      key: "lang",
      rows: options.map((option:LangOptionType)=>{
        if (option.option === lang) {
          return {
            title: option.name, 
            showDisclosureIndicator: false,
            renderAccessory: () => (
              <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
                Selected
              </Text>
            ),
            onPress: () =>{
              dispatch(switchLang(option.option));
            },
          }
        } 
        return {
          title: option.name, 
          showDisclosureIndicator: false,
          onPress: () =>{
            dispatch(switchLang(option.option));
          },
        }
      })
    }
  ];
  return (
    // <View>
    <SettingsPage data={languageOptions} />
  );
}
