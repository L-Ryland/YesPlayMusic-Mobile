import { StyleSheet, Switch } from "react-native";
import type { SettingsData } from "react-native-settings-screen";
import { Text, View, SettingsScreen as SettingsPage, Image} from './Themed';

import {  SettingsStackScreenProps } from "../types";
import { selectSettings } from "../redux/slice/settingsSlice";




export function MainSettings ({navigation, route}:SettingsStackScreenProps<'SettingsScreen'>) {
  
  // Navigate to Sub-Settings Menu
  const switchSubSettings = (param:String) => {
    navigation.navigate('SubSettingsScreen', {requestSubSettings: param});
  };
  console.log(route.params);

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
          onPress: ()=>switchSubSettings('Language'),
        },
        {
          title: "Appearance",
          showDisclosureIndicator: true,
          onPress: ()=>switchSubSettings('Appearance'),
        },
        {
          title: "Music Preference",
          showDisclosureIndicator: true,
          onPress: ()=>switchSubSettings('MusicPreference'),
        },
        {
          title: "Stream Quality",
          showDisclosureIndicator: true,
          onPress: ()=>switchSubSettings('StreamQuality'),
        },
      ],
    },
    {
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
          onPress: ()=>switchSubSettings('LyricsBg'),

        },
        {
          title: "Lyrics Font Size",
          showDisclosureIndicator: true,
          onPress: ()=>switchSubSettings('LyricsFsize'),
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
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
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
      <SettingsPage data={settingsOptions}/>
      // <Text>Test</Text>
   ); 
}
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