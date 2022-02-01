/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Library: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>| undefined;
};



export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SettingsStackParamList = {
  SettingsScreen: undefined,
  SubSettingsScreen: {requestSubSettings: String}| undefined,
  LanguageSettings: undefined, 
  AppearanceSettings: undefined, 
  MusicPreference: undefined,
  MusicQuality: undefined,
  ShowLyricsTranslation: undefined,
  ShowLyricsBackground: undefined, 
  LyricsFontSize: undefined,
  ConnectToLastfm: undefined,
  ShowAppleMusic: undefined
};

export type SettingsStackScreenProps<Screen extends keyof SettingsStackParamList> = NativeStackScreenProps<
  SettingsStackParamList, Screen
>;

// options used in settings screens

export interface OptionType {
  option: string|number, 
  name: string
}
