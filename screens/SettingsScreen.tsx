import { StyleSheet, Switch } from 'react-native'
import styled from 'styled-components/native'
import type { TextStyle, ViewStyle, ImageProps } from 'react-native'
import * as React from 'react'

import { createSettingsDataFactory } from 'react-native-settings-template'

import { useThemeColor, View, Text } from '../components/Themed'
// import { MainSettings } from '../components';
import { SettingsStackScreenProps } from '../types'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { logOutThunk, selectData } from '@/redux/slice/dataSlice'
import { connect, ConnectedProps, MapStateToProps } from 'react-redux'
import { RootState } from '@/redux/store'

const MainSettings = createSettingsDataFactory()

function SettingsScreenView({
  user,
  navigation,
  route,
}: ReturnType<typeof mapStateToProps>) {
  const dispatch = useAppDispatch()
  const switchSubSettings = (param: string) => {
    navigation.navigate<'SubSettingsScreen'>('SubSettingsScreen', {
      requestSubSettings: param,
    })
  }
  const viewStyle: ViewStyle = {
    backgroundColor: useThemeColor({}, 'tintBackground'),
  }
  const textStyle: TextStyle = {
    color: useThemeColor({}, 'text'),
  }
  const universalKeys = {
    header: 'Universal',
    rows: [
      {
        title: 'Lanuages',
        showDisclosureIndicator: true,
        renderAccessory: () => (
          <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
            🇬🇧 English
          </Text>
        ),
        onPress: () => switchSubSettings('lang'),
      },
      {
        title: 'Appearance',
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings('appearance'),
      },
      {
        title: 'Music Preference',
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings('musicLanguage'),
      },
      {
        title: 'Stream Quality',
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings('musicQuality'),
      },
    ],
  }
  const lyricsKeys = {
    type: 'SECTION',
    header: 'Lyrics',
    rows: [
      {
        title: 'Show Lyrics Translation',
        renderAccessory: () => <Switch value onValueChange={() => {}} />,
      },
      {
        title: 'Show Lyrics Background',
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings('lyricsBackground'),
      },
      {
        title: 'Lyrics Font Size',
        showDisclosureIndicator: true,
        onPress: () => switchSubSettings('lyricFontSize'),
      },
    ],
  }
  const othersKeys = {
    type: 'SECTION',
    header: 'Others',
    rows: [
      {
        title: 'Connect to Last.fm',
        showDisclosureIndicator: true,
      },
      {
        title: 'Playlists From Apple Muisic',
        renderAccessory: () => <Switch value onValueChange={() => {}} />,
      },
    ],
  }
  const Universal = MainSettings.createSectionFactory(universalKeys)
  const Lyrics = MainSettings.createSectionFactory(lyricsKeys)
  const Others = MainSettings.createSectionFactory(othersKeys)
  const HeaderNull = MainSettings.createSectionFactory()
  return (
    <View style={styles.container}>
      {/* <MainSettings navigation={navigation} route={route} /> */}
      <MainSettings.SettingsScreen viewStyle={viewStyle} textStyle={textStyle}>
        <MainSettings.UserInfo
          source={
            user
              ? { uri: user.avatarUrl }
              : require('@/assets/images/favicon.png')
          }
          title={user.nickname ?? 'Please login to continue'}
          subTitle={user.signature}
        />
        <Universal.Section />
        <Lyrics.Section />
        <Others.Section />
        <HeaderNull.Section>
          <HeaderNull.Row
            title="Log Out"
            titleStyles={{ color: 'red', alignSelf: 'center' }}
            onPress={() => dispatch(logOutThunk)}
          />
        </HeaderNull.Section>
        <MainSettings.CustomView
          Element={() => <VersionText children="0.1.0" />}
        />
      </MainSettings.SettingsScreen>
    </View>
  )
}

const VersionText = styled(Text)`
  align-self: center;
  font-size: 18;
  color: #999;
  margin-bottom: 40;
  margin-top: -30;
`
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})

function mapStateToProps(
  state: RootState,
  { navigation, route }: SettingsStackScreenProps<'SettingsScreen'>,
) {
  const { user } = state.data;
  return {
    user, navigation, route
  } 
}

const connector = connect(mapStateToProps)(SettingsScreenView)

export const SettingsScreen = connector