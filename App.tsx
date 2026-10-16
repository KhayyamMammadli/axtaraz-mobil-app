import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/features/home/screens/HomeScreen";
import { I18nProvider } from "./src/i18n/I18nProvider";

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <HomeScreen />
      </I18nProvider>
    </SafeAreaProvider>
  );
}
