import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View, ScrollView } from '../components/Themed';
import { MyReactNativeComponent } from "../components/ThemedNew";
import { RootTabScreenProps } from '../types';

export function HomeScreen (props: RootTabScreenProps<'Home'>) {
  console.log(props);
  
  return (
    <ScrollView style={styles.container} >
      <Text style={styles.title}> by Apple Music </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  title:  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    fontSize: 40,
    fontWeight: '700',
  }
});
