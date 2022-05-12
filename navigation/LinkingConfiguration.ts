/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  // prefixes: [Linking.makeUrl('/home')],
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              Home: "home",
            },
          },
          Library: {
            initialRouteName: "LibraryScreen",
            screens: {
              LibraryScreen: "LibraryScreen",
              LoginScreen: "LoginScreen"
            },
          },
          Explore: {
            screens: {
              Explore: "explore",
            },
          },
          Settings: {
            initialRouteName: "SettingsScreen",
            screens: {
              SettingsScreen: "settings_screen",
              SubSettingsScreen: "sub_settings",
            },
          },

        },
      },
      Modal: "modal",
      NotFound: "*",
      Playlist: "playlist"
    },
  },
};

export default linking;
