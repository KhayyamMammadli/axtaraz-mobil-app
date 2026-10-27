import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { I18nProvider } from "./src/i18n/I18nProvider";

const SPLASH_DURATION = 2200;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const translateX = useRef(new Animated.Value(-Dimensions.get("window").width)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const revealAnimation = Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]);
    revealAnimation.start();

    const hideTimer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => {
      revealAnimation.stop();
      clearTimeout(hideTimer);
    };
  }, [opacity, translateX]);

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={showSplash ? "#FFF9F7" : "#FFFFFF"}
        />
        <View style={styles.root}>
          <HomeScreen />
          {showSplash ? (
            <View style={styles.splashOverlay}>
              <Animated.Text
                style={[
                  styles.wordmark,
                  {
                    opacity,
                    transform: [{ translateX }],
                  },
                ]}
                accessibilityLabel="Axtar.az"
              >
                Axtar.az
              </Animated.Text>
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
    backgroundColor: "#FFF9F7",
  },
  wordmark: {
    color: "#FA3A4D",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },
});
