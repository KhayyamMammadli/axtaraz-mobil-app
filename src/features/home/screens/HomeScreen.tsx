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
import { businesses, feedTabs, listings, ownershipCover } from "../data/homeData";
import { colors } from "../../../theme/colors";

type FeedTabId = (typeof feedTabs)[number]["id"];
type BottomTabId = "home" | "favorites" | "login";

const promoImage = "https://axtar.az/img/hand.svg";

export function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeFeed, setActiveFeed] = useState<FeedTabId>("premium");
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
    const labels: Record<BottomTabId, string> = {
      home: "Ana səhifə",
      favorites: "Seçdiklərim",
      login: "Daxil ol",
    };
    if (tab !== "home") Alert.alert(labels[tab], "Bu bölmə növbəti mərhələdə əlavə olunacaq.");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.logo}>axtar.az</Text>
        <Pressable style={styles.menuButton} accessibilityLabel="Kataloq menyusu" onPress={() => Alert.alert("Kataloq", "Kateqoriyalar növbəti mərhələdə açılacaq.")}>
          <Ionicons name="menu" size={22} color={colors.ink} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerIcon} accessibilityLabel="Seçdiklərim" onPress={() => chooseBottomTab("favorites")}>
            <Ionicons name="heart-outline" size={21} color={colors.ink} />
          </Pressable>
          <Pressable style={styles.headerIcon} accessibilityLabel="Mesajlarım" onPress={() => Alert.alert("Mesajlarım", "Daxil olduqdan sonra mesajlarınızı görə bilərsiniz.")}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.ink} />
          </Pressable>
          <Pressable style={styles.loginButton} onPress={() => chooseBottomTab("login")}>
            <Text style={styles.loginText}>Daxil ol</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchArea}>
          <View style={styles.searchRow}>
            <Pressable style={styles.catalogButton} onPress={() => Alert.alert("Kataloq", "Kateqoriyalar növbəti mərhələdə açılacaq.")}>
              <Ionicons name="list-outline" size={17} color={colors.white} />
              <Text style={styles.catalogText}>Kataloq</Text>
            </Pressable>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Axtar..."
                placeholderTextColor={colors.subtle}
                returnKeyType="search"
                style={styles.searchInput}
                accessibilityLabel="Elan axtar"
              />
              {query.length > 0 ? (
                <Pressable onPress={() => setQuery("")} accessibilityLabel="Axtarışı təmizlə">
                  <Ionicons name="close-circle" size={18} color={colors.subtle} />
                </Pressable>
              ) : null}
            </View>
          </View>
          <View style={styles.searchActions}>
            <Pressable style={styles.regionButton} onPress={() => Alert.alert("Bölgələr", "Bölgə seçimi növbəti mərhələdə açılacaq.")}>
              <Ionicons name="location-outline" size={16} color={colors.muted} />
              <Text style={styles.regionText}>Bölgələr</Text>
              <Ionicons name="chevron-down" size={15} color={colors.ink} />
            </Pressable>
            <Pressable style={styles.newButton} onPress={() => Alert.alert("Yeni elan", "Elan yerləşdirmə növbəti mərhələdə əlavə olunacaq.")}>
              <Ionicons name="add" size={19} color={colors.brand} />
              <Text style={styles.newButtonText}>Yeni</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View style={styles.headingTitleRow}>
            <Text style={styles.crown}>👑</Text>
            <Text style={styles.sectionTitle}>Premium Bizneslər</Text>
          </View>
          <Pressable style={styles.seeAll} onPress={() => Alert.alert("Premium Bizneslər", "Bütün bizneslər növbəti mərhələdə açılacaq.")}>
            <Text style={styles.seeAllText}>Hamısına göstər</Text>
            <Ionicons name="arrow-up-outline" size={14} color={colors.brand} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.businessRow}>
          {businesses.map((business) => (
            <Pressable key={business.id} style={styles.businessCard} onPress={() => Alert.alert(business.name, "Biznes səhifəsi növbəti mərhələdə açılacaq.")}>
              <View style={styles.businessCover}>
                <Image source={{ uri: ownershipCover }} style={styles.businessCoverImage} resizeMode="cover" />
              </View>
              <View style={styles.businessActions}>
                <View style={styles.businessLogoWrap}>
                  <Image source={{ uri: ownershipCover }} style={styles.businessLogo} resizeMode="cover" />
                </View>
                <View style={styles.businessActionButtons}>
                  <View style={styles.starButton}><Ionicons name="star" size={16} color={colors.white} /></View>
                  <Pressable style={styles.followButton} onPress={() => Alert.alert("İzlə", "Biznesi izləmək üçün daxil olun.")}>
                    <Text style={styles.followText}>İzlə</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.businessInfo}>
                <Text style={styles.businessName} numberOfLines={1}>{business.name}</Text>
                <View style={styles.listingCount}>
                  <Ionicons name="grid-outline" size={13} color={colors.muted} />
                  <Text style={styles.businessCount}>{business.listings}</Text>
                </View>
              </View>
              <View style={styles.businessMeta}>
                <Ionicons name="location-outline" size={16} color={colors.muted} />
                <View style={styles.metaDivider} />
                <Ionicons name="car-outline" size={16} color={colors.muted} />
                <View style={styles.metaDivider} />
                <Ionicons name="card-outline" size={16} color={colors.muted} />
                <View style={styles.onlineDot} />
              </View>
            </Pressable>
          ))}
        </ScrollView>

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
                <Ionicons name={tab.icon} size={17} color={colors.gold} />
                <Text style={[styles.feedTabText, active && styles.feedTabTextActive]}>{tab.label === "Tövsiyə" ? "Tövsiyyə edilənlər" : tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.promoCard}>
          <View style={styles.promoStripes}>
            {Array.from({ length: 16 }, (_, index) => <View key={index} style={[styles.stripe, { left: index * 24 - 24 }]} />)}
          </View>
          <View style={styles.promoCopy}>
            <Text style={styles.promoTitle}>Axtar.az'da elan yerləşdir, satışların artsın.</Text>
            <Text style={styles.promoSubtitle}>Yeni alıcılara çatmaq üçün elanını paylaş.</Text>
            <Pressable style={styles.promoButton} onPress={() => Alert.alert("Yeni elan", "Elan yerləşdirmə növbəti mərhələdə əlavə olunacaq.")}>
              <Ionicons name="add" size={17} color={colors.white} />
              <Text style={styles.promoButtonText}>Yeni</Text>
            </Pressable>
          </View>
          <Image source={{ uri: promoImage }} style={styles.promoImage} resizeMode="contain" />
        </View>

        <View style={styles.listingHeading}>
          <View>
            <Text style={styles.sectionTitle}>Elanlar</Text>
            <Text style={styles.sectionSubtitle}>Premium elanlar</Text>
          </View>
          <Pressable style={styles.seeAll} onPress={() => Alert.alert("Elanlar", "Bütün elanlar növbəti mərhələdə açılacaq.")}>
            <Text style={styles.seeAllText}>Daha çoxuna bax</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.brand} />
          </Pressable>
        </View>

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

        <View style={styles.blogHeading}>
          <View>
            <Text style={styles.sectionTitle}>Bloglar</Text>
            <Text style={styles.sectionSubtitle}>Daha düzgün qərar verməyiniz üçün faydalı bloglar</Text>
          </View>
          <Pressable style={styles.seeAll} onPress={() => Alert.alert("Bloglar", "Bloglar növbəti mərhələdə açılacaq.")}>
            <Text style={styles.seeAllText}>Hamısına bax</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.brand} />
          </Pressable>
        </View>
        <Text style={styles.footerNote}>Azərbaycanın ən yeni, ən sərfəli və ən yenilikçi elan platforması.</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <BottomItem icon="home" label="Ana səhifə" active={activeBottomTab === "home"} onPress={() => chooseBottomTab("home")} />
        <BottomItem icon="heart-outline" label="Seçdiklərim" active={activeBottomTab === "favorites"} onPress={() => chooseBottomTab("favorites")} />
        <Pressable style={styles.addButton} onPress={() => Alert.alert("Yeni elan", "Elan yerləşdirmə növbəti mərhələdə əlavə olunacaq.")} accessibilityRole="button" accessibilityLabel="Yeni elan">
          <Ionicons name="add" size={26} color={colors.white} />
        </Pressable>
        <BottomItem icon="person-outline" label="Daxil ol" active={activeBottomTab === "login"} onPress={() => chooseBottomTab("login")} />
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
  header: { minHeight: 58, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  logo: { color: colors.brand, fontSize: 23, fontWeight: "900", letterSpacing: -1.1 },
  menuButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.soft, alignItems: "center", justifyContent: "center", marginLeft: 10 },
  headerActions: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 7 },
  headerIcon: { width: 30, height: 34, alignItems: "center", justifyContent: "center" },
  loginButton: { height: 34, paddingHorizontal: 13, borderRadius: 18, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" },
  loginText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 18 },
  searchArea: { paddingHorizontal: 15, paddingTop: 12, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  catalogButton: { height: 42, paddingHorizontal: 12, borderRadius: 22, backgroundColor: colors.brand, flexDirection: "row", alignItems: "center", gap: 6 },
  catalogText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  searchBox: { flex: 1, minWidth: 0, height: 42, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  searchInput: { flex: 1, minWidth: 0, color: colors.ink, fontSize: 13, paddingVertical: 0 },
  searchActions: { flexDirection: "row", gap: 8, marginTop: 8 },
  regionButton: { flex: 1, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 7 },
  regionText: { flex: 1, color: colors.ink, fontSize: 11, fontWeight: "500" },
  newButton: { height: 36, minWidth: 92, paddingHorizontal: 12, borderRadius: 19, borderWidth: 1.5, borderColor: colors.brand, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3 },
  newButtonText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  sectionHeading: { marginTop: 14, marginBottom: 10, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headingTitleRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  crown: { fontSize: 16 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: "800", letterSpacing: -0.35 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 3 },
  seeAllText: { color: colors.brand, fontSize: 10, fontWeight: "700" },
  businessRow: { paddingHorizontal: 15, gap: 12, paddingBottom: 2 },
  businessCard: { width: 286, overflow: "hidden", borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  businessCover: { height: 120, backgroundColor: "#080808", overflow: "hidden" },
  businessCoverImage: { width: "100%", height: "100%" },
  businessActions: { minHeight: 43, paddingLeft: 92, paddingRight: 9, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  businessLogoWrap: { position: "absolute", left: 13, top: -43, width: 82, height: 82, borderRadius: 42, borderWidth: 5, borderColor: colors.white, overflow: "hidden", backgroundColor: colors.white },
  businessLogo: { width: "100%", height: "100%" },
  businessActionButtons: { flexDirection: "row", alignItems: "center", gap: 8 },
  starButton: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.gold },
  followButton: { width: 77, height: 34, borderRadius: 10, borderWidth: 1, borderColor: "#FFD4DA", alignItems: "center", justifyContent: "center" },
  followText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  businessInfo: { minHeight: 78, paddingHorizontal: 12, paddingTop: 2 },
  businessName: { color: colors.ink, fontSize: 19, fontWeight: "800", letterSpacing: -0.4 },
  listingCount: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7, backgroundColor: colors.soft },
  businessCount: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  businessMeta: { height: 43, borderTopWidth: 1, borderTopColor: "#F0F1F3", flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 6 },
  metaDivider: { width: 1, height: 20, backgroundColor: colors.line },
  onlineDot: { width: 14, height: 14, borderRadius: 8, backgroundColor: colors.green, borderWidth: 4, borderColor: "#E5F8EE" },
  feedTabs: { marginTop: 15, paddingHorizontal: 15, gap: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  feedTab: { minHeight: 39, flexDirection: "row", alignItems: "center", gap: 5, borderBottomWidth: 2, borderBottomColor: "transparent", paddingHorizontal: 2 },
  feedTabActive: { borderBottomColor: colors.brand },
  feedTabText: { color: colors.ink, fontSize: 10, fontWeight: "500" },
  feedTabTextActive: { fontWeight: "700" },
  promoCard: { minHeight: 174, marginTop: 18, marginHorizontal: 15, borderRadius: 18, overflow: "hidden", backgroundColor: "#FFE2E5", justifyContent: "center" },
  promoStripes: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  stripe: { position: "absolute", top: -40, width: 1, height: 260, backgroundColor: "rgba(255,255,255,0.55)", transform: [{ rotate: "35deg" }] },
  promoCopy: { width: "74%", paddingLeft: 16, paddingVertical: 14, zIndex: 2 },
  promoTitle: { color: "#3A1017", fontSize: 20, lineHeight: 24, fontWeight: "600", letterSpacing: -0.5 },
  promoSubtitle: { color: colors.ink, fontSize: 10, lineHeight: 15, marginTop: 8 },
  promoButton: { alignSelf: "flex-start", height: 32, paddingHorizontal: 12, borderRadius: 18, flexDirection: "row", alignItems: "center", gap: 3, marginTop: 12, backgroundColor: colors.brand },
  promoButtonText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  promoImage: { position: "absolute", right: 3, bottom: 1, width: 104, height: 104, opacity: 0.78 },
  listingHeading: { marginTop: 20, marginBottom: 11, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionSubtitle: { color: colors.muted, marginTop: 3, fontSize: 10, maxWidth: 200 },
  listingGrid: { gap: 10, paddingHorizontal: 15 },
  listingRow: { flexDirection: "row", gap: 10 },
  emptyState: { alignItems: "center", justifyContent: "center", marginHorizontal: 15, paddingVertical: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.soft },
  emptyTitle: { marginTop: 8, color: colors.ink, fontWeight: "700", fontSize: 14 },
  emptyText: { marginTop: 3, color: colors.muted, fontSize: 11 },
  blogHeading: { marginTop: 25, marginBottom: 4, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footerNote: { paddingHorizontal: 24, paddingTop: 18, color: colors.muted, textAlign: "center", fontSize: 10, lineHeight: 15 },
  bottomBar: { minHeight: 60, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white },
  bottomItem: { flex: 1, height: 52, alignItems: "center", justifyContent: "center", gap: 4 },
  bottomLabel: { color: colors.muted, fontSize: 9, fontWeight: "600", maxWidth: "100%" },
  bottomLabelActive: { color: colors.brand, fontWeight: "700" },
  addButton: { width: 45, height: 45, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand, marginHorizontal: 5, marginTop: -17, borderWidth: 4, borderColor: colors.white },
});
