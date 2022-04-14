import type { SettingsData } from "react-native-settings-screen";
import { SettingsStackScreenProps } from "../types";
import {
  SettingsScreen as SettingsPage,
} from "./Themed";
import { apreanceProp, selectSettings, switchAppearance } from "../redux/slice/settingsSlice";
import { Text } from "./Themed";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import type { OptionType } from "../types";

export function AppearanceSettings(
  props: SettingsStackScreenProps<"LanguageSettings">
) {
  interface AppearnceOptionType extends OptionType {
    option: apreanceProp;
  }
  const {appearance} = useAppSelector(selectSettings)
  
  const dispatch = useAppDispatch();
  const options:AppearnceOptionType[] = [
    {option: 'auto', name: 'Auto'},
    {option: 'light', name: 'Bright'},
    {option: 'dark', name: 'Dark' },
  ];

  const appeareanceOptions: SettingsData = [
    {
      type: "SECTION",
      key: "lang",
      rows: options.map((option:AppearnceOptionType)=>{
        if (option.option === appearance) {
          return {
            title: option.name, 
            showDisclosureIndicator: false,
            renderAccessory: () => (
              <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
                Selected
              </Text>
            ),
            onPress: () =>{
              dispatch(switchAppearance(option.option));
            },
          }
        } 
        return {
          title: option.name, 
          showDisclosureIndicator: false,
          onPress: () =>{
            dispatch(switchAppearance(option.option));
          },
        }
      })
    }
  ];
  return (
    // <View>
    <SettingsPage data={appeareanceOptions} />
  );
}
