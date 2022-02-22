import { useAppSelector } from "@/hooks/useRedux";
import { selectData } from "@/redux/slice/dataSlice";
import { StyleSheet } from "react-native";

// import EditScreenInfo from "../components/EditScreenInfo";
import { Text, ScrollView } from "../components/Themed";
import Login from "./LoginScreen";
// import ConnectBackend from "../components/ConnectBackend";

export const LibraryScreen = function () {
  const data = useAppSelector(selectData);
  if (!data.loginMode) {
    return <Login />;
  }
  return (
    <ScrollView>
      <Text style={styles.title}> Library </Text>
      {/* <ConnectBackend /> */}

    </ScrollView>
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
