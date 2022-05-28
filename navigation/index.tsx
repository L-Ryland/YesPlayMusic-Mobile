/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Modal } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import {
  HomeScreen,
  LibraryScreen,
  LoginScreen,
  ExploreScreen,
  SettingsScreen,
  PlayerScreen,
  NotFoundScreen,
  SubSettingsScreen,
  ModalScreen,
  PlaylistScreen,
  ArtistScreen,
  AlbumScreen,
} from "@/screens";
import {
  RootStackParamList,
  RootTabParamList,
  SettingsStackParamList,
  RootTabScreenProps,
} from "@/types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <RootStack.Group screenOptions={{ presentation: "modal" }}>
        <RootStack.Screen name="Modal" component={ModalScreen} />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ presentation: "modal" }}>
        <RootStack.Screen name="Player" component={PlayerScreen} />
        <RootStack.Screen name="Playlist" component={PlaylistScreen} />
        <RootStack.Screen name="Album" component={AlbumScreen} />
        <RootStack.Screen name="Artist" component={ArtistScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "Home Demo",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="Library"
        component={LibraryNavigator}
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          headerShown: true,
        }}
      />
    </BottomTab.Navigator>
  );
}

function SettingsNavigator() {
  const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

  return (
    <SettingsStack.Navigator initialRouteName="MainSettings">
      <SettingsStack.Group>
        <SettingsStack.Screen
          name="MainSettings"
          component={SettingsScreen}
          options={{
            headerShown: false,
          }}
        />
        <SettingsStack.Screen
          name="SubSettings"
          component={SubSettingsScreen}
        />
      </SettingsStack.Group>
    </SettingsStack.Navigator>
  );
}

function LibraryNavigator() {
  const LibraryStack = createNativeStackNavigator();
  return (
    <LibraryStack.Navigator initialRouteName="LibraryScreen">
      <LibraryStack.Group>
        <LibraryStack.Screen
          name="Library"
          component={LibraryScreen}
          options={{ headerShown: false }}
        />
        <LibraryStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </LibraryStack.Group>
    </LibraryStack.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
