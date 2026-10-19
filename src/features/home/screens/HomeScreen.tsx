import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
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
import { LocationFilterModal } from "../components/LocationFilterModal";
import { CatalogModal } from "../components/CatalogModal";
import { MenuModal } from "../components/MenuModal";
import { BusinessProfileScreen } from "./BusinessProfileScreen";
import { AuthScreen } from "./AuthScreen";
import { AccountScreen } from "./AccountScreen";
import { ListingDetailScreen } from "./ListingDetailScreen";
import { BlogDetailScreen, type BlogPost } from "./BlogDetailScreen";
import { MessagesScreen } from "./MessagesScreen";
import { CreateListingScreen } from "./CreateListingScreen";
import { BusinessLandingScreen } from "./BusinessLandingScreen";
import { feedTabs, ownershipCover, type Business, type Listing } from "../data/homeData";
import { fetchOwnerships } from "../services/ownershipsApi";
import { fetchProducts } from "../services/productsApi";
import { fetchPosts } from "../services/postsApi";
import { colors } from "../../../theme/colors";
import { useI18n } from "../../../i18n/I18nProvider";

type FeedTabId = (typeof feedTabs)[number]["id"];
type BottomTabId = "home" | "favorites" | "messages" | "profile";

const promoImage = "https://axtar.az/img/hand.svg";

function formatBlogDate(value: string | undefined, language: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const locale = language === "ru" ? "ru-RU" : language === "en" ? "en-GB" : "az-AZ";
  return date.toLocaleDateString(locale);
}



export function HomeScreen() {
  const { t, language } = useI18n();
  const [query, setQuery] = useState("");
  const [catalogVisible, setCatalogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedMetros, setSelectedMetros] = useState<string[]>([]);
  const [createMenuVisible, setCreateMenuVisible] = useState(false);
  const [businessLandingVisible, setBusinessLandingVisible] = useState(false);
  const [listingTypeVisible, setListingTypeVisible] = useState(false);
  const [listingCreationVisible, setListingCreationVisible] = useState(false);
  const [listingIntent, setListingIntent] = useState<"offer" | "search" | "lost">("offer");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFeed, setActiveFeed] = useState<FeedTabId>("premium");
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTabId>("home");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [productListings, setProductListings] = useState<Listing[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [productsLastPage, setProductsLastPage] = useState(1);
  const [businessList, setBusinessList] = useState<Business[]>([]);
  const [businessesLoading, setBusinessesLoading] = useState(true);
  const [businessesError, setBusinessesError] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(false);
  const businessCardWidth = (Dimensions.get("window").width - 42) / 2;
  const bottomBarTranslateY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const lastScrollY = useRef(0);
  const bottomBarHidden = useRef(false);

  const loadProducts = useCallback(async (page = 1) => {
    setProductsLoading(true);
    try {
      const result = await fetchProducts(page);
      setProductListings((current) => {
        if (page === 1) return result.listings;
        const knownIds = new Set(current.map((item) => item.id));
        return [...current, ...result.listings.filter((item) => !knownIds.has(item.id))];
      });
      setProductsPage(result.currentPage);
      setProductsLastPage(result.lastPage);
      setProductsError(false);
    } catch {
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts(1);
  }, [loadProducts]);

  const loadBusinesses = useCallback(async () => {
    setBusinessesLoading(true);
    try {
      const result = await fetchOwnerships(1);
      setBusinessList(result.businesses);
      setBusinessesError(false);
    } catch {
      setBusinessesError(true);
    } finally {
      setBusinessesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  const loadBlogs = useCallback(async () => {
    setBlogsLoading(true);
    try {
      const result = await fetchPosts(1);
      setBlogPosts(result.posts);
      setBlogsError(false);
    } catch {
      setBlogsError(true);
    } finally {
      setBlogsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBlogs();
  }, [loadBlogs]);

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
    if (!normalizedQuery) return productListings;
    return productListings.filter((item) => t(item.title).toLocaleLowerCase(language).includes(normalizedQuery));
  }, [productListings, query, language, t]);

  const toggleSaved = (id: string, saved: boolean) => {
    setSavedIds((current) => saved ? [...current, id] : current.filter((savedId) => savedId !== id));
  };

  const chooseBottomTab = (tab: BottomTabId) => {
    setActiveBottomTab(tab);
    if (tab === "messages") {
      setMessagesVisible(true);
      return;
    }
    if (tab === "profile") {
      if (!isAuthenticated) setAuthVisible(true);
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

  if (businessLandingVisible) {
    return <BusinessLandingScreen onBack={() => setBusinessLandingVisible(false)} />;
  }

  if (listingCreationVisible) {
    return (
      <CreateListingScreen
        intent={listingIntent}
        onBack={() => {
          setListingCreationVisible(false);
          setTimeout(() => setListingTypeVisible(true), 300);
        }}
      />
    );
  }

  if (selectedBlog) {
    return (
      <BlogDetailScreen
        blog={selectedBlog}
        images={selectedBlog.images?.length ? selectedBlog.images : [selectedBlog.image]}
        onBack={() => setSelectedBlog(null)}
      />
    );
  }

  if (selectedListing) {
    return <ListingDetailScreen listing={selectedListing} relatedListings={productListings} onBack={() => setSelectedListing(null)} onSelectListing={setSelectedListing} />;
  }

  if (selectedBusiness) {
    return <BusinessProfileScreen business={selectedBusiness} onBack={() => setSelectedBusiness(null)} />;
  }

  if (messagesVisible) {
    return (
      <MessagesScreen
        onBack={() => { setMessagesVisible(false); setActiveBottomTab(isAuthenticated ? "profile" : "home"); }}
        onOpenListing={(listing) => { setMessagesVisible(false); setSelectedListing(listing); }}
      />
    );
  }

  if (authVisible) {
    return (
      <AuthScreen
        onHome={() => { setAuthVisible(false); setActiveBottomTab("home"); }}
        onLoginSuccess={() => { setIsAuthenticated(true); setAuthVisible(false); setActiveBottomTab("profile"); }}
      />
    );
  }

  if (isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <AccountScreen
          onHome={() => { setIsAuthenticated(false); setActiveBottomTab("home"); }}
          onLogout={() => { setIsAuthenticated(false); setAuthVisible(true); }}
          onSelectListing={setSelectedListing}
          onSelectBusiness={setSelectedBusiness}
          onMessages={() => { setActiveBottomTab("messages"); setMessagesVisible(true); }}
        />
      </SafeAreaView>
    );
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
          <Pressable style={styles.locationButton} onPress={() => setLocationVisible(true)} accessibilityRole="button" accessibilityLabel={t("Bölgə seç")}>
            <Ionicons name="location-outline" size={17} color={colors.muted} />
            <Text style={styles.locationButtonText} numberOfLines={1}>
              {selectedRegions.length === 0 ? t("Bölgələr") : selectedRegions.length === 1 ? selectedRegions[0] : selectedRegions.length + " " + t("seçildi")}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.muted} />
          </Pressable>
        </View>
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
          {businessesLoading && businessList.length === 0 ? (
            <View style={styles.businessLoadState}><ActivityIndicator color={colors.brand} /></View>
          ) : businessesError && businessList.length === 0 ? (
            <Pressable onPress={() => void loadBusinesses()} style={styles.businessLoadState}>
              <Text style={styles.businessLoadText}>{t("Biznesləri yükləmək alınmadı")} · {t("Yenidən yoxla")}</Text>
            </Pressable>
          ) : businessList.map((business) => (
            <Pressable key={business.id} style={[styles.businessCard, { width: businessCardWidth }]} onPress={() => setSelectedBusiness(business)}>
              <View style={styles.businessCover}>
                <Image source={{ uri: business.image || ownershipCover }} style={styles.businessCoverImage} resizeMode="cover" />
              </View>
              <View style={styles.businessActions}>
                <View style={styles.businessLogoWrap}>
                  <Image source={{ uri: business.image || ownershipCover }} style={styles.businessLogo} resizeMode="cover" />
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
                {business.slogan ? <Text style={styles.businessSlogan} numberOfLines={1}>{business.slogan}</Text> : null}
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

        {productsLoading && productListings.length === 0 ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color={colors.brand} />
            <Text style={styles.emptyText}>{t("Elanlar yüklənir...")}</Text>
          </View>
        ) : productsError && productListings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline-outline" size={28} color={colors.subtle} />
            <Text style={styles.emptyTitle}>{t("Elanları yükləmək mümkün olmadı")}</Text>
            <Pressable onPress={() => void loadProducts(1)} style={styles.retryButton}>
              <Text style={styles.retryText}>{t("Yenidən yoxla")}</Text>
            </Pressable>
          </View>
        ) : visibleListings.length > 0 ? (
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

        {productsPage < productsLastPage ? (
          <Pressable
            disabled={productsLoading}
            onPress={() => void loadProducts(productsPage + 1)}
            style={styles.loadMoreButton}
          >
            {productsLoading ? <ActivityIndicator size="small" color={colors.brand} /> : null}
            <Text style={styles.loadMoreText}>{t(productsLoading ? "Elanlar yüklənir..." : "Daha çox elan")}</Text>
          </Pressable>
        ) : null}

        <View style={styles.promoCard}>
          <View style={styles.promoStripes}>
            {Array.from({ length: 16 }, (_, index) => <View key={index} style={[styles.stripe, { left: index * 24 - 24 }]} />)}
          </View>
          <View style={styles.promoCopy}>
            <Text style={styles.promoTitle}>{t("Axtar.az'da elan yerləşdir, satışların artsın.")}</Text>
            <Text style={styles.promoSubtitle}>{t("Yeni alıcılara çatmaq üçün elanını paylaş.")}</Text>
            <Pressable style={styles.promoButton} onPress={() => setListingTypeVisible(true)}>
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
          <Pressable style={styles.seeAll} onPress={() => void loadBlogs()} accessibilityRole="button">
            <Text style={styles.seeAllText}>{t("Yenilə")}</Text>
            <Ionicons name="refresh" size={14} color={colors.brand} />
          </Pressable>
        </View>
        <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.blogRow}>
          {blogsLoading && blogPosts.length === 0 ? (
            <View style={styles.blogLoadState}><ActivityIndicator color={colors.brand} /></View>
          ) : blogsError && blogPosts.length === 0 ? (
            <Pressable onPress={() => void loadBlogs()} style={styles.blogLoadState} accessibilityRole="button">
              <Text style={styles.blogLoadText}>{t("Blogları yükləmək alınmadı")} · {t("Yenidən yoxla")}</Text>
            </Pressable>
          ) : blogPosts.length === 0 ? (
            <View style={styles.blogLoadState}><Text style={styles.blogLoadText}>{t("Blog tapılmadı")}</Text></View>
          ) : blogPosts.map((blog) => (
            <Pressable key={blog.id} style={styles.blogCard} onPress={() => setSelectedBlog(blog)}>
              <Image source={{ uri: blog.image }} style={styles.blogImage} resizeMode="cover" />
              <View style={styles.blogBody}>
                <Text style={styles.blogCategory} numberOfLines={1}>{t(blog.category)}</Text>
                <Text style={styles.blogTitle} numberOfLines={1}>{t(blog.title)}</Text>
                <Text style={styles.blogExcerpt} numberOfLines={2}>{t(blog.excerpt)}</Text>
                <View style={styles.blogMeta}>
                  <Text style={styles.blogDate}>{formatBlogDate(blog.createdAt, language)}</Text>
                  <View style={styles.blogViews}><Ionicons name="eye-outline" size={13} color={colors.muted} /><Text style={styles.blogListings}>{blog.viewCount ?? 0}</Text></View>
                </View>
              </View>
            </Pressable>
          )) }
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
      <LocationFilterModal
        visible={locationVisible}
        selectedRegions={selectedRegions}
        selectedMetros={selectedMetros}
        onClose={() => setLocationVisible(false)}
        onApply={(regions, metros) => {
          setSelectedRegions(regions);
          setSelectedMetros(metros);
          setLocationVisible(false);
        }}
      />
      <Modal
        visible={createMenuVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setCreateMenuVisible(false)}
      >
        <View style={styles.createModalRoot}>
          <Pressable
            style={styles.createBackdrop}
            onPress={() => setCreateMenuVisible(false)}
            accessibilityRole="button"
            accessibilityLabel={t("Bağla")}
          />
          <View style={[styles.createSheetPosition, { bottom: 76 + insets.bottom }]}>
            <View style={styles.createSheet}>
              <View style={styles.createHandle} />
              <View style={styles.createHeadingRow}>
                <Text style={styles.createHeading}>{t("Nə yaratmaq istəyirsiniz?")}</Text>
                <Pressable onPress={() => setCreateMenuVisible(false)} hitSlop={10} accessibilityRole="button" accessibilityLabel={t("Bağla")}>
                  <Ionicons name="close" size={21} color={colors.muted} />
                </Pressable>
              </View>
              {([
                { title: "Yeni elan", icon: "megaphone-outline" as const, subtitle: "Elan yerləşdir" },
                { title: "Yeni biznes", icon: "storefront-outline" as const, subtitle: "Biznes səhifəsi yarat" },
                { title: "Yeni blog", icon: "newspaper-outline" as const, subtitle: "Blog yazısı paylaş" },
              ]).map((action, index) => (
                <Pressable
                  key={action.title}
                  style={[styles.createAction, index === 0 && styles.createActionFeatured]}
                  onPress={() => {
                    setCreateMenuVisible(false);
                    if (action.title === "Yeni elan") {
                      setTimeout(() => setListingTypeVisible(true), 300);
                      return;
                    }
                    if (action.title === "Yeni biznes") {
                      setBusinessLandingVisible(true);
                      return;
                    }
                    Alert.alert(t(action.title), t("Blog yaratma demo rejimində aktiv deyil."));
                  }}
                  accessibilityRole="button"
                >
                  <View style={[styles.createActionIcon, index === 0 && styles.createActionIconFeatured]}>
                    <Ionicons name={action.icon} size={20} color={index === 0 ? colors.brand : colors.ink} />
                  </View>
                  <View style={styles.createActionCopy}>
                    <Text style={styles.createActionTitle}>{t(action.title)}</Text>
                    <Text style={styles.createActionSubtitle}>{t(action.subtitle)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
              ))}
              <View style={{ height: insets.bottom ? 4 : 10 }} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={listingTypeVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setListingTypeVisible(false)}
      >
        <View style={styles.listingTypeModalRoot}>
          <Pressable
            style={styles.listingTypeBackdrop}
            onPress={() => setListingTypeVisible(false)}
            accessibilityRole="button"
            accessibilityLabel={t("Bağla")}
          />
          <View style={[styles.listingTypeCard, { paddingBottom: Math.max(insets.bottom, 20), maxHeight: Dimensions.get("window").height * 0.78 }]}>
            <View style={styles.listingTypeHandle} />
            <View style={styles.listingTypeHeader}>
              <Text style={styles.listingTypeHeading}>{t("Yeni elan")}</Text>
              <Pressable
                onPress={() => setListingTypeVisible(false)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={t("Bağla")}
                style={styles.listingTypeClose}
              >
                <Ionicons name="close" size={21} color={colors.muted} />
              </Pressable>
            </View>
            {([
              { title: "Təklif edilir", subtitle: "Məhsul və ya xidmət təklif edirəm", icon: "pricetag" as const },
              { title: "Axtarılır", subtitle: "Məhsul, xidmət və ya əmlak axtarıram", icon: "search" as const },
              { title: "İtkin", subtitle: "İtki barədə elan yerləşdirirəm", icon: "alert-circle" as const },
            ]).map((item, index) => (
              <Pressable
                key={item.title}
                style={[styles.listingTypeRow, index < 2 && styles.listingTypeRowBorder]}
                onPress={() => {
                  setListingTypeVisible(false);
                  if (item.title === "Təklif edilir" || item.title === "Axtarılır" || item.title === "İtkin") {
                    setListingIntent(item.title === "Axtarılır" ? "search" : item.title === "İtkin" ? "lost" : "offer");
                    setTimeout(() => setListingCreationVisible(true), 300);
                    return;
                  }
                  Alert.alert(t(item.title), t("Elan yaratma formu növbəti mərhələdə əlavə olunacaq."));
                }}
                accessibilityRole="button"
              >
                <View style={styles.listingTypeIcon}>
                  <Ionicons name={item.icon} size={23} color={colors.brand} />
                </View>
                <View style={styles.listingTypeCopy}>
                  <Text style={styles.listingTypeTitle}>{t(item.title)}</Text>
                  <Text style={styles.listingTypeSubtitle}>{t(item.subtitle)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.ink} />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
      <Animated.View style={[styles.bottomBar, { height: 66 + insets.bottom, paddingBottom: insets.bottom, transform: [{ translateY: bottomBarTranslateY }] }]}>
        <BottomItem icon="home" label="Ana səhifə" active={activeBottomTab === "home"} onPress={() => chooseBottomTab("home")} />
        <BottomItem icon="heart" label="Seçilmişlər" active={activeBottomTab === "favorites"} onPress={() => chooseBottomTab("favorites")} />
        <Pressable style={styles.addButton} onPress={() => setCreateMenuVisible(true)} accessibilityRole="button" accessibilityLabel={t("Yeni elan")} accessibilityState={{ expanded: createMenuVisible }}>
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
  locationButton: { width: 112, height: 34, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: colors.line },
  locationButtonText: { flex: 1, minWidth: 0, color: colors.ink, fontSize: 11, fontWeight: "600" },
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
  businessLoadState: { minWidth: 150, minHeight: 70, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  businessLoadText: { color: colors.muted, fontSize: 11, fontWeight: "600" },
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
  businessSlogan: { color: colors.muted, fontSize: 10, marginTop: 3 },
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
  retryButton: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: "#FFF0F2" },
  retryText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  loadMoreButton: { alignSelf: "center", minHeight: 40, marginTop: 16, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.white },
  loadMoreText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  blogHeading: { marginTop: 25, marginBottom: 4, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  blogRow: { paddingHorizontal: 15, paddingTop: 10, gap: 10 },
  blogLoadState: { width: 252, minHeight: 206, alignItems: "center", justifyContent: "center", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  blogLoadText: { color: colors.muted, fontSize: 12, fontWeight: "600", textAlign: "center" },
  blogViews: { flexDirection: "row", alignItems: "center", gap: 3 },
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
  createModalRoot: { flex: 1, justifyContent: "flex-end" },
  createBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(22, 26, 36, 0.34)" },
  createSheetPosition: { position: "absolute", left: 14, right: 14 },
  createSheet: { paddingHorizontal: 16, paddingTop: 10, borderRadius: 24, backgroundColor: colors.white, shadowColor: "#1A1D25", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 20, elevation: 16 },
  createHandle: { alignSelf: "center", width: 38, height: 4, borderRadius: 2, marginBottom: 15, backgroundColor: "#D9DCE3" },
  createHeadingRow: { minHeight: 30, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  createHeading: { color: colors.ink, fontSize: 16, fontWeight: "700", letterSpacing: -0.2 },
  createAction: { minHeight: 66, marginBottom: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  createActionFeatured: { borderColor: "#F0A0AA", backgroundColor: "#FFF7F8" },
  createActionIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft },
  createActionIconFeatured: { backgroundColor: "#FFE8EB" },
  createActionCopy: { flex: 1, gap: 3 },
  createActionTitle: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  createActionSubtitle: { color: colors.muted, fontSize: 11 },
  listingTypeModalRoot: { flex: 1, justifyContent: "flex-end" },
  listingTypeBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(22, 26, 36, 0.38)" },
  listingTypeCard: { width: "100%", paddingHorizontal: 20, paddingTop: 9, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: colors.white, shadowColor: "#121622", shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.12, shadowRadius: 18, elevation: 20 },
  listingTypeHandle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, marginBottom: 8, backgroundColor: "#D9DCE3" },
  listingTypeHeader: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line },
  listingTypeHeading: { flex: 1, color: colors.ink, fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  listingTypeClose: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft },
  listingTypeRow: { minHeight: 86, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 14 },
  listingTypeRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  listingTypeIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0F2" },
  listingTypeCopy: { flex: 1, gap: 4 },
  listingTypeTitle: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  listingTypeSubtitle: { color: colors.muted, fontSize: 12, lineHeight: 17 },


});
