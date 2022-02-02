import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export function ExploreScreen () {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Explore</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/Explore.tsx" /> */}
      <Text style={styles.title}>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title:  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    fontSize: 40,
    fontWeight: '700',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
