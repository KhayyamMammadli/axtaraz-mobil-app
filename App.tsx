import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { I18nProvider } from "./src/i18n/I18nProvider";

const WORDMARK_WIDTH = 176;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const markOpacity = useRef(new Animated.Value(0)).current;
  const markScale = useRef(new Animated.Value(0.88)).current;
  const wordmarkProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(markScale, {
          toValue: 1,
          speed: 16,
          bounciness: 3,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(wordmarkProgress, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]);

    animation.start();
    const hideTimer = setTimeout(() => setShowSplash(false), 2300);

    return () => {
      animation.stop();
      clearTimeout(hideTimer);
    };
  }, [markOpacity, markScale, wordmarkProgress]);

  const wordmarkWidth = wordmarkProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, WORDMARK_WIDTH],
  });

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.root}>
          <HomeScreen />
          {showSplash ? (
            <View style={styles.splashOverlay}>
              <Animated.Image
                source={require("./assets/images/axtar-app-icon-foreground.png")}
                style={[
                  styles.mark,
                  { opacity: markOpacity, transform: [{ scale: markScale }] },
                ]}
                resizeMode="contain"
                accessibilityLabel="axtar.az loqosu"
              />
              <View style={styles.wordmarkWindow}>
                <Animated.View style={{ width: wordmarkWidth, overflow: "hidden" }}>
                  <Text numberOfLines={1} style={styles.wordmark}>
                    axtar.az
                  </Text>
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
    backgroundColor: "#FFFFFF",
  },
  mark: {
    width: 124,
    height: 124,
    marginBottom: 12,
  },
  wordmarkWindow: {
    width: WORDMARK_WIDTH,
    height: 44,
    overflow: "hidden",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  wordmark: {
    width: WORDMARK_WIDTH,
    color: "#F33B43",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1.4,
    lineHeight: 40,
    textAlign: "left",
  },
});
