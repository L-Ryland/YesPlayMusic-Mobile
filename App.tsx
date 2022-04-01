import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import React from "react";
import { connect } from "react-redux";

function App(props) {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  console.log("app props", props);
  
  React.useEffect(() => {

    require('@/locale/')
    return () => {}
  }, [props.lang])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar />
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    );
  }
}
function mapStateToProps(state, ownProps) {
  const { lang } = state.settings;
  return { lang, ...ownProps }
}

export default connect(mapStateToProps)(App)

