import { useEffect, useRef, useState } from "react";
import { Animated, Image, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { I18nProvider } from "./src/i18n/I18nProvider";

const WORDMARK_WIDTH = 280;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const revealProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const revealAnimation = Animated.timing(revealProgress, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: false,
    });
    revealAnimation.start();

    const hideTimer = setTimeout(() => setShowSplash(false), 2800);
    return () => {
      revealAnimation.stop();
      clearTimeout(hideTimer);
    };
  }, [revealProgress]);

  const revealWidth = revealProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WORDMARK_WIDTH],
  });

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={showSplash ? "#F4F6FA" : "#FFFFFF"}
        />
        <View style={styles.root}>
          <HomeScreen />
          {showSplash ? (
            <View style={styles.splashOverlay}>
              <View style={styles.wordmarkWindow}>
                <Animated.View style={{ width: revealWidth, height: 58 }}>
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
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6FA",
  },
  wordmarkWindow: {
    width: WORDMARK_WIDTH,
    height: 58,
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  wordmark: {
    width: WORDMARK_WIDTH,
    height: 50,
  },
});
