import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ListingCard } from "../components/ListingCard";
import { GalleryViewerModal } from "../components/GalleryViewerModal";
import { listings, type Listing } from "../data/homeData";
import { colors } from "../../../theme/colors";

type Props = { listing: Listing; onBack: () => void; onSelectListing: (listing: Listing) => void };

export function ListingDetailScreen({ listing, onBack, onSelectListing }: Props) {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [phoneExpanded, setPhoneExpanded] = useState(false);
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const galleryImages = [listing.image];
  const related = listings.filter((item) => item.id !== listing.id).slice(0, 2);

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Açılmadı", "Bu əməliyyat üçün uyğun tətbiq tapılmadı.");
    }
  };

  const shareListing = async () => {
    try {
      await Share.share({ message: `${listing.title} — ${listing.price}\nhttps://axtar.az` });
    } catch {
      Alert.alert("Paylaşmaq mümkün olmadı", "Bir az sonra yenidən yoxlayın.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.headerButton} accessibilityLabel="Geri">
          <Ionicons name="arrow-back" size={23} color={colors.ink} />
        </Pressable>
        <View style={styles.crumb}>
          <Text style={styles.crumbText}>Elanlar</Text>
          <Ionicons name="chevron-forward" size={13} color={colors.subtle} />
          <Text style={styles.crumbCurrent} numberOfLines={1}>{listing.title}</Text>
        </View>
        <Pressable onPress={shareListing} style={styles.headerButton} accessibilityLabel="Paylaş">
          <Ionicons name="share-social-outline" size={20} color={colors.ink} />
        </Pressable>
        <Pressable onPress={() => setMoreVisible(true)} style={styles.headerButton} accessibilityLabel="Daha çox">
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => setGalleryVisible(true)} style={styles.hero} accessibilityRole="button" accessibilityLabel="Şəkillərə bax">
          <Image source={{ uri: listing.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.imageCount}><Ionicons name="images-outline" size={14} color="#FFFFFF" /><Text style={styles.imageCountText}>1 / {galleryImages.length}</Text></View>
          <Pressable onPress={() => setFavorite((value) => !value)} style={styles.heroFavorite} accessibilityLabel="Seçilmişlərə əlavə et">
            <Ionicons name={favorite ? "heart" : "heart-outline"} size={22} color={favorite ? colors.brand : colors.ink} />
          </Pressable>
        </Pressable>

        <View style={styles.mainCard}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{listing.price}</Text>
            {listing.badge ? <View style={styles.premiumBadge}><Ionicons name="diamond" size={13} color={colors.gold} /><Text style={styles.premiumText}>{listing.badge}</Text></View> : null}
          </View>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.locationLine}><Ionicons name="location" size={16} color={colors.muted} /><Text style={styles.metaText}>{listing.location}</Text><Text style={styles.metaDivider}>·</Text><Text style={styles.metaText}>{listing.age}</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Elan haqqında</Text>
          <Text style={styles.description} numberOfLines={descriptionExpanded ? undefined : 3}>
            Keyfiyyətli və etibarlı məhsul. Ətraflı məlumat və qiymət üçün bizimlə əlaqə saxlayın. Bakı şəhəri və ətraf ərazilərə çatdırılma mümkündür.
          </Text>
          <Pressable onPress={() => setDescriptionExpanded((value) => !value)} style={styles.moreTextButton}>
            <Text style={styles.moreText}>{descriptionExpanded ? "Daha az göstər" : "Davamını oxu"}</Text>
            <Ionicons name={descriptionExpanded ? "chevron-up" : "chevron-down"} size={16} color={colors.brand} />
          </Pressable>
          <View style={styles.specGrid}>
            <Spec icon="pricetag-outline" label="Kateqoriya" value="Biznes və xidmətlər" />
            <Spec icon="location-outline" label="Şəhər" value={listing.location} />
            <Spec icon="calendar-outline" label="Yerləşdirilib" value={listing.age} />
            <Spec icon="eye-outline" label="Baxış sayı" value="50" />
          </View>
        </View>

        <View style={styles.statsCard}>
          <Stat icon="eye-outline" value="50" label="baxış" />
          <Stat icon="heart-outline" value="25" label="seçilmiş" />
          <Stat icon="time-outline" value="22 gün" label="aktivdir" />
          <Stat icon="pricetag-outline" value={listing.id} label="elan №" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Əlaqə məlumatları</Text>
          <Pressable onPress={() => openUrl("tel:+994552458979")} style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: "#EAF8F0" }]}><Ionicons name="call" size={19} color="#159B64" /></View>
            <View style={styles.contactCopy}><Text style={styles.contactLabel}>Telefon</Text><Text style={styles.contactValue}>{phoneExpanded ? "+994 55 245 89 79" : "Nömrəni göstər"}</Text></View>
            <Ionicons name={phoneExpanded ? "eye-off-outline" : "eye-outline"} size={20} color={colors.muted} />
          </Pressable>
          <Pressable onPress={() => setPhoneExpanded((value) => !value)} style={styles.revealTap}><Text style={styles.moreText}>{phoneExpanded ? "Nömrəni gizlət" : "Telefon nömrəsini göstər"}</Text></Pressable>
          <Pressable onPress={() => setHoursExpanded((value) => !value)} style={[styles.contactRow, styles.rowDivider]}>
            <View style={[styles.contactIcon, { backgroundColor: "#F2F4F7" }]}><Ionicons name="time-outline" size={20} color={colors.ink} /></View>
            <View style={styles.contactCopy}><Text style={styles.contactLabel}>İş saatları</Text><Text style={styles.contactValue}>Həftə içi · 09:00–18:00</Text>{hoursExpanded ? <Text style={styles.hoursHint}>Şənbə 10:00–16:00 · Bazar bağlıdır</Text> : null}</View>
            <Ionicons name={hoursExpanded ? "chevron-up" : "chevron-down"} size={19} color={colors.muted} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.ownerTop}><View style={styles.ownerAvatar}><Ionicons name="person" size={22} color={colors.brand} /></View><View style={styles.ownerCopy}><Text style={styles.ownerName}>Alpha Alpha</Text><Text style={styles.metaText}>Axtar.az üzvü</Text></View><Pressable style={styles.followButton} onPress={() => Alert.alert("İzlə", "İzləmək üçün hesabınıza daxil olun.")}><Text style={styles.followText}>İzlə</Text></Pressable></View>
          <View style={styles.ownerActions}><Text style={styles.metaText}>Digər elanlar: 4</Text><Pressable onPress={() => Alert.alert("Elanlar", "İstifadəçinin digər elanları açılacaq.")}><Text style={styles.moreText}>Hamısına bax</Text></Pressable></View>
        </View>

        <Pressable onPress={() => openUrl("https://maps.google.com/?q=Baku")} style={styles.mapCard}>
          <View style={styles.mapPattern}><Ionicons name="location" size={31} color={colors.brand} /></View>
          <View style={styles.mapCopy}><Text style={styles.sectionTitle}>Ünvan</Text><Text style={styles.metaText}>{listing.location}, Azərbaycan</Text></View>
          <Ionicons name="open-outline" size={18} color={colors.muted} />
        </Pressable>

        {related.length ? <View style={styles.relatedSection}>
          <View style={styles.relatedHeading}><Text style={styles.sectionTitle}>Oxşar elanlar</Text><Text style={styles.relatedCount}>Sizə uyğun</Text></View>
          <View style={styles.relatedGrid}>{related.map((item) => <View key={item.id} style={styles.relatedItem}><ListingCard listing={item} onPress={() => onSelectListing(item)} /></View>)}</View>
        </View> : null}
      </ScrollView>

      <View style={[styles.bottomActions, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <Pressable onPress={() => openUrl("tel:+994552458979")} style={styles.callButton}><Ionicons name="call" size={19} color="#FFFFFF" /><Text style={styles.callText}>Zəng et</Text></Pressable>
        <Pressable onPress={() => openUrl("sms:+994552458979")} style={styles.messageButton}><Ionicons name="chatbubble" size={18} color={colors.brand} /><Text style={styles.messageText}>Mesaj yaz</Text></Pressable>
      </View>

      <GalleryViewerModal visible={galleryVisible} images={galleryImages} onClose={() => setGalleryVisible(false)} onCall={() => openUrl("tel:+994552458979")} isFavorite={favorite} onToggleFavorite={() => setFavorite((value) => !value)} />
      {moreVisible ? <View style={styles.sheetBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setMoreVisible(false)} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 14) }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Elan seçimləri</Text>
          <SheetAction icon="share-social-outline" label="Paylaş" onPress={() => { setMoreVisible(false); void shareListing(); }} />
          <SheetAction icon="flag-outline" label="Şikayət et" onPress={() => { setMoreVisible(false); Alert.alert("Şikayət et", "Şikayət səbəbini seçmək üçün daxil olun."); }} />
          <SheetAction icon="megaphone-outline" label="Reklam alətləri" onPress={() => { setMoreVisible(false); Alert.alert("Reklam alətləri", "Bu elan üçün tanıtım seçimləri."); }} />
        </View>
      </View> : null}
    </SafeAreaView>
  );
}

function Spec({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.spec}><Ionicons name={icon} size={16} color={colors.muted} /><View><Text style={styles.specLabel}>{label}</Text><Text style={styles.specValue}>{value}</Text></View></View>;
}
function Stat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return <View style={styles.stat}><Ionicons name={icon} size={17} color={colors.muted} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}
function SheetAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.sheetAction}><Ionicons name={icon} size={21} color={colors.ink} /><Text style={styles.sheetActionText}>{label}</Text><Ionicons name="chevron-forward" size={17} color={colors.subtle} /></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F5F7" },
  header: { minHeight: 54, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#ECEEF1" },
  headerButton: { width: 38, height: 40, alignItems: "center", justifyContent: "center" },
  crumb: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4, overflow: "hidden" },
  crumbText: { color: colors.muted, fontSize: 12 },
  crumbCurrent: { flexShrink: 1, color: colors.ink, fontSize: 12, fontWeight: "600" },
  scroll: { flex: 1 },
  content: { paddingBottom: 20 },
  hero: { height: 270, backgroundColor: "#E7E9ED" },
  heroImage: { width: "100%", height: "100%" },
  imageCount: { position: "absolute", left: 14, bottom: 14, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 18, backgroundColor: "rgba(24,26,31,0.72)" },
  imageCountText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  heroFavorite: { position: "absolute", right: 13, top: 13, width: 42, height: 42, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  mainCard: { padding: 17, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E9EBEF" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  price: { color: colors.brand, fontSize: 27, fontWeight: "900", letterSpacing: -0.5 },
  premiumBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: "#FFF7E2" },
  premiumText: { color: "#7A5A12", fontSize: 9, fontWeight: "800" },
  title: { marginTop: 6, color: colors.ink, fontSize: 19, lineHeight: 25, fontWeight: "700" },
  locationLine: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  metaText: { color: colors.muted, fontSize: 12 },
  metaDivider: { color: colors.subtle, marginHorizontal: 2 },
  card: { marginHorizontal: 13, marginTop: 12, padding: 16, borderRadius: 16, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E9EBEF" },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  description: { color: "#414958", fontSize: 14, lineHeight: 22, marginTop: 10 },
  moreTextButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, paddingTop: 8 },
  moreText: { color: colors.brand, fontSize: 13, fontWeight: "700" },
  specGrid: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderColor: "#EEF0F3", marginTop: 15, paddingTop: 12, rowGap: 14 },
  spec: { width: "50%", flexDirection: "row", alignItems: "center", gap: 8 },
  specLabel: { color: colors.muted, fontSize: 10 },
  specValue: { color: colors.ink, fontSize: 12, fontWeight: "600", marginTop: 2 },
  statsCard: { marginHorizontal: 13, marginTop: 12, paddingVertical: 15, flexDirection: "row", justifyContent: "space-around", borderRadius: 15, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E9EBEF" },
  stat: { alignItems: "center", gap: 3 },
  statValue: { color: colors.ink, fontSize: 12, fontWeight: "800" },
  statLabel: { color: colors.muted, fontSize: 9 },
  contactRow: { minHeight: 63, flexDirection: "row", alignItems: "center", gap: 11, marginTop: 8 },
  contactIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  contactCopy: { flex: 1 },
  contactLabel: { color: colors.muted, fontSize: 11 },
  contactValue: { color: colors.ink, fontSize: 14, fontWeight: "700", marginTop: 2 },
  revealTap: { alignSelf: "flex-start", paddingLeft: 49, paddingBottom: 8 },
  hoursHint: { color: colors.muted, fontSize: 11, marginTop: 4 },
  rowDivider: { borderTopWidth: 1, borderTopColor: "#EEF0F3", paddingTop: 8 },
  ownerTop: { flexDirection: "row", alignItems: "center", gap: 11 },
  ownerAvatar: { width: 43, height: 43, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0F1" },
  ownerCopy: { flex: 1 },
  ownerName: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  followButton: { minWidth: 70, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: colors.brand },
  followText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  ownerActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: "#EEF0F3" },
  mapCard: { marginHorizontal: 13, marginTop: 12, padding: 12, borderRadius: 15, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#E9EBEF" },
  mapPattern: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#EAF0E9", alignItems: "center", justifyContent: "center" },
  mapCopy: { flex: 1, gap: 4 },
  relatedSection: { marginTop: 20, paddingHorizontal: 13 },
  relatedHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  relatedCount: { color: colors.muted, fontSize: 11 },
  relatedGrid: { flexDirection: "row", gap: 10 },
  relatedItem: { width: "48.5%" },
  bottomActions: { minHeight: 75, paddingHorizontal: 14, paddingTop: 10, flexDirection: "row", gap: 11, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderColor: "#E9EBEF" },
  callButton: { flex: 1, minHeight: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: colors.brand },
  callText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  messageButton: { flex: 1, minHeight: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.brand, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: "#FFFFFF" },
  messageText: { color: colors.brand, fontSize: 16, fontWeight: "800" },
  sheetBackdrop: { ...StyleSheet.absoluteFillObject, zIndex: 5, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: { paddingHorizontal: 18, paddingTop: 10, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: "#FFFFFF" },
  sheetHandle: { alignSelf: "center", width: 38, height: 4, borderRadius: 3, backgroundColor: "#D3D6DC", marginBottom: 14 },
  sheetTitle: { color: colors.ink, fontSize: 17, fontWeight: "800", marginBottom: 8 },
  sheetAction: { minHeight: 53, flexDirection: "row", alignItems: "center", gap: 13, borderBottomWidth: 1, borderBottomColor: "#F0F1F4" },
  sheetActionText: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: "600" },
});
