import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import React from "react";
import * as Sentry from "sentry-expo";
import { QueryClientProvider } from "react-query";
import reactQueryClient from "@/utils/reactQueryClient";
import { settings } from "@/hydrate/settings";
import i18n from "i18n-js";
import { subscribeKey } from "valtio/utils";
import { useSnapshot } from "valtio";

function App(props) {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  console.log("app props", props);
  const { lang } = useSnapshot(settings);
  React.useEffect(() => {
    require("@/locale/");
    const unsubscribe = subscribeKey(
      settings,
      "lang",
      (locale) => (i18n.locale = locale)
    );
    return () => {
      unsubscribe();
    };
  }, [lang]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <QueryClientProvider client={reactQueryClient}>
        <SafeAreaProvider>
          <StatusBar />
          <Navigation colorScheme={colorScheme} />
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }
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
export default App;
// export default Sentry.wrap(connect(mapStateToProps)(App))
