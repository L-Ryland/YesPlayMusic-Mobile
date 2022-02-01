import { SettingsData } from "react-native-settings-screen";
import { StyleSheet, Switch } from "react-native";

import { View, Text, Image } from "./Themed";
import currentSettings from '../currentSettings';
;

const renderUser = () => (
  <View style={styles.userContainer}>
    <Image
      source={require("../assets/images/favicon.png")}
      style={styles.userImage}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.userTitle}>Jan Söndermann</Text>
      <Text style={styles.userSubtitle}>jan+git@primlo.com</Text>
    </View>
  </View>
);
const {lang} = currentSettings;
const changeLanguage = () => {
  console.log(this)
};


export const settingOptions: SettingsData = [
  { type: "CUSTOM_VIEW", key: "hero", render: renderUser },
  {
    type: "SECTION",
    header: "Universal",
    rows: [
      {
        title: "Lanuages",
        showDisclosureIndicator: true,
        // onPress: ()=>switchSubSettings('Language'),
      },
      {
        title: "Appearance",
        showDisclosureIndicator: true,
        renderAccessory: () => (
          <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
            Auto
          </Text>
        ),
      },
      {
        title: "Music Preference",
        showDisclosureIndicator: true,
      },
      {
        title: "Stream Quality",
        showDisclosureIndicator: true,
      },
    ],
  },
  {
    type: "SECTION",
    header: "Lyrics",
    rows: [
      {
        title: "Show Lyrics Translation",
        renderAccessory: () => <Switch value onValueChange={(event) => {
          console.log(event);
          
        }} />,
      },
      {
        title: "Show Lyrics Background",
        showDisclosureIndicator: true,
      },
      {
        title: "Lyrics Font Size",
        showDisclosureIndicator: true,
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
        showDisclosureIndicator: true,
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
        },
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
const styles = StyleSheet.create({
  userContainer: {
    marginTop: 40,
    marginBottom: 50,
    paddingVertical: 20,
    justifyContent: "center",
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
