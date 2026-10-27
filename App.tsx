import { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { I18nProvider } from "./src/i18n/I18nProvider";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar
          barStyle={showSplash ? "light-content" : "dark-content"}
          backgroundColor={showSplash ? "#F83249" : "#ffffff"}
        />
        <View style={styles.root}>
          <HomeScreen />
          {showSplash ? (
            <View style={styles.splashOverlay}>
              <View style={styles.logoBadge}>
                <Image
                  source={require("./assets/images/axtar-logo-white.png")}
                  style={styles.splashLogo}
                  resizeMode="contain"
                  accessibilityLabel="Axtar.az loqosu"
                />
              </View>
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
    backgroundColor: "#F83249",
  },
  logoBadge: {
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  splashLogo: { width: 108, height: 108 },
  splashName: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
});
