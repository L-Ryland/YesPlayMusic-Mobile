import { StyleSheet, Switch } from "react-native";
import styled from "styled-components/native";
import type { TextStyle, ViewStyle, ImageProps } from "react-native";
import * as React from "react";

import { createSettingsDataFactory } from "react-native-settings-template";

import { useThemeColor, View, Text } from "@/components";
import {SettingsStackScreenProps} from "@/types";
import { removeCookie } from "@/utils/auth";
import { useMutation } from "react-query";
import { logout } from "@/api";
import { userData, initialUserData } from "@/hydrate/data";
import {settings, SettingsState} from "@/hydrate/settings"
import { useSnapshot } from "valtio";
import useUser from "@/hooks/useUser";

const MainSettings = createSettingsDataFactory();

export function SettingsScreen({
  navigation,
}: SettingsStackScreenProps<"SettingsScreen">) {
  const handleLogOut = useMutation(logout, {
    onSuccess: () => {
      Object.assign(userData, initialUserData);
      removeCookie("MUSIC_U");
      removeCookie("__csrf");
    },
  });
  const switchSubSettings = (param: keyof SettingsState) => {
    navigation.navigate("SubSettingsScreen", {
      requestSubSettings: param,
    });
    navigation.navigate("Settings")
  };
  const tintBackgroundColor = useThemeColor({}, "tintBackground");
  const textColor = useThemeColor({}, "text");
  const viewStyle: ViewStyle = {
    backgroundColor: tintBackgroundColor,
  };
  const textStyle: TextStyle = {
    color: textColor,
  };
  const userProfile = useUser().data?.profile;
  console.log("[SettingsScreen] [userProfile]", useUser())
  const universalKeys = {
    header: "Universal",
    rows: [
      {
        title: "Languages",
        showDisclosureIndicator: true,
        renderAccessory: () => (
          <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
            🇬🇧 English
          </Text>
        ),
        onPress: () => switchSubSettings("lang"),
      },
      {
        title: "Appearance",
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings("appearance"),
      },
      {
        title: "Music Preference",
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings("musicLanguage"),
      },
      {
        title: "Stream Quality",
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings("musicQuality"),
      },
    ],
  };
  const lyricsKeys = {
    type: "SECTION",
    header: "Lyrics",
    rows: [
      {
        title: "Show Lyrics Translation",
        renderAccessory: () => <Switch value onValueChange={() => {}} />,
      },
      {
        title: "Show Lyrics Background",
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings("lyricsBackground"),
      },
      {
        title: "Lyrics Font Size",
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings("lyricFontSize"),
      },
    ],
  };
  const othersKeys = {
    type: "SECTION",
    header: "Others",
    rows: [
      {
        title: "Connect to Last.fm",
        showDisclosureIndicator: true,
      },
      {
        title: "Playlists From Apple Music",
        renderAccessory: () => <Switch value onValueChange={() => {}} />,
      },
    ],
  };
  const Universal = MainSettings.createSectionFactory(universalKeys);
  const Lyrics = MainSettings.createSectionFactory(lyricsKeys);
  const Others = MainSettings.createSectionFactory(othersKeys);
  const HeaderNull = MainSettings.createSectionFactory();
  return (
    <View style={styles.container}>
      {/* <MainSettings navigation={navigation} route={route} /> */}
      <MainSettings.SettingsScreen viewStyle={viewStyle} textStyle={textStyle}>
        {userData.loginMode == "account" && userProfile ? (
          <MainSettings.UserInfo
            source={{ uri: userProfile.avatarUrl }}
            title={userProfile.nickname}
            subTitle={userProfile.signature}
          />
        ) : (
          <MainSettings.UserInfo
            source={require("@/assets/images/favicon.png")}
            title="Please Login To Continue"
            subTitle=""
            onPress={() => navigation.navigate("Library")}
          />
        )}
        <Universal.Section />
        <Lyrics.Section />
        <Others.Section />
        <HeaderNull.Section>
          <HeaderNull.Row
            title="Log Out"
            titleStyles={{ color: "red", alignSelf: "center" }}
            onPress={() => handleLogOut.mutate()}
          />
        </HeaderNull.Section>
        <MainSettings.CustomView
          Element={() => <VersionText>.0.1.0</VersionText>}
        />
      </MainSettings.SettingsScreen>
    </View>
  );
}

const VersionText = styled(Text)`
  align-self: center;
  font-size: 18;
  color: #999;
  margin-bottom: 40;
  margin-top: -30;
`;
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
