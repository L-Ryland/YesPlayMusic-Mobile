import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View, ScrollView } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export function HomeScreen (props: RootTabScreenProps<'Home'>) {
  console.log(props);
  
  return (
    <View >
      <Text style={styles.title}> by Apple Music </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title:  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    fontSize: 40,
    fontWeight: '700',
  }
});
