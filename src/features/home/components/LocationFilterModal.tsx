import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { useI18n } from "../../../i18n/I18nProvider";

const regions = [
  "Ağcabədi", "Ağdam", "Ağdaş", "Ağdərə", "Ağstafa", "Ağsu", "Astara",
  "Bakı", "Balakən", "Beyləqan", "Bərdə", "Biləsuvar", "Cəbrayıl",
  "Cəlilabad", "Daşkəsən", "Füzuli", "Gədəbəy", "Goranboy", "Göyçay",
  "Göygöl", "Hacıqabul", "Xaçmaz", "Xankəndi", "Xızı", "Xocalı",
  "Xocavənd", "İmişli", "İsmayıllı", "Kəlbəcər", "Kəngərli", "Kürdəmir",
  "Laçın", "Lerik", "Lənkəran", "Masallı", "Mingəçevir", "Naftalan",
  "Naxçıvan", "Neftçala", "Oğuz", "Ordubad", "Qəbələ", "Qax", "Qazax",
  "Qobustan", "Quba", "Qubadlı", "Qusar", "Saatlı", "Sabirabad", "Şabran",
  "Şahbuz", "Şəki", "Şəmkir", "Şərur", "Şirvan", "Siyəzən", "Sumqayıt",
  "Şuşa", "Tərtər", "Tovuz", "Ucar", "Yardımlı", "Yevlax", "Zaqatala",
  "Zəngilan", "Zərdab",
];

const metroStations = [
  "28 May", "Gənclik", "Nəriman Nərimanov", "Ulduz", "Koroğlu",
  "Qara Qarayev", "Neftçilər", "Xalqlar Dostluğu", "Əhmədli",
  "Həzi Aslanov", "Cəfər Cabbarlı", "Sahil", "İçərişəhər", "Nizami",
  "Elmlər Akademiyası", "İnşaatçılar", "20 Yanvar", "Memar Əcəmi",
  "Nəsimi", "Azadlıq prospekti", "Dərnəgül", "8 Noyabr",
  "Avtovağzal", "Xocəsən",
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[ıİ]/g, "i").replace(/ə/g, "e").toLocaleLowerCase();
}

type LocationFilterModalProps = {
  visible: boolean;
  selectedRegions: string[];
  selectedMetros: string[];
  onClose: () => void;
  onApply: (selectedRegions: string[], selectedMetros: string[]) => void;
};

export function LocationFilterModal({
  visible,
  selectedRegions,
  selectedMetros,
  onClose,
  onApply,
}: LocationFilterModalProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<"regions" | "metros">("regions");
  const [regionSearch, setRegionSearch] = useState("");
  const [metroSearch, setMetroSearch] = useState("");
  const [draftRegions, setDraftRegions] = useState<string[]>(selectedRegions);
  const [draftMetros, setDraftMetros] = useState<string[]>(selectedMetros);

  useEffect(() => {
    if (!visible) return;
    setView("regions");
    setRegionSearch(selectedRegions.length === 1 && selectedRegions[0] === "Bakı" ? "baki" : "");
    setMetroSearch("");
    setDraftRegions(selectedRegions);
    setDraftMetros(selectedMetros);
  }, [visible, selectedRegions, selectedMetros]);

  const visibleRegions = useMemo(() => {
    const query = normalize(regionSearch.trim());
    return regions.filter((region) => normalize(region).includes(query));
  }, [regionSearch]);

  const visibleMetros = useMemo(() => {
    const query = normalize(metroSearch.trim());
    return metroStations.filter((station) => normalize(station).includes(query));
  }, [metroSearch]);

  const toggleRegion = (region: string) => {
    const removingSelectedRegion = draftRegions.includes(region);
    setDraftRegions((current) => current.includes(region)
      ? current.filter((item) => item !== region)
      : [...current, region]);
    if (region === "Bakı" && removingSelectedRegion) setDraftMetros([]);
    if (region === "Bakı" && !removingSelectedRegion && !regionSearch.trim()) setRegionSearch("baki");
  };

  const toggleMetro = (station: string) => {
    setDraftMetros((current) => current.includes(station)
      ? current.filter((item) => item !== station)
      : [...current, station]);
  };

  const reset = () => {
    setDraftRegions([]);
    setDraftMetros([]);
    setRegionSearch("");
    setMetroSearch("");
    setView("regions");
  };

  const apply = () => {
    onApply(draftRegions, draftMetros);
  };

  const metroSummary = draftMetros.length === 0
    ? t("Fərqi yoxdur")
    : draftMetros.length === 1
      ? draftMetros[0]
      : draftMetros.length + " " + t("seçildi");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel={t("Bağla")} />
        <View style={[styles.card, { maxHeight: Dimensions.get("window").height * 0.86, paddingBottom: Math.max(insets.bottom, 14) }]}>
          {view === "regions" ? (
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color={colors.muted} />
                <TextInput
                  value={regionSearch}
                  onChangeText={setRegionSearch}
                  placeholder={t("Bölgə axtar...")}
                  placeholderTextColor={colors.subtle}
                  style={styles.searchInput}
                  returnKeyType="search"
                  autoCorrect={false}
                  accessibilityLabel={t("Bölgə axtar...")}
                />
                {regionSearch ? (
                  <Pressable onPress={() => setRegionSearch("")} hitSlop={8} accessibilityLabel={t("Təmizlə")}>
                    <Ionicons name="close-circle" size={22} color={colors.muted} />
                  </Pressable>
                ) : null}
              </View>

              <ScrollView
                style={styles.regionList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {visibleRegions.map((region) => {
                  const checked = draftRegions.includes(region);
                  return (
                    <Pressable
                      key={region}
                      onPress={() => toggleRegion(region)}
                      style={[styles.regionRow, checked && styles.regionRowChecked]}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked }}
                    >
                      <View style={[styles.regionCheck, checked && styles.regionCheckChecked]}>
                        {checked ? <Ionicons name="checkmark" size={20} color={colors.white} /> : null}
                      </View>
                      <Text style={styles.regionLabel}>{region}</Text>
                    </Pressable>
                  );
                })}
                {visibleRegions.length === 0 ? <Text style={styles.emptyText}>{t("Bölgə tapılmadı")}</Text> : null}

                {draftRegions.includes("Bakı") ? (
                  <Pressable
                    onPress={() => {
                      setMetroSearch("");
                      setView("metros");
                    }}
                    style={styles.metroRow}
                    accessibilityRole="button"
                  >
                    <Ionicons name="train-outline" size={22} color={colors.ink} />
                    <Text style={styles.metroLabel}>{t("Metro")}</Text>
                    <Text style={styles.metroSummary} numberOfLines={1}>{metroSummary}</Text>
                    <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                  </Pressable>
                ) : null}
              </ScrollView>
            </>
          ) : (
            <>
              <View style={styles.metroHeader}>
                <Pressable
                  onPress={() => {
                    setView("regions");
                    setMetroSearch("");
                  }}
                  style={styles.backButton}
                  accessibilityRole="button"
                  accessibilityLabel={t("Geri")}
                >
                  <Ionicons name="arrow-back" size={21} color={colors.ink} />
                  <Text style={styles.backLabel}>{t("Geri")}</Text>
                </Pressable>
              </View>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color={colors.muted} />
                <TextInput
                  value={metroSearch}
                  onChangeText={setMetroSearch}
                  placeholder={t("Metro axtar...")}
                  placeholderTextColor={colors.subtle}
                  style={styles.searchInput}
                  returnKeyType="search"
                  autoCorrect={false}
                  accessibilityLabel={t("Metro axtar...")}
                />
                {metroSearch ? (
                  <Pressable onPress={() => setMetroSearch("")} hitSlop={8} accessibilityLabel={t("Təmizlə")}>
                    <Ionicons name="close-circle" size={22} color={colors.muted} />
                  </Pressable>
                ) : null}
              </View>

              <ScrollView
                style={styles.metroList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {visibleMetros.map((station) => {
                  const checked = draftMetros.includes(station);
                  return (
                    <Pressable
                      key={station}
                      onPress={() => toggleMetro(station)}
                      style={styles.metroStationRow}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked }}
                    >
                      <View style={[styles.stationCheck, checked && styles.stationCheckChecked]}>
                        {checked ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
                      </View>
                      <Text style={styles.stationLabel}>{station}</Text>
                    </Pressable>
                  );
                })}
                {visibleMetros.length === 0 ? <Text style={styles.emptyText}>{t("Metro tapılmadı")}</Text> : null}
              </ScrollView>
            </>
          )}

          <View style={styles.actions}>
            <Pressable style={styles.resetButton} onPress={reset} accessibilityRole="button">
              <Text style={styles.resetText}>{t("Sıfırla")}</Text>
            </Pressable>
            <Pressable
              style={[styles.applyButton, draftRegions.length === 0 && styles.applyButtonIdle]}
              onPress={apply}
              accessibilityRole="button"
            >
              <Text style={[styles.applyText, draftRegions.length === 0 && styles.applyTextIdle]}>{t("Tətbiq et")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 12, paddingVertical: 18, backgroundColor: "rgba(20, 24, 34, 0.28)" },
  card: { width: "100%", maxWidth: 560, paddingHorizontal: 14, paddingTop: 22, borderRadius: 24, backgroundColor: colors.white, shadowColor: "#141824", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 18 },
  searchBox: { height: 46, marginBottom: 6, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, borderColor: "#E0E3E8", backgroundColor: colors.white },
  searchInput: { flex: 1, minWidth: 0, height: "100%", paddingVertical: 0, color: colors.ink, fontSize: 15 },
  regionList: { maxHeight: Dimensions.get("window").height * 0.52, flexGrow: 0 },
  regionRow: { minHeight: 58, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 18, borderRadius: 10 },
  regionRowChecked: { backgroundColor: "#F6F7F9" },
  regionCheck: { width: 30, height: 30, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#C4CAD3", borderRadius: 9, backgroundColor: colors.white },
  regionCheckChecked: { borderColor: colors.brand, backgroundColor: colors.brand },
  regionLabel: { color: colors.ink, fontSize: 20, fontWeight: "500" },
  metroRow: { minHeight: 62, marginTop: 5, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 10, borderTopWidth: 1, borderTopColor: colors.line },
  metroLabel: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: "500" },
  metroSummary: { maxWidth: "35%", color: colors.muted, fontSize: 15, fontWeight: "500" },
  metroHeader: { minHeight: 48, justifyContent: "center", marginBottom: 5 },
  backButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  backLabel: { color: colors.ink, fontSize: 18, fontWeight: "600" },
  metroList: { maxHeight: Dimensions.get("window").height * 0.52, flexGrow: 0 },
  metroStationRow: { minHeight: 38, paddingHorizontal: 4, flexDirection: "row", alignItems: "center", gap: 10 },
  stationCheck: { width: 17, height: 17, borderWidth: 1.5, borderColor: "#7B7F86", borderRadius: 2, alignItems: "center", justifyContent: "center" },
  stationCheckChecked: { borderColor: colors.brand, backgroundColor: colors.brand },
  stationLabel: { color: colors.ink, fontSize: 15 },
  emptyText: { paddingVertical: 18, color: colors.muted, fontSize: 14, textAlign: "center" },
  actions: { flexDirection: "row", gap: 20, marginTop: 14, paddingHorizontal: 1 },
  resetButton: { flex: 1, height: 42, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#D3D7DE", borderRadius: 11, backgroundColor: colors.white },
  resetText: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  applyButton: { flex: 1, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 11, backgroundColor: colors.brand },
  applyButtonIdle: { backgroundColor: "#FFE7EB" },
  applyText: { color: colors.white, fontSize: 15, fontWeight: "700" },
  applyTextIdle: { color: colors.brand, fontSize: 15, fontWeight: "700" },
});
