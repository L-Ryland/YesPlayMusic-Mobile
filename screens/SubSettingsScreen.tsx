import { StyleSheet } from 'react-native';
import * as React from 'react';

import {  View  } from '../components/Themed';
import { SubSettings } from '../components';
import { SettingsStackScreenProps } from "../types";



export function SubSettingsScreen (props: SettingsStackScreenProps<'SubSettingsScreen'>) {
  console.log(props);
  
  return (
    <View style={styles.container}>
      <SubSettings {...props}/>
    </View>
  );
}


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

});

