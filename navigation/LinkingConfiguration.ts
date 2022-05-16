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
            screens: {
              Library: "library",
              Login: "login"
            },
          },
          Explore: {
            screens: {
              Explore: "explore",
            },
          },
          Settings: {
            screens: {
              MainSettings: "settings_screen",
              SubSettings: "sub_settings",
            },
          },

        },
      },
      Modal: "modal",
      NotFound: "*",
      Playlist: "playlist",
      Album: "album",
      Artist: "artist"
    },
  },
};

export default linking;
