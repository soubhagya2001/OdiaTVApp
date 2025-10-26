import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import AppNavigator from "./src/Navigation/AppNavigator";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Activate keep awake for the entire app
        activateKeepAwake();

        setAppIsReady(true);
        await SplashScreen.hideAsync();
        console.log("Splash screen hidden and keep awake activated");
      } catch (error) {
        console.error("Error during app initialization:", error);
        setAppIsReady(true); // Proceed even if error occurs
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();

    // Fallback: Hide splash screen after 5 seconds if stuck
    const timeout = setTimeout(async () => {
      if (!appIsReady) {
        console.warn("Splash screen timeout triggered");
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      // Deactivate keep awake when app unmounts (optional)
      deactivateKeepAwake();
    };
  }, []);

  if (!appIsReady) {
    return null; // Keep splash screen until ready
  }

  return <AppNavigator />;
};

export default App;
