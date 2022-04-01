import { StyleSheet, Switch } from "react-native";
import type { SettingsData } from "react-native-settings-screen";
import { Text, View, SettingsScreen as SettingsPage, Image } from './Themed';

import { SettingsStackScreenProps } from "../types";
import { selectSettings } from "../redux/slice/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logOutThunk, selectData, updateData } from "@/redux/slice/dataSlice";
import { isLooseLoggedIn } from "@/utils/auth";




export function MainSettings({ navigation, route }: SettingsStackScreenProps<'SettingsScreen'>) {

  // Navigate to Sub-Settings Menu
  const switchSubSettings = (param: String) => {
    navigation.navigate('SubSettingsScreen', { requestSubSettings: param });
  };
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(selectData)

  console.log(route.params);
  const handleLogout = () => {
    dispatch(logOutThunk())
  }
  const renderUser = () => {
    console.log("is loose logged in? ", isLooseLoggedIn());
    if (isLooseLoggedIn() && user ) {
      return (
        <View style={styles.userContainer}>
          <Image
            source={{ uri: user.avatarUrl}}
            style={styles.userImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.userTitle}>{user.nickname}</Text>
            <Text style={styles.userSubtitle}>{user.signature}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.userContainer}>
        <Image
          source={require("../assets/images/favicon.png")}
          style={styles.userImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.userTitle} onPress={()=>navigation.navigate('Library')}>Please Login To Continue</Text>
        </View>
      </View>
    )
  }
  const settingsOptions: SettingsData = [
    { type: "CUSTOM_VIEW", key: "hero", render: renderUser },
    {
      type: "SECTION",
      header: "Universal",
      rows: [
        {
          title: "Lanuages",
          showDisclosureIndicator: true,
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              🇬🇧 English
            </Text>
          ),
          onPress: () => switchSubSettings('lang'),
        },
        {
          title: "Appearance",
          showDisclosureIndicator: true,
          onPress: () => switchSubSettings('appearance'),
        },
        {
          title: "Music Preference",
          showDisclosureIndicator: true,
          onPress: () => switchSubSettings('musicLanguage'),
        },
        {
          title: "Stream Quality",
          showDisclosureIndicator: true,
          onPress: () => switchSubSettings('musicQuality'),
        },
      ],
    },
    {
      type: "SECTION",
      header: "Lyrics",
      rows: [
        {
          title: "Show Lyrics Translation",
          renderAccessory: () => <Switch value onValueChange={() => { }} />,
        },
        {
          title: "Show Lyrics Background",
          showDisclosureIndicator: true,
          onPress: () => switchSubSettings('lyricsBackground'),

        },
        {
          title: "Lyrics Font Size",
          showDisclosureIndicator: true,
          onPress: () => switchSubSettings('lyricFontSize'),
        },
      ],
    },
    {
      type: "SECTION",
      header: "Others",
      rows: [
        {
          title: "Connect to Last.fm",
          showDisclosureIndicator: true,
        },
        {
          title: "Playlists From Apple Muisic",
          renderAccessory: () => <Switch value onValueChange={() => { }} />,
        },
      ],
    },
    {
      type: "SECTION",
      rows: [
        {
          title: "Log Out",
          showDisclosureIndicator: true,
          titleStyle: {
            color: "red",
            alignSelf: "center"
          },
          onPress: handleLogout,
        },
      ],
    },
    {
      type: "CUSTOM_VIEW",
      render: () => (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 18,
            color: "#999",
            marginBottom: 40,
            marginTop: -30,
          }}
        >
          v0.1.0
        </Text>
      ),
    },
  ];
  return (
    // <View>
    <SettingsPage data={settingsOptions} />
    // <Text>Test</Text>
  );
}



const styles = StyleSheet.create({
  userContainer: {
    marginTop: 40,
    marginBottom: 50,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    flexDirection: "row",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "black",
    marginHorizontal: 20,
  },
  userTitle: {
    color: "black",
    fontSize: 24,
  },
  userSubtitle: {
    color: "#999",
    fontSize: 14,
  },
});