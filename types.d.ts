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
    interface RootParamList extends RootStackParamList{}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Player: {track} | undefined;
  Playlist: { id?: number; likedSongs?: unknown };
  Album: {id?: number; likedSongs?: unknown };
  Artist: {id?: number; likedSongs?: unknown };
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
  MainSettings:  undefined;
  SubSettings: { requestSubSettings: keyof SettingsState } | undefined;
  Library: undefined
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
