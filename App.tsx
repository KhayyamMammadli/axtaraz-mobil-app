import { useEffect, useRef, useState } from "react";
import { Animated, Image, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { I18nProvider } from "./src/i18n/I18nProvider";

const WORDMARK_WIDTH = 280;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const revealAnimation = Animated.timing(reveal, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    });
    revealAnimation.start();

    const hideTimer = setTimeout(() => setShowSplash(false), 2600);
    return () => {
      revealAnimation.stop();
      clearTimeout(hideTimer);
    };
  }, [reveal]);

  const revealWidth = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WORDMARK_WIDTH],
  });

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar
          barStyle={showSplash ? "dark-content" : "dark-content"}
          backgroundColor={showSplash ? "#F4F6FA" : "#ffffff"}
        />
        <View style={styles.root}>
          <HomeScreen />
          {showSplash ? (
            <View style={styles.splashOverlay}>
              <View style={styles.wordmarkWindow}>
                <Animated.View style={{ width: revealWidth, height: 60 }}>
                  <Image
                    source={require("./assets/images/axtar-wordmark.png")}
                    style={styles.wordmark}
                    resizeMode="contain"
                    accessibilityLabel="axtar.az"
                  />
                </Animated.View>
              </View>
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
    backgroundColor: "#F4F6FA",
  },
  wordmarkWindow: {
    width: WORDMARK_WIDTH,
    height: 60,
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  wordmark: {
    width: WORDMARK_WIDTH,
    height: 54,
  },
});
