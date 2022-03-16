import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { useAppSelector } from "@/hooks/useRedux";
import Navigation from "./navigation";
import { selectPlayer } from "./redux/slice/playerSlice";
import { Tracker } from "./components/Tracker";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const { playing } = useAppSelector(selectPlayer);
  console.log('root component playing status', playing);


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar />
        {/* {!playing?<Tracker/>:null} */}
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    );
  }
}
function useAppselector(): {} {
  throw new Error("Function not implemented.");
}

