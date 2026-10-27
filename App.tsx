import { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { I18nProvider } from "./src/i18n/I18nProvider";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.root}>
          <HomeScreen />
          {showSplash ? (
            <View style={styles.splashOverlay}>
              <Image
                source={require("./assets/images/axtar-app-icon-foreground.png")}
                style={styles.splashLogo}
                resizeMode="contain"
                accessibilityLabel="Axtar.az loqosu"
              />
              <Text style={styles.splashName}>axtar.az</Text>
            </View>
          ) : null}
        </View>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  splashLogo: { width: 144, height: 144 },
  splashName: {
    marginTop: 8,
    color: "#F83249",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
});
