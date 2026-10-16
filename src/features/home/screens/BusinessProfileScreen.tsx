import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";

type Props = {
  businessName: string;
  onBack: () => void;
};

type BusinessTab = "about" | "offers" | "campaigns" | "gallery" | "reviews";
type TabItem = { id: BusinessTab; label: string; icon: keyof typeof Ionicons.glyphMap };

const tabs: TabItem[] = [
  { id: "about", label: "Haqqımızda", icon: "id-card" },
  { id: "offers", label: "Təkliflər", icon: "folder-open" },
  { id: "campaigns", label: "Kampaniyalar", icon: "gift" },
  { id: "gallery", label: "Qalereya", icon: "image" },
  { id: "reviews", label: "Rəylər (230)", icon: "star" },
];

const categories = ["Bütün təkliflər (1)", "Nəqliyyat", "Elektronika"];
const businessPhone = "+0509956663";
const offerImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85";

export function BusinessProfileScreen({ businessName, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<BusinessTab>("about");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [search, setSearch] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const insets = useSafeAreaInsets();

  const showOffer = useMemo(() => {
    const matchesSearch = !search.trim() || "BMW".toLocaleLowerCase("az").includes(search.trim().toLocaleLowerCase("az"));
    const matchesCategory = selectedCategory !== "Elektronika";
    return matchesSearch && matchesCategory;
  }, [search, selectedCategory]);

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Açılmadı", "Bu əməliyyat üçün uyğun tətbiq tapılmadı.");
    }
  };

  const shareBusiness = async () => {
    try {
      await Share.share({ message: `${businessName} — Axtar.az biznes profili\nhttps://axtar.az` });
    } catch {
      Alert.alert("Paylaşmaq mümkün olmadı", "Bir az sonra yenidən yoxlayın.");
    }
  };

  const openTab = (tab: BusinessTab) => setActiveTab(tab);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.topButton} accessibilityRole="button" accessibilityLabel="Geri">
          <Ionicons name="arrow-back" size={23} color="#171A22" />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>Biznes profili</Text>
        <Pressable onPress={shareBusiness} style={styles.topButton} accessibilityRole="button" accessibilityLabel="Biznesi paylaş">
          <Ionicons name="share-social" size={21} color="#171A22" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cover}>
          <View style={styles.coverMark}>
            <View style={styles.windmill}>
              <View style={[styles.windmillBlade, styles.bladeTop]} />
              <View style={[styles.windmillBlade, styles.bladeRight]} />
              <View style={[styles.windmillBlade, styles.bladeBottom]} />
              <View style={[styles.windmillBlade, styles.bladeLeft]} />
              <View style={styles.windmillBase} />
            </View>
            <Text style={styles.coverBrand}>Kentus{"\n"}Farm</Text>
          </View>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.brandAvatar}>
            <View style={[styles.windmill, styles.avatarWindmill]}>
              <View style={[styles.windmillBlade, styles.bladeTop]} />
              <View style={[styles.windmillBlade, styles.bladeRight]} />
              <View style={[styles.windmillBlade, styles.bladeBottom]} />
              <View style={[styles.windmillBlade, styles.bladeLeft]} />
              <View style={styles.windmillBase} />
            </View>
            <Text style={styles.avatarBrand}>Kentus{"\n"}Farm</Text>
            <View style={styles.verified}>
              <Ionicons name="checkmark" size={13} color="#FFFFFF" />
            </View>
          </View>

          <Pressable
            onPress={() => setIsFollowing((current) => !current)}
            style={[styles.followButton, isFollowing && styles.followingButton]}
            accessibilityRole="button"
            accessibilityState={{ selected: isFollowing }}
          >
            <Text style={[styles.followText, isFollowing && styles.followingText]}>
              {isFollowing ? "İzlənilir" : "İzlə"}
            </Text>
          </Pressable>

          <Text style={styles.businessName}>{businessName}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>1 elan</Text>
            <Text style={styles.statDot}>·</Text>
            <Text style={styles.statText}>202 baxış</Text>
            <Text style={styles.statDot}>·</Text>
            <Text style={styles.statText}>{isFollowing ? "1 izləyici" : "0 izləyici"}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
          keyboardShouldPersistTaps="handled"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => openTab(tab.id)}
                style={[styles.tab, active && styles.activeTab]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Ionicons name={tab.icon} size={21} color={active ? colors.brand : "#303649"} />
                <Text style={[styles.tabLabel, active && styles.activeTabLabel]} numberOfLines={1}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {activeTab === "about" ? (
          <View style={styles.content}>
            <View style={styles.aboutCard}>
              <Text style={styles.cardTitle}>Haqqımızda</Text>
              <Text style={styles.aboutText}>
                Məqsədimiz: keyfiyyətli elektronika və peşəkar xidmət. Mağazamızda məişət texnikası,
                aksesuarlar və geniş çeşidli avadanlıqlar sizi gözləyir. Önceliyimiz — məhsulun
                keyfiyyəti və məmnuniyyətiniz. Xeyirli olsun!
              </Text>
            </View>
            <ContactLine
              icon="call"
              text={businessPhone}
              color="#109B78"
              onPress={() => openLink("tel:+0509956663")}
            />
            <Pressable
              onPress={() => setHoursExpanded((current) => !current)}
              style={styles.infoRow}
              accessibilityRole="button"
              accessibilityState={{ expanded: hoursExpanded }}
            >
              <Ionicons name="time-outline" size={23} color="#17213B" />
              <View style={styles.infoCopy}>
                <Text style={styles.hoursText}>Çərşənbə axşamı, Çərşənbə, Cümə, Şənbə{"\n"}09:00 - 20:00</Text>
                {hoursExpanded ? (
                  <View style={styles.hoursList}>
                    <Text style={styles.hoursDetail}>Bazar ertəsi · Bağlı</Text>
                    <Text style={styles.hoursDetail}>Çərşənbə axşamı · 09:00–20:00</Text>
                    <Text style={styles.hoursDetail}>Çərşənbə · 09:00–20:00</Text>
                    <Text style={styles.hoursDetail}>Cümə axşamı · Bağlı</Text>
                    <Text style={styles.hoursDetail}>Cümə və şənbə · 09:00–20:00</Text>
                    <Text style={styles.hoursDetail}>Bazar · Bağlı</Text>
                  </View>
                ) : null}
              </View>
              <Ionicons name={hoursExpanded ? "chevron-up" : "chevron-down"} size={19} color="#17213B" />
            </Pressable>
            <Pressable
              onPress={() => openLink("https://maps.google.com/?q=Baku")}
              style={styles.infoRow}
              accessibilityRole="button"
            >
              <Ionicons name="location" size={23} color="#17213B" />
              <Text style={styles.locationText}>Qeyd edilməyib</Text>
              <Ionicons name="open-outline" size={19} color="#758097" />
            </Pressable>

            <GalleryPreview onPress={() => setActiveTab("gallery")} />
            <OfferSection
              search={search}
              onSearch={setSearch}
              selectedCategory={selectedCategory}
              onCategory={setSelectedCategory}
              showOffer={showOffer}
              isSaved={isSaved}
              onToggleSaved={() => setIsSaved((current) => !current)}
            />
          </View>
        ) : null}

        {activeTab === "offers" ? (
          <View style={styles.content}>
            <OfferSection
              search={search}
              onSearch={setSearch}
              selectedCategory={selectedCategory}
              onCategory={setSelectedCategory}
              showOffer={showOffer}
              isSaved={isSaved}
              onToggleSaved={() => setIsSaved((current) => !current)}
            />
          </View>
        ) : null}

        {activeTab === "campaigns" ? (
          <EmptyTab icon="gift-outline" title="Kampaniya yoxdur" body="Bu biznesin aktiv kampaniyaları burada görünəcək." />
        ) : null}

        {activeTab === "gallery" ? (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Qalereya</Text>
            <View style={styles.galleryGrid}>
              <GalleryTile />
              <GalleryTile />
            </View>
          </View>
        ) : null}

        {activeTab === "reviews" ? (
          <View style={styles.content}>
            <View style={styles.ratingCard}>
              <Ionicons name="star" size={25} color="#FFC84A" />
              <Text style={styles.ratingValue}>4.8</Text>
              <Text style={styles.ratingCaption}>230 rəy</Text>
            </View>
            <EmptyTab icon="chatbubble-ellipses-outline" title="Rəylər" body="Müştəri rəyləri bu bölmədə göstəriləcək." />
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.bottomActions, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          onPress={() => openLink("tel:+0509956663")}
          style={styles.callButton}
          accessibilityRole="button"
          accessibilityLabel="Zəng et"
        >
          <Ionicons name="call" size={19} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Zəng et</Text>
        </Pressable>
        <Pressable
          onPress={() => openLink("sms:+0509956663")}
          style={styles.messageButton}
          accessibilityRole="button"
          accessibilityLabel="Mesaj yaz"
        >
          <Ionicons name="chatbubble" size={19} color={colors.brand} />
          <Text style={styles.messageButtonText}>Mesaj yaz</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ContactLine({
  icon,
  text,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.contactLine} accessibilityRole="button">
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.phoneText, { color }]}>{text}</Text>
    </Pressable>
  );
}

function GalleryPreview({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.gallerySection}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Qalereya</Text>
        <Pressable onPress={onPress} accessibilityRole="button">
          <Text style={styles.viewAll}>Hamısına bax</Text>
        </Pressable>
      </View>
      <Pressable onPress={onPress} style={styles.galleryPreview}>
        <View style={styles.galleryMark}>
          <View style={styles.smallWindmill}>
            <View style={[styles.windmillBlade, styles.bladeTop]} />
            <View style={[styles.windmillBlade, styles.bladeRight]} />
            <View style={[styles.windmillBlade, styles.bladeBottom]} />
            <View style={[styles.windmillBlade, styles.bladeLeft]} />
            <View style={styles.windmillBase} />
          </View>
          <Text style={styles.galleryBrand}>Kentus{"\n"}Farm</Text>
        </View>
      </Pressable>
    </View>
  );
}

function OfferSection({
  search,
  onSearch,
  selectedCategory,
  onCategory,
  showOffer,
  isSaved,
  onToggleSaved,
}: {
  search: string;
  onSearch: (value: string) => void;
  selectedCategory: string;
  onCategory: (value: string) => void;
  showOffer: boolean;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <View style={styles.offerSection}>
      <Text style={styles.sectionTitle}>Təkliflər</Text>
      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Təkliflərdə axtar..."
          placeholderTextColor="#778096"
          style={styles.searchInput}
          returnKeyType="search"
          accessibilityLabel="Biznes təkliflərində axtar"
        />
        <Ionicons name="search" size={20} color="#17213B" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((category, index) => {
          const active = selectedCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => onCategory(category)}
              style={[styles.categoryChip, active && styles.categoryChipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={index === 0 ? "grid-outline" : "folder"}
                size={17}
                color={active ? colors.brand : "#323B50"}
              />
              <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {showOffer ? (
        <View style={styles.offerCard}>
          <View style={styles.offerImageWrap}>
            <Image source={{ uri: offerImage }} style={styles.offerImage} resizeMode="cover" />
            <View style={styles.offerBadge}><Text style={styles.offerBadgeText}>İTKİN</Text></View>
            <Pressable
              onPress={onToggleSaved}
              style={styles.favoriteButton}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"}
            >
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={21} color={isSaved ? colors.brand : "#323B50"} />
            </Pressable>
          </View>
          <View style={styles.offerInfo}>
            <Text style={styles.offerPrice}>23 000 ₼</Text>
            <Text style={styles.offerName}>BMW</Text>
            <View style={styles.offerMeta}>
              <Ionicons name="location" size={14} color="#647084" />
              <Text style={styles.offerMetaText}>Bakı</Text>
              <Text style={styles.offerMetaDivider}>|</Text>
              <Text style={styles.offerMetaText}>1 ay əvvəl</Text>
              <View style={styles.offerBadges}>
                <Ionicons name="trophy" size={16} color="#FFC84A" />
                <Ionicons name="diamond" size={16} color="#FFC84A" />
                <Ionicons name="flash" size={16} color="#FFC84A" />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={27} color="#A0A6B2" />
          <Text style={styles.noResultsText}>Uyğun təklif tapılmadı</Text>
        </View>
      )}
    </View>
  );
}

function GalleryTile() {
  return (
    <View style={styles.galleryTile}>
      <View style={styles.galleryMark}>
        <View style={styles.smallWindmill}>
          <View style={[styles.windmillBlade, styles.bladeTop]} />
          <View style={[styles.windmillBlade, styles.bladeRight]} />
          <View style={[styles.windmillBlade, styles.bladeBottom]} />
          <View style={[styles.windmillBlade, styles.bladeLeft]} />
          <View style={styles.windmillBase} />
        </View>
        <Text style={styles.galleryBrand}>Kentus{"\n"}Farm</Text>
      </View>
    </View>
  );
}

function EmptyTab({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  return (
    <View style={styles.emptyTab}>
      <View style={styles.emptyIcon}><Ionicons name={icon} size={26} color={colors.brand} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F6F8" },
  topBar: { height: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F5F6F8" },
  topButton: { width: 42, height: 42, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7EAF0" },
  topTitle: { flex: 1, marginHorizontal: 14, color: "#17213B", fontSize: 16, fontWeight: "700" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  cover: { height: 190, alignItems: "center", justifyContent: "center", backgroundColor: "#F0F1F3" },
  coverMark: { flexDirection: "row", alignItems: "center", gap: 20 },
  windmill: { width: 65, height: 65, position: "relative" },
  windmillBlade: { position: "absolute", width: 26, height: 26, backgroundColor: "#F24A16" },
  bladeTop: { top: 0, left: 0, transform: [{ skewY: "-18deg" }] },
  bladeRight: { top: 0, right: 0, transform: [{ skewX: "-18deg" }] },
  bladeBottom: { bottom: 0, right: 0, transform: [{ skewY: "-18deg" }] },
  bladeLeft: { bottom: 0, left: 0, transform: [{ skewX: "-18deg" }] },
  windmillBase: { position: "absolute", left: 27, bottom: 0, height: 22, width: 11, borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: "#F24A16" },
  coverBrand: { color: "#111318", fontSize: 36, lineHeight: 36, fontWeight: "900", letterSpacing: -1.7 },
  profileHeader: { minHeight: 168, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: "#FFFFFF" },
  brandAvatar: { width: 116, height: 116, marginTop: -48, borderRadius: 60, borderWidth: 6, borderColor: "#FFFFFF", backgroundColor: "#07090B", alignItems: "center", justifyContent: "center", overflow: "visible" },
  avatarWindmill: { display: "none" },
  avatarBrand: { color: "#FFFFFF", fontSize: 14, lineHeight: 15, fontWeight: "900", textAlign: "center" },
  verified: { position: "absolute", right: -2, bottom: 2, width: 30, height: 30, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#FFB600", borderWidth: 3, borderColor: "#FFFFFF" },
  followButton: { position: "absolute", top: 20, right: 20, minWidth: 92, minHeight: 46, borderRadius: 13, borderWidth: 1.5, borderColor: colors.brand, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  followingButton: { backgroundColor: "#FFF0F1" },
  followText: { color: colors.brand, fontSize: 17, fontWeight: "800" },
  followingText: { color: "#C72F40" },
  businessName: { marginTop: 20, color: "#17213B", fontSize: 20, fontWeight: "800" },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 11, marginTop: 12 },
  statText: { color: "#17213B", fontSize: 14, fontWeight: "500" },
  statDot: { color: "#6E778B", fontSize: 16 },
  tabs: { minHeight: 76, paddingHorizontal: 12, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#E5E8EE", gap: 4 },
  tab: { minWidth: 88, minHeight: 75, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", gap: 7, borderBottomWidth: 3, borderBottomColor: "transparent" },
  activeTab: { borderBottomColor: colors.brand },
  tabLabel: { color: "#303649", fontSize: 10, fontWeight: "600" },
  activeTabLabel: { color: colors.brand },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  aboutCard: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: "#E5E8EE", backgroundColor: "#FFFFFF" },
  cardTitle: { color: "#17213B", fontSize: 16, fontWeight: "800" },
  aboutText: { marginTop: 12, color: "#39445B", fontSize: 15, lineHeight: 26, fontWeight: "400" },
  contactLine: { minHeight: 72, paddingHorizontal: 5, flexDirection: "row", alignItems: "center", gap: 13 },
  phoneText: { fontSize: 17, fontWeight: "700" },
  infoRow: { minHeight: 70, paddingHorizontal: 5, flexDirection: "row", alignItems: "center", gap: 14 },
  infoCopy: { flex: 1 },
  hoursText: { color: "#111318", fontSize: 14, lineHeight: 21, fontWeight: "800" },
  hoursList: { marginTop: 8, padding: 10, borderRadius: 12, backgroundColor: "#F6F7F9", gap: 5 },
  hoursDetail: { color: "#596277", fontSize: 12 },
  locationText: { flex: 1, color: "#17213B", fontSize: 14, fontWeight: "600" },
  gallerySection: { marginTop: 22 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: "#171A22", fontSize: 19, fontWeight: "800" },
  viewAll: { color: colors.brand, fontSize: 13, fontWeight: "700" },
  galleryPreview: { width: 190, height: 125, borderRadius: 14, backgroundColor: "#F0F1F3", alignItems: "center", justifyContent: "center" },
  galleryMark: { flexDirection: "row", alignItems: "center", gap: 10 },
  smallWindmill: { width: 42, height: 42, position: "relative" },
  galleryBrand: { color: "#111318", fontSize: 19, lineHeight: 19, fontWeight: "900", letterSpacing: -0.7 },
  offerSection: { marginTop: 27 },
  searchBox: { height: 48, marginTop: 12, paddingHorizontal: 14, borderRadius: 13, borderWidth: 1, borderColor: "#DDE2EB", backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, color: "#17213B", fontSize: 14, fontWeight: "600", textAlign: "center" },
  categoryRow: { paddingTop: 16, paddingBottom: 12, gap: 9 },
  categoryChip: { minHeight: 42, paddingHorizontal: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#F0F2F6" },
  categoryChipActive: { backgroundColor: "#FFF0F1" },
  categoryChipText: { color: "#303A50", fontSize: 12, fontWeight: "700" },
  categoryChipTextActive: { color: colors.brand },
  offerCard: { width: 286, maxWidth: "100%", overflow: "hidden", borderRadius: 14, borderWidth: 1, borderColor: "#E7EAF0", backgroundColor: "#FFFFFF", elevation: 1 },
  offerImageWrap: { width: "100%", aspectRatio: 1, position: "relative", backgroundColor: "#ECEFF3" },
  offerImage: { width: "100%", height: "100%" },
  offerBadge: { position: "absolute", left: 9, top: 9, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, backgroundColor: "#FFFFFF" },
  offerBadgeText: { color: colors.brand, fontSize: 9, fontWeight: "900" },
  favoriteButton: { position: "absolute", right: 10, top: 10, width: 38, height: 38, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  offerInfo: { minHeight: 110, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 11 },
  offerPrice: { color: colors.brand, fontSize: 22, fontWeight: "900" },
  offerName: { color: "#222A3C", fontSize: 16, marginTop: 5 },
  offerMeta: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 22 },
  offerMetaText: { color: "#647084", fontSize: 10 },
  offerMetaDivider: { color: "#CBD0D9", fontSize: 12 },
  offerBadges: { marginLeft: "auto", flexDirection: "row", gap: 5 },
  noResults: { minHeight: 170, alignItems: "center", justifyContent: "center", gap: 8 },
  noResultsText: { color: "#737B8C", fontSize: 13 },
  galleryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12 },
  galleryTile: { width: "48%", height: 150, borderRadius: 14, backgroundColor: "#F0F1F3", alignItems: "center", justifyContent: "center" },
  ratingCard: { minHeight: 74, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, borderRadius: 14, backgroundColor: "#FFFFFF" },
  ratingValue: { color: "#171A22", fontSize: 19, fontWeight: "800" },
  ratingCaption: { color: "#71798A", fontSize: 13 },
  emptyTab: { alignItems: "center", paddingHorizontal: 28, paddingTop: 60 },
  emptyIcon: { width: 58, height: 58, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0F1" },
  emptyTitle: { marginTop: 15, color: "#171A22", fontSize: 18, fontWeight: "800" },
  emptyBody: { marginTop: 7, color: "#737B8C", fontSize: 13, lineHeight: 20, textAlign: "center" },
  bottomActions: { position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 76, paddingHorizontal: 14, paddingTop: 10, flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1, borderColor: "#E7EAF0", backgroundColor: "#FFFFFF" },
  callButton: { flex: 1, minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 13, backgroundColor: colors.brand },
  callButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  messageButton: { flex: 1, minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 13, borderWidth: 1.4, borderColor: colors.brand, backgroundColor: "#FFFFFF" },
  messageButtonText: { color: colors.brand, fontSize: 16, fontWeight: "800" },
});
