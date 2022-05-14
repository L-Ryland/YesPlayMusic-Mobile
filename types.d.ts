/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {SettingsState} from "@/hydrate/settings";


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, SettingsStackParamList, LibraryStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Player: undefined;
  Tracker: undefined;
  Playlist: { itemProps: any; likedSongs: any };
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Library: undefined;
  Settings: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

type test = NativeStackScreenProps<RootTabParamList | SettingsStackParamList | LibraryStackParamList>["navigation"]["navigate"]
export type SettingsStackParamList = {
  SettingsScreen: undefined;
  SubSettingsScreen: { requestSubSettings: keyof SettingsState } | undefined;
};
export type SettingsStackScreenProps<Screen extends keyof SettingsStackParamList> = NativeStackScreenProps<SettingsStackParamList, Screen>

export type LibraryStackParamList = {
  Library: undefined;
  Login: undefined;
}
export type LibraryStackScreenProps<Screen extends keyof LibraryStackParamList> = NativeStackScreenProps<LibraryStackParamList, Screen>


// options used in settings screens

export interface OptionType<T extends keyof SettingsState = any> {
  option: SettingsState[T];
  name: string;
}
export type CoverProps = {
  coverImgUrl?: string;
  name?: String;
  id: Number;
  img1v1ID?: String;
  mark?: Number;
  img1v1Url?: String;
  picUrl?: String;
  privacy?: Number;
  type?: "album" | "playlist";
  imageUrl?;
  subText?;
  isPrivacy?;
  isExplicit?;
};
export type CoverRowProps = {
  items: CoverProps[];
  type: String;
  subText: String;
  subTextFontSize?: String;
  showPlayCount?: Boolean;
  columnNumber?: Number;
  gap?: String;
  playButtonSize?: Number;
  imageSize?: Number;
  rowNumber?: Number;
};
export interface PlaylistProps {
  id: Number;
  coverImgUrl: String;
  name: String;
  privacy: Number;
}
export interface PlaylistDetailProp {
  updateTime: Date;
  trackCount: Number;
  creator: {
    nickname: string;
  };
  description: string;
}
export interface ResponseFormat {
  code: number;
}
