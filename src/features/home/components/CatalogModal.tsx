import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { catalogCategories, type CatalogCategory } from "../data/catalogData";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (categoryPath: string) => void;
};

export function CatalogModal({ visible, onClose, onSelect }: Props) {
  const [path, setPath] = useState<CatalogCategory[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (visible) {
      setPath([]);
      setSearch("");
    }
  }, [visible]);

  const currentCategories = path.length
    ? path[path.length - 1].children ?? []
    : catalogCategories;
  const visibleCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("az");
    return query
      ? currentCategories.filter((category) =>
          category.name.toLocaleLowerCase("az").includes(query),
        )
      : currentCategories;
  }, [currentCategories, search]);

  const goBack = () => {
    if (path.length) {
      setPath((current) => current.slice(0, -1));
      setSearch("");
    } else {
      onClose();
    }
  };

  const openCategory = (category: CatalogCategory) => {
    if (category.children?.length) {
      setPath((current) => [...current, category]);
      setSearch("");
      return;
    }
    onSelect([...path, category].map((item) => item.name).join(" / "));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={goBack}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable
            onPress={goBack}
            style={styles.headerButton}
            accessibilityRole="button"
            accessibilityLabel={path.length ? "Əvvəlki kateqoriyaya qayıt" : "Kataloqu bağla"}
          >
            <Ionicons
              name={path.length ? "arrow-back" : "close"}
              size={23}
              color="#252632"
            />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerEyebrow}>Axtar.az</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {path.length ? path[path.length - 1].name : "Kataloq"}
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={styles.doneButton}
            accessibilityRole="button"
            accessibilityLabel="Bağla"
          >
            <Text style={styles.doneText}>Bağla</Text>
          </Pressable>
        </View>

        {path.length > 0 ? (
          <View style={styles.breadcrumb}>
            <Text style={styles.breadcrumbText} numberOfLines={1}>
              {["Bütün kateqoriyalar", ...path.map((item) => item.name)].join("  ›  ")}
            </Text>
          </View>
        ) : (
          <View style={styles.intro}>
            <Text style={styles.introTitle}>Kateqoriya seçin</Text>
            <Text style={styles.introSubtitle}>
              Elanlara rahat baxmaq üçün bölməni seçin
            </Text>
          </View>
        )}

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color="#8B91A1" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Kateqoriya axtar"
            placeholderTextColor="#969BA8"
            returnKeyType="search"
            style={styles.searchInput}
            accessibilityLabel="Kateqoriya axtar"
          />
          {search.length > 0 ? (
            <Pressable
              onPress={() => setSearch("")}
              hitSlop={10}
              accessibilityLabel="Axtarışı təmizlə"
            >
              <Ionicons name="close-circle" size={19} color="#A5A9B4" />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {visibleCategories.map((category) => {
            const hasChildren = Boolean(category.children?.length);
            return (
              <Pressable
                key={category.id}
                onPress={() => openCategory(category)}
                style={({ pressed }) => [
                  styles.categoryRow,
                  pressed && styles.categoryRowPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={category.name}
                accessibilityHint={
                  hasChildren
                    ? "Alt kateqoriyaları açır"
                    : "Bu kateqoriyanı seçir"
                }
              >
                <View style={styles.iconWrap}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
                {hasChildren ? (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#9BA4B5"
                  />
                ) : (
                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color="#C3C7D0"
                  />
                )}
              </Pressable>
            );
          })}
          {visibleCategories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={28} color="#A1A6B2" />
              <Text style={styles.emptyTitle}>Kateqoriya tapılmadı</Text>
              <Text style={styles.emptyText}>Axtarış sözünü dəyişin.</Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    minHeight: 62,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECEEF2",
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F6F8",
  },
  headerTitleWrap: { flex: 1, minWidth: 0, marginLeft: 12 },
  headerEyebrow: {
    color: "#9298A5",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  headerTitle: {
    marginTop: 2,
    color: "#20232D",
    fontSize: 17,
    fontWeight: "700",
  },
  doneButton: {
    minWidth: 48,
    paddingVertical: 10,
    alignItems: "flex-end",
    marginLeft: 8,
  },
  doneText: { color: "#F43D56", fontSize: 13, fontWeight: "700" },
  intro: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 13 },
  introTitle: { color: "#20232D", fontSize: 20, fontWeight: "800" },
  introSubtitle: { color: "#858B98", fontSize: 12, marginTop: 5 },
  breadcrumb: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 9 },
  breadcrumbText: { color: "#838A98", fontSize: 11, fontWeight: "500" },
  searchBox: {
    height: 46,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 9,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#E6E8ED",
    borderRadius: 14,
    backgroundColor: "#FAFAFB",
  },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 0, color: "#252832", fontSize: 14 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 14, paddingBottom: 20 },
  categoryRow: {
    minHeight: 68,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 15,
  },
  categoryRowPressed: { backgroundColor: "#F4F6FC" },
  iconWrap: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: { fontSize: 28 },
  categoryName: { flex: 1, color: "#252832", fontSize: 15, fontWeight: "500" },
  emptyState: { alignItems: "center", paddingTop: 48 },
  emptyTitle: { marginTop: 10, color: "#333744", fontSize: 15, fontWeight: "700" },
  emptyText: { marginTop: 5, color: "#858B98", fontSize: 12 },
});
