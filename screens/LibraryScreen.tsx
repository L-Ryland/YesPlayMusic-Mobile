import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "@/hooks/useRedux";
import { selectData } from "@/redux/slice/dataSlice";
import { StyleSheet } from "react-native";

// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import Login from "./LoginScreen";

export const LibraryScreen = () => {
  const data = useAppSelector(selectData);
  if (!data.loginMode) {
    return <Login />;
  }
  return (
    <SafeAreaView>
      <Text style={styles.title}> Library </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
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
