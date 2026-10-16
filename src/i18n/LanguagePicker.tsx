import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n, type Language } from "./I18nProvider";

const languages: { code: Language; label: string }[] = [
  { code: "az", label: "Azərbaycan dili" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export function LanguagePicker() {
  const { language, setLanguage, t } = useI18n();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel={t("Dil seç")}
      >
        <Ionicons name="globe-outline" size={17} color="#343A49" />
        <Text style={styles.code}>{language.toUpperCase()}</Text>
        <Ionicons name="chevron-down" size={13} color="#737A88" />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} accessibilityLabel={t("Bağla")} />
          <View style={styles.sheet}>
            <Text style={styles.title}>{t("Tətbiq dili")}</Text>
            {languages.map((item) => {
              const active = item.code === language;
              return (
                <Pressable
                  key={item.code}
                  onPress={() => { setLanguage(item.code); setVisible(false); }}
                  style={[styles.option, active && styles.optionActive]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
                  {active ? <Ionicons name="checkmark-circle" size={20} color="#FA3A4D" /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { minWidth: 60, height: 38, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 12, borderWidth: 1, borderColor: "#E8EAF0", backgroundColor: "#FFFFFF" },
  code: { color: "#343A49", fontSize: 11, fontWeight: "800" },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28, backgroundColor: "rgba(15,18,25,0.35)" },
  sheet: { width: "100%", maxWidth: 340, padding: 18, borderRadius: 20, backgroundColor: "#FFFFFF", elevation: 10 },
  title: { color: "#171A22", fontSize: 17, fontWeight: "800", marginBottom: 10 },
  option: { minHeight: 50, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 11 },
  optionActive: { backgroundColor: "#FFF1F2" },
  optionText: { color: "#343A49", fontSize: 14, fontWeight: "500" },
  optionTextActive: { color: "#FA3A4D", fontWeight: "700" },
});
