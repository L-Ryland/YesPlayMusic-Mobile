import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import React from "react";
import { connect } from "react-redux";
import * as Sentry from "sentry-expo";

export default function App(props) {
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


Sentry.init({
  dsn: "https://d04343e5480f44b9ae13e1fcce091e45@o1201332.ingest.sentry.io/6326030",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});


// Access any @sentry/react-native exports via:
// Sentry.Native.*

// Access any @sentry/browser exports via:
// Sentry.Browser.*

// Sentry.Native.wrap
// export default connect(mapStateToProps)(App)
// export default Sentry.wrap(connect(mapStateToProps)(App))