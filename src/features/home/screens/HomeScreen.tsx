import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ListingCard } from "../components/ListingCard";
import { CatalogModal } from "../components/CatalogModal";
import { MenuModal } from "../components/MenuModal";
import { BusinessProfileScreen } from "./BusinessProfileScreen";
import { AuthScreen } from "./AuthScreen";
import { ListingDetailScreen } from "./ListingDetailScreen";
import { businesses, feedTabs, listings, ownershipCover } from "../data/homeData";
import { colors } from "../../../theme/colors";
import { useI18n } from "../../../i18n/I18nProvider";
import { LanguagePicker } from "../../../i18n/LanguagePicker";

type FeedTabId = (typeof feedTabs)[number]["id"];
type BottomTabId = "home" | "favorites" | "messages" | "profile";

const promoImage = "https://axtar.az/img/hand.svg";

const homeBlogs = [
  { id: "post-3", category: "Elektronika", title: "Test", excerpt: "test", date: "16.08.2026", listings: "143 uyğun elan", image: "https://storage.axtar.az/uploads/posts/min/2026/08/16/6a81c8c682955-8c473ea6eaaec3447d728283aea346a7.png" },
  { id: "post-7", category: "Bloq kateqoriyası", title: "test blog 7", excerpt: "SEO", date: "10.06.2026", listings: "259 uyğun elan", image: "https://storage.axtar.az/uploads/posts/min/2026/06/10/6a292ee80429a-a242d5f7bd988b2edbdfeb0b1931e8dd.png" },
  { id: "post-6", category: "Bloq kateqoriyası", title: "blog test 6", excerpt: "test", date: "10.06.2026", listings: "222 uyğun elan", image: "https://storage.axtar.az/uploads/posts/min/2026/06/10/6a29275c18122-c2d40615727189a2200b6088299fd16b.png" },
];

export function HomeScreen() {
  const { t, language } = useI18n();
  const [query, setQuery] = useState("");
  const [catalogVisible, setCatalogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<(typeof businesses)[number] | null>(null);
  const [selectedListing, setSelectedListing] = useState<(typeof listings)[number] | null>(null);
  const [authVisible, setAuthVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFeed, setActiveFeed] = useState<FeedTabId>("premium");
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTabId>("home");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const businessCardWidth = (Dimensions.get("window").width - 42) / 2;
  const bottomBarTranslateY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const lastScrollY = useRef(0);
  const bottomBarHidden = useRef(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = Math.max(0, event.nativeEvent.contentOffset.y);
    const delta = currentY - lastScrollY.current;
    const shouldShow = currentY < 12 || delta < -4;
    const shouldHide = currentY > 24 && delta > 4;

    const animateChrome = (hidden: boolean) => {
      if (bottomBarHidden.current === hidden) return;
      bottomBarHidden.current = hidden;
      Animated.timing(bottomBarTranslateY, {
        toValue: hidden ? 66 + insets.bottom : 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    };

    if (shouldShow) animateChrome(false);
    else if (shouldHide) animateChrome(true);

    lastScrollY.current = currentY;
  };

  const visibleListings = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language);
    if (!normalizedQuery) return listings;
    return listings.filter((item) => t(item.title).toLocaleLowerCase(language).includes(normalizedQuery));
  }, [query, language, t]);

  const toggleSaved = (id: string, saved: boolean) => {
    setSavedIds((current) => saved ? [...current, id] : current.filter((savedId) => savedId !== id));
  };

  const chooseBottomTab = (tab: BottomTabId) => {
    setActiveBottomTab(tab);
    if (tab === "profile") {
      setAuthVisible(true);
      return;
    }
    const labels: Record<BottomTabId, string> = {
      home: "Ana səhifə",
      favorites: "Seçilmişlər",
      messages: "Mesajlarım",
      profile: "Profil",
    };
    if (tab !== "home") Alert.alert(t(labels[tab]), t("Bu bölmə növbəti mərhələdə əlavə olunacaq."));
  };

  if (selectedListing) {
    return <ListingDetailScreen listing={selectedListing} onBack={() => setSelectedListing(null)} onSelectListing={setSelectedListing} />;
  }

  if (selectedBusiness) {
    return <BusinessProfileScreen businessName={selectedBusiness.name} onBack={() => setSelectedBusiness(null)} />;
  }

  if (authVisible) {
    return <AuthScreen onHome={() => { setAuthVisible(false); setActiveBottomTab("home"); }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        stickyHeaderIndices={[3]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.header}>
        <Pressable style={styles.catalogButton} accessibilityLabel={t("Kataloq")} onPress={() => setCatalogVisible(true)}>
          <Ionicons name="list-outline" size={21} color={colors.white} />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder={t("Axtar...")} placeholderTextColor={colors.subtle} returnKeyType="search" style={styles.searchInput} accessibilityLabel={t("Elan axtar")} />
          <Pressable style={styles.locationButton} onPress={() => Alert.alert(t("Bölgələr"), t("Bölgə seçimi növbəti mərhələdə açılacaq."))} accessibilityLabel={t("Bölgə seç")}>
            <Ionicons name="location-outline" size={19} color={colors.muted} />
          </Pressable>
        </View>
        <LanguagePicker />
        <Pressable style={styles.menuButton} accessibilityLabel={t("Menyu")} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={23} color={colors.ink} />
        </Pressable>
      </View>
        {selectedCategory ? (
          <View style={styles.selectedCategoryRow}>
            <Ionicons name="checkmark-circle" size={17} color={colors.brand} />
            <Text style={styles.selectedCategoryText} numberOfLines={1}>{selectedCategory.split(" / ").map((category) => t(category)).join(" / ")}</Text>
            <Pressable
              onPress={() => setSelectedCategory("")}
              hitSlop={8}
              accessibilityLabel={t("Kateqoriyanı sil")}
            >
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ) : null}
        <View style={styles.sectionHeading}>
          <View style={styles.headingTitleRow}>
            <Text style={styles.crown}>👑</Text>
            <Text style={styles.sectionTitle}>{t("Premium Bizneslər")}</Text>
          </View>
          <Pressable style={styles.seeAll} onPress={() => Alert.alert(t("Premium Bizneslər"), t("Bütün bizneslər növbəti mərhələdə açılacaq."))}>
            <Ionicons name="arrow-up" size={20} color={colors.brand} />
          </Pressable>
        </View>

        <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.businessRow}>
          {businesses.map((business) => (
            <Pressable key={business.id} style={[styles.businessCard, { width: businessCardWidth }]} onPress={() => setSelectedBusiness(business)}>
              <View style={styles.businessCover}>
                <Image source={{ uri: ownershipCover }} style={styles.businessCoverImage} resizeMode="cover" />
              </View>
              <View style={styles.businessActions}>
                <View style={styles.businessLogoWrap}>
                  <Image source={{ uri: ownershipCover }} style={styles.businessLogo} resizeMode="cover" />
                </View>
                <View style={styles.businessActionButtons}>
                  <View style={styles.starButton}><Ionicons name="star" size={16} color={colors.white} /></View>
                  <Pressable style={styles.followButton} onPress={() => Alert.alert(t("İzlə"), t("Biznesi izləmək üçün daxil olun."))}>
                    <Text style={styles.followText}>{t("İzlə")}</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.businessInfo}>
                <Text style={styles.businessName} numberOfLines={1}>{business.name}</Text>
                <View style={styles.listingCount}>
                  <Ionicons name="grid-outline" size={13} color={colors.muted} />
                  <Text style={styles.businessCount}>{t(business.listings)}</Text>
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

        <View style={styles.stickyFeedHeader}>
        <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.feedTabs}>
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
                <Text style={[styles.feedTabText, active && styles.feedTabTextActive]}>{t(tab.label)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        </View>

        {visibleListings.length > 0 ? (
          <View style={styles.listingGrid}>
            {Array.from({ length: Math.ceil(visibleListings.length / 2) }, (_, rowIndex) => (
              <View key={`listing-row-${rowIndex}`} style={styles.listingRow}>
                {visibleListings.slice(rowIndex * 2, rowIndex * 2 + 2).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} onFavoriteChange={toggleSaved} onPress={() => setSelectedListing(listing)} />
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={28} color={colors.subtle} />
            <Text style={styles.emptyTitle}>{t("Elan tapılmadı")}</Text>
            <Text style={styles.emptyText}>{t("Axtarış sözünü dəyişib yenidən yoxlayın.")}</Text>
          </View>
        )}

        <View style={styles.promoCard}>
          <View style={styles.promoStripes}>
            {Array.from({ length: 16 }, (_, index) => <View key={index} style={[styles.stripe, { left: index * 24 - 24 }]} />)}
          </View>
          <View style={styles.promoCopy}>
            <Text style={styles.promoTitle}>{t("Axtar.az'da elan yerləşdir, satışların artsın.")}</Text>
            <Text style={styles.promoSubtitle}>{t("Yeni alıcılara çatmaq üçün elanını paylaş.")}</Text>
            <Pressable style={styles.promoButton} onPress={() => Alert.alert(t("Yeni elan"), t("Elan yerləşdirmə növbəti mərhələdə əlavə olunacaq."))}>
              <Ionicons name="add" size={17} color={colors.white} />
              <Text style={styles.promoButtonText}>{t("Yeni")}</Text>
            </Pressable>
          </View>
          <Image source={{ uri: promoImage }} style={styles.promoImage} resizeMode="contain" />
        </View>

        <View style={styles.blogHeading}>
          <View>
            <Text style={styles.sectionTitle}>{t("Bloglar")}</Text>
            <Text style={styles.sectionSubtitle}>{t("Daha düzgün qərar verməyiniz üçün faydalı bloglar")}</Text>
          </View>
          <Pressable style={styles.seeAll} onPress={() => Alert.alert(t("Bloglar"), t("Bloglar növbəti mərhələdə açılacaq."))}>
            <Text style={styles.seeAllText}>{t("Hamısına bax")}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.brand} />
          </Pressable>
        </View>
        <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.blogRow}>
          {homeBlogs.map((blog) => (
            <Pressable key={blog.id} style={styles.blogCard} onPress={() => Alert.alert(t(blog.title), t("Blog səhifəsi növbəti mərhələdə açılacaq."))}>
              <Image source={{ uri: blog.image }} style={styles.blogImage} resizeMode="cover" />
              <View style={styles.blogBody}>
                <Text style={styles.blogCategory}>{t(blog.category)}</Text>
                <Text style={styles.blogTitle} numberOfLines={1}>{t(blog.title)}</Text>
                <Text style={styles.blogExcerpt} numberOfLines={1}>{t(blog.excerpt)}</Text>
                <View style={styles.blogMeta}>
                  <Text style={styles.blogDate}>{blog.date}</Text>
                  <Text style={styles.blogListings}>{t(blog.listings)}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={styles.footerNote}>{t("Azərbaycanın ən yeni, ən sərfəli və ən yenilikçi elan platforması.")}</Text>
      </ScrollView>
      <CatalogModal
        visible={catalogVisible}
        onClose={() => setCatalogVisible(false)}
        onSelect={(categoryPath) => {
          setSelectedCategory(categoryPath);
          setCatalogVisible(false);
        }}
      />
      <MenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <Animated.View style={[styles.bottomBar, { height: 66 + insets.bottom, paddingBottom: insets.bottom, transform: [{ translateY: bottomBarTranslateY }] }]}>
        <BottomItem icon="home" label="Ana səhifə" active={activeBottomTab === "home"} onPress={() => chooseBottomTab("home")} />
        <BottomItem icon="heart" label="Seçilmişlər" active={activeBottomTab === "favorites"} onPress={() => chooseBottomTab("favorites")} />
        <Pressable style={styles.addButton} onPress={() => Alert.alert(t("Yeni elan"), t("Elan yerləşdirmə növbəti mərhələdə əlavə olunacaq."))} accessibilityRole="button" accessibilityLabel={t("Yeni elan")}>
          <Ionicons name="add" size={27} color={colors.brand} />
        </Pressable>
        <BottomItem icon="chatbubble-ellipses" label="Mesajlarım" active={activeBottomTab === "messages"} onPress={() => chooseBottomTab("messages")} />
        <BottomItem icon="person-circle-outline" label="Profil" active={activeBottomTab === "profile"} onPress={() => chooseBottomTab("profile")} />
      </Animated.View>
    </SafeAreaView>
  );
}

type BottomItemProps = { icon: keyof typeof Ionicons.glyphMap; label: string; active: boolean; onPress: () => void };

function BottomItem({ icon, label, active, onPress }: BottomItemProps) {
  const { t } = useI18n();
  return (
    <Pressable onPress={onPress} style={styles.bottomItem} accessibilityRole="tab" accessibilityState={{ selected: active }}>
      <Ionicons name={icon} size={20} color={active ? colors.brand : colors.muted} />
      <Text style={[styles.bottomLabel, active && styles.bottomLabelActive]} numberOfLines={1}>{t(label)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },

  header: { height: 66, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FFF9F7" },

  menuButton: { width: 34, height: 38, alignItems: "center", justifyContent: "center" },
  locationButton: { width: 40, height: 34, alignItems: "center", justifyContent: "center", borderLeftWidth: 1, borderLeftColor: colors.line },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120, backgroundColor: "#FFF9F7" },
  searchArea: { paddingHorizontal: 15, paddingTop: 12, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  catalogButton: { width: 42, height: 42, borderRadius: 22, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" },
  searchBox: { flex: 1, minWidth: 0, height: 42, flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 12, borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFF9F7" },
  searchInput: { flex: 1, minWidth: 0, color: colors.ink, fontSize: 14, paddingVertical: 0 },
  selectedCategoryRow: { marginHorizontal: 15, marginTop: 8, paddingHorizontal: 11, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, backgroundColor: "#FFF0F2" },
  selectedCategoryText: { flex: 1, color: colors.ink, fontSize: 11, fontWeight: "600" },
  sectionHeading: { marginTop: 14, marginBottom: 10, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headingTitleRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  crown: { fontSize: 16 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: "800", letterSpacing: -0.35 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 3 },
  seeAllText: { color: colors.brand, fontSize: 10, fontWeight: "700" },
  businessRow: { paddingHorizontal: 15, gap: 12, paddingBottom: 2 },
  businessCard: { overflow: "hidden", borderRadius: 14, backgroundColor: "#FFF9F7" },
  businessCover: { height: 102, backgroundColor: "#080808", overflow: "hidden", borderRadius: 13 },
  businessCoverImage: { width: "100%", height: "100%" },
  businessActions: { minHeight: 39, paddingLeft: 45, paddingRight: 3, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  businessLogoWrap: { position: "absolute", left: 4, top: -34, width: 58, height: 58, borderRadius: 30, borderWidth: 3, borderColor: colors.white, overflow: "hidden", backgroundColor: colors.white },
  businessLogo: { width: "100%", height: "100%" },
  businessActionButtons: { flexDirection: "row", alignItems: "center", gap: 5 },
  starButton: { width: 29, height: 29, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: colors.gold },
  followButton: { width: 50, height: 29, borderRadius: 10, borderWidth: 1, borderColor: "#FFD4DA", alignItems: "center", justifyContent: "center" },
  followText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  businessInfo: { minHeight: 59, paddingHorizontal: 7, paddingTop: 0 },
  businessName: { color: colors.ink, fontSize: 15, fontWeight: "800", letterSpacing: -0.4 },
  listingCount: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6, paddingHorizontal: 2, paddingVertical: 2 },
  businessCount: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  businessMeta: { height: 34, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 6 },
  metaDivider: { width: 0 },
  onlineDot: { width: 14, height: 14, borderRadius: 8, backgroundColor: colors.green, borderWidth: 4, borderColor: "#E5F8EE" },
  stickyFeedHeader: { backgroundColor: "#FFF9F7", zIndex: 10, elevation: 10 },
  feedTabs: { marginTop: 12, paddingHorizontal: 15, gap: 16, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: "#FFF9F7" },
  feedTab: { minHeight: 43, flexDirection: "row", alignItems: "center", gap: 5, borderBottomWidth: 2, borderBottomColor: "transparent", paddingHorizontal: 2 },
  feedTabActive: { borderBottomColor: colors.brand },
  feedTabText: { color: colors.ink, fontSize: 11, fontWeight: "500" },
  feedTabTextActive: { fontWeight: "700" },
  promoCard: { minHeight: 174, marginTop: 25, marginHorizontal: 15, borderRadius: 18, overflow: "hidden", backgroundColor: "#FFE2E5", justifyContent: "center" },
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
  blogRow: { paddingHorizontal: 15, paddingTop: 10, gap: 10 },
  blogCard: { width: 252, overflow: "hidden", borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  blogImage: { width: "100%", height: 124, backgroundColor: colors.soft },
  blogBody: { padding: 11 },
  blogCategory: { color: colors.brand, fontSize: 9, fontWeight: "700" },
  blogTitle: { color: colors.ink, fontSize: 14, fontWeight: "800", marginTop: 5 },
  blogExcerpt: { color: colors.muted, fontSize: 11, marginTop: 3 },
  blogMeta: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  blogDate: { color: colors.muted, fontSize: 9 },
  blogListings: { color: colors.brand, fontSize: 9, fontWeight: "700" },
  footerNote: { paddingHorizontal: 24, paddingTop: 18, color: colors.muted, textAlign: "center", fontSize: 10, lineHeight: 15 },
  bottomBar: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white },
  bottomItem: { flex: 1, height: 56, alignItems: "center", justifyContent: "center", gap: 4 },
  bottomLabel: { color: colors.muted, fontSize: 8, fontWeight: "600", maxWidth: "100%" },
  bottomLabelActive: { color: colors.brand, fontWeight: "700" },
  addButton: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF9F7", marginHorizontal: 5, marginTop: -20, borderWidth: 2, borderColor: "#E64B5D" },
});
