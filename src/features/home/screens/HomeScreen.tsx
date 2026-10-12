import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListingCard } from "../components/ListingCard";
import { businesses, categories, feedTabs, listings, ownershipCover } from "../data/homeData";
import { colors } from "../../../theme/colors";

type FeedTabId = (typeof feedTabs)[number]["id"];
type BottomTabId = "home" | "catalog" | "favorites" | "profile";

export function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeFeed, setActiveFeed] = useState<FeedTabId>("premium");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTabId>("home");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const visibleListings = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("az");
    if (!normalizedQuery) return listings;
    return listings.filter((item) => item.title.toLocaleLowerCase("az").includes(normalizedQuery));
  }, [query]);

  const toggleSaved = (id: string, saved: boolean) => {
    setSavedIds((current) => saved ? [...current, id] : current.filter((savedId) => savedId !== id));
  };

  const chooseBottomTab = (tab: BottomTabId) => {
    setActiveBottomTab(tab);
    if (tab !== "home") {
      const labels: Record<BottomTabId, string> = {
        home: "Ana səhifə",
        catalog: "Kataloq",
        favorites: "Seçilmişlər",
        profile: "Profil",
      };
      Alert.alert(labels[tab], "Bu bölmə növbəti mərhələdə əlavə olunacaq.");
      setActiveBottomTab("home");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Axtar.az ana səhifə" style={styles.brandWrap}>
          <Text style={styles.brandText}>axtar<Text style={styles.brandAccent}>.az</Text></Text>
        </Pressable>
        <View style={styles.topActions}>
          <Pressable style={styles.locationButton} onPress={() => Alert.alert("Bölgə seçimi", "Bakı seçilib.")}>
            <Ionicons name="location" size={15} color={colors.brand} />
            <Text style={styles.locationText}>Bakı</Text>
            <Ionicons name="chevron-down" size={13} color={colors.muted} />
          </Pressable>
          <Pressable style={styles.profileButton} accessibilityRole="button" accessibilityLabel="Profil">
            <Ionicons name="person-outline" size={19} color={colors.ink} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Nə axtarırsınız?"
              placeholderTextColor={colors.subtle}
              returnKeyType="search"
              style={styles.searchInput}
              accessibilityLabel="Elan axtar"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery("")} accessibilityLabel="Axtarışı təmizlə">
                <Ionicons name="close-circle" size={19} color={colors.subtle} />
              </Pressable>
            ) : null}
          </View>
          <Pressable style={styles.filterButton} accessibilityRole="button" accessibilityLabel="Filtrlər" onPress={() => Alert.alert("Filtrlər", "Elan filtrləri növbəti mərhələdə əlavə olunacaq.")}>
            <Ionicons name="options-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map((category) => {
            const selected = activeCategory === category.id;
            return (
              <Pressable
                key={category.id}
                onPress={() => setActiveCategory(selected ? null : category.id)}
                style={styles.categoryItem}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: selected ? colors.brand : category.tint }]}>
                  <Ionicons name={category.icon} size={21} color={selected ? colors.white : category.color} />
                </View>
                <Text style={[styles.categoryLabel, selected && styles.categoryLabelActive]} numberOfLines={1}>{category.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeading}>
          <View style={styles.headingTitleRow}>
            <Text style={styles.headingCrown}>♛</Text>
            <Text style={styles.sectionTitle}>Premium bizneslər</Text>
          </View>
          <Pressable style={styles.seeAll} onPress={() => Alert.alert("Premium bizneslər", "Bütün bizneslər növbəti mərhələdə açılacaq.")}>
            <Text style={styles.seeAllText}>Hamısı</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.brand} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.businessRow}>
          {businesses.map((business, index) => (
            <Pressable
              key={business.id}
              style={[styles.businessCard, index === 0 && styles.businessCardFirst]}
              onPress={() => Alert.alert(business.name, "Biznes profili növbəti mərhələdə açılacaq.")}
            >
              <View style={styles.businessImageWrap}>
                <Image source={{ uri: ownershipCover }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                <View style={styles.businessImageTint} />
                <Text style={styles.businessCoverInitial}>{business.name.slice(0, 1).toUpperCase()}</Text>
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={10} color="#7A4D00" />
                  <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                </View>
              </View>
              <View style={styles.businessInfo}>
                <View style={styles.businessNameLine}>
                  <Text style={styles.businessName} numberOfLines={1}>{business.name}</Text>
                  {index === 1 ? <Ionicons name="checkmark-circle" size={14} color={colors.green} /> : null}
                </View>
                <Text style={styles.businessCount}>{business.listings}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.sectionHeading, styles.listingHeading]}>
          <View>
            <Text style={styles.sectionTitle}>Elanlar</Text>
            <Text style={styles.sectionSubtitle}>Sizə uyğun təkliflər</Text>
          </View>
          <Pressable style={styles.seeAll} onPress={() => Alert.alert("Elanlar", "Bütün elanlar növbəti mərhələdə açılacaq.")}>
            <Text style={styles.seeAllText}>Hamısına bax</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.brand} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.feedTabs}>
          {feedTabs.map((tab) => {
            const active = activeFeed === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveFeed(tab.id)}
                style={[styles.feedTab, active && styles.feedTabActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Ionicons name={tab.icon} size={15} color={active ? colors.white : colors.muted} />
                <Text style={[styles.feedTabText, active && styles.feedTabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {visibleListings.length > 0 ? (
          <View style={styles.listingGrid}>
            {Array.from({ length: Math.ceil(visibleListings.length / 2) }, (_, rowIndex) => (
              <View key={`listing-row-${rowIndex}`} style={styles.listingRow}>
                {visibleListings.slice(rowIndex * 2, rowIndex * 2 + 2).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} onFavoriteChange={toggleSaved} />
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={28} color={colors.subtle} />
            <Text style={styles.emptyTitle}>Elan tapılmadı</Text>
            <Text style={styles.emptyText}>Axtarış sözünü dəyişib yenidən yoxlayın.</Text>
          </View>
        )}

        <View style={styles.promoCard}>
          <View style={styles.promoCopy}>
            <View style={styles.promoEyebrow}><Ionicons name="sparkles" size={12} color={colors.brand} /><Text style={styles.promoEyebrowText}>Axtar.az-da</Text></View>
            <Text style={styles.promoTitle}>Elan yerləşdir, satışların artsın.</Text>
            <Text style={styles.promoBody}>Yeni alıcılara çatmaq üçün indi elanını paylaş.</Text>
          </View>
          <Pressable style={styles.promoButton} onPress={() => Alert.alert("Yeni elan", "Elan yerləşdirmə növbəti mərhələdə əlavə olunacaq.")}>
            <Ionicons name="add" size={17} color={colors.white} />
            <Text style={styles.promoButtonText}>Yeni elan</Text>
          </Pressable>
          <View style={styles.promoOrnament} />
        </View>

        <Text style={styles.footerNote}>Azərbaycanın ən yeni, ən sərfəli və ən yenilikçi elan platforması.</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <BottomItem icon="home" label="Ana səhifə" active={activeBottomTab === "home"} onPress={() => chooseBottomTab("home")} />
        <BottomItem icon="grid-outline" label="Kataloq" active={activeBottomTab === "catalog"} onPress={() => chooseBottomTab("catalog")} />
        <Pressable style={styles.addButton} onPress={() => Alert.alert("Yeni elan", "Elan yerləşdirmə növbəti mərhələdə əlavə olunacaq.")} accessibilityRole="button" accessibilityLabel="Yeni elan">
          <Ionicons name="add" size={25} color={colors.white} />
        </Pressable>
        <BottomItem icon="heart-outline" label={`Seçilmişlər${savedIds.length ? ` (${savedIds.length})` : ""}`} active={activeBottomTab === "favorites"} onPress={() => chooseBottomTab("favorites")} />
        <BottomItem icon="person-outline" label="Profil" active={activeBottomTab === "profile"} onPress={() => chooseBottomTab("profile")} />
      </View>
    </SafeAreaView>
  );
}

type BottomItemProps = { icon: keyof typeof Ionicons.glyphMap; label: string; active: boolean; onPress: () => void };

function BottomItem({ icon, label, active, onPress }: BottomItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.bottomItem} accessibilityRole="tab" accessibilityState={{ selected: active }}>
      <Ionicons name={icon} size={20} color={active ? colors.brand : colors.muted} />
      <Text style={[styles.bottomLabel, active && styles.bottomLabelActive]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  topBar: { minHeight: 58, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F3F3F4" },
  brandWrap: { justifyContent: "center" },
  brandText: { color: colors.ink, fontSize: 25, fontWeight: "900", letterSpacing: -1.4 },
  brandAccent: { color: colors.brand },
  topActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  locationButton: { flexDirection: "row", alignItems: "center", gap: 5, height: 34, paddingHorizontal: 10, borderRadius: 18, backgroundColor: colors.soft },
  locationText: { color: colors.ink, fontSize: 12, fontWeight: "600" },
  profileButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 22 },
  searchRow: { flexDirection: "row", gap: 9, paddingHorizontal: 16, paddingTop: 15, paddingBottom: 8 },
  searchBox: { flex: 1, height: 48, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  searchInput: { flex: 1, minWidth: 0, color: colors.ink, fontSize: 14, paddingVertical: 0 },
  filterButton: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" },
  categoryRow: { paddingHorizontal: 16, paddingVertical: 13, gap: 17 },
  categoryItem: { width: 66, alignItems: "center", gap: 7 },
  categoryIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  categoryLabel: { width: 72, textAlign: "center", color: colors.muted, fontSize: 10, fontWeight: "600" },
  categoryLabelActive: { color: colors.brand, fontWeight: "700" },
  sectionHeading: { marginTop: 9, marginBottom: 12, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headingTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headingCrown: { color: "#D6981E", fontSize: 21, fontWeight: "800", marginTop: -2 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  sectionSubtitle: { color: colors.muted, marginTop: 3, fontSize: 11 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 4 },
  seeAllText: { color: colors.brand, fontSize: 11, fontWeight: "700" },
  businessRow: { paddingHorizontal: 16, gap: 10, paddingBottom: 2 },
  businessCard: { width: 152, borderWidth: 1, borderColor: colors.line, borderRadius: 15, overflow: "hidden", backgroundColor: colors.white },
  businessCardFirst: { borderColor: "#FFD2D7" },
  businessImageWrap: { height: 77, backgroundColor: "#22232A", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  businessImageTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(250,58,77,0.14)" },
  businessCoverInitial: { color: "rgba(255,255,255,0.23)", fontSize: 65, lineHeight: 75, fontWeight: "900", position: "absolute", right: 9, bottom: -12 },
  premiumBadge: { position: "absolute", left: 9, top: 8, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7, backgroundColor: colors.gold },
  premiumBadgeText: { color: "#704A00", fontSize: 8, fontWeight: "900", letterSpacing: 0.35 },
  businessInfo: { paddingHorizontal: 10, paddingTop: 9, paddingBottom: 10 },
  businessNameLine: { flexDirection: "row", alignItems: "center", gap: 4 },
  businessName: { flexShrink: 1, color: colors.ink, fontSize: 12, fontWeight: "700" },
  businessCount: { color: colors.muted, fontSize: 10, marginTop: 3 },
  listingHeading: { marginTop: 20, marginBottom: 12 },
  feedTabs: { paddingHorizontal: 16, gap: 7, paddingBottom: 13 },
  feedTab: { height: 34, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, borderRadius: 18, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line },
  feedTabActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  feedTabText: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  feedTabTextActive: { color: colors.white },
  listingGrid: { gap: 10, paddingHorizontal: 16 },
  listingRow: { flexDirection: "row", gap: 10 },
  emptyState: { alignItems: "center", justifyContent: "center", marginHorizontal: 16, paddingVertical: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.soft },
  emptyTitle: { marginTop: 8, color: colors.ink, fontWeight: "700", fontSize: 14 },
  emptyText: { marginTop: 3, color: colors.muted, fontSize: 11 },
  promoCard: { marginTop: 18, marginHorizontal: 16, minHeight: 136, padding: 16, borderRadius: 18, overflow: "hidden", backgroundColor: colors.paleBrand, borderWidth: 1, borderColor: "#FFE0E3", justifyContent: "center" },
  promoCopy: { maxWidth: "72%", zIndex: 1 },
  promoEyebrow: { flexDirection: "row", alignItems: "center", gap: 5 },
  promoEyebrowText: { color: colors.brand, fontSize: 10, fontWeight: "800" },
  promoTitle: { color: colors.ink, fontSize: 17, lineHeight: 21, fontWeight: "800", marginTop: 7, letterSpacing: -0.4 },
  promoBody: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  promoButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 3, marginTop: 11, paddingHorizontal: 11, height: 31, borderRadius: 9, backgroundColor: colors.brand },
  promoButtonText: { color: colors.white, fontSize: 10, fontWeight: "700" },
  promoOrnament: { position: "absolute", right: -23, top: 7, width: 130, height: 130, borderRadius: 65, borderWidth: 19, borderColor: "rgba(250,58,77,0.12)" },
  footerNote: { paddingHorizontal: 24, paddingTop: 17, color: colors.muted, textAlign: "center", fontSize: 10, lineHeight: 15 },
  bottomBar: { minHeight: 60, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white },
  bottomItem: { flex: 1, height: 52, alignItems: "center", justifyContent: "center", gap: 4 },
  bottomLabel: { color: colors.muted, fontSize: 9, fontWeight: "600", maxWidth: "100%" },
  bottomLabelActive: { color: colors.brand, fontWeight: "700" },
  addButton: { width: 45, height: 45, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand, marginHorizontal: 5, marginTop: -18, borderWidth: 4, borderColor: colors.white },
});
