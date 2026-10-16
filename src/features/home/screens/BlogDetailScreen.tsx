import { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GalleryViewerModal } from "../components/GalleryViewerModal";
import { colors } from "../../../theme/colors";
import { useI18n } from "../../../i18n/I18nProvider";

export type BlogPost = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  listings: string;
  image: string;
};

type Props = {
  blog: BlogPost;
  images: string[];
  onBack: () => void;
};

const pageWidth = Dimensions.get("window").width - 32;

export function BlogDetailScreen({ blog, images, onBack }: Props) {
  const { t } = useI18n();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleSlideChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveSlide(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
  };

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.headerButton} accessibilityRole="button" accessibilityLabel={t("Geri")}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>{t("Blog detalı")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => openGallery(Math.max(0, images.indexOf(blog.image)))} accessibilityRole="button" accessibilityLabel={t("Şəkli tam ekranda aç")}>
          <Image source={{ uri: blog.image }} style={styles.cover} resizeMode="cover" />
          <View style={styles.coverTag}><Text style={styles.coverTagText}>{t(blog.category)}</Text></View>
        </Pressable>

        <View style={styles.articleCard}>
          <Text style={styles.category}>{t(blog.category)}</Text>
          <Text style={styles.title}>{t(blog.title)}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={16} color={colors.muted} />
            <Text style={styles.metaText}>{t("2 ay əvvəl")}</Text>
            <Ionicons name="eye-outline" size={17} color={colors.muted} />
            <Text style={styles.metaText}>{t("154 baxış")}</Text>
          </View>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}><Ionicons name="person" size={22} color={colors.brand} /></View>
            <Text style={styles.authorName} numberOfLines={1}>Xəyyam Məmmədli</Text>
            <Ionicons name="ribbon" size={21} color={colors.gold} />
          </View>
        </View>

        <View style={styles.articleBody}>
          <Text style={styles.paragraph}>{t(blog.excerpt)}</Text>
          <Text style={styles.sectionTitle}>{t("1. Dizayn və ekran")}</Text>
          <Text style={styles.paragraph}>{t("Bütün iPhone 15 modelləri Ceramic Shield ön şüşə və alüminium və ya titan çərçivə ilə təqdim olunur.")}</Text>

          <View style={styles.gallerySection}>
            <ScrollView
              horizontal
              pagingEnabled
              nestedScrollEnabled
              directionalLockEnabled
              snapToInterval={pageWidth}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleSlideChange}
            >
              {images.map((uri, index) => (
                <Pressable
                  key={uri + index}
                  onPress={() => openGallery(index)}
                  style={styles.slide}
                  accessibilityRole="button"
                  accessibilityLabel={t("Şəkli tam ekranda aç")}
                >
                  <Image source={{ uri }} style={styles.slideImage} resizeMode="contain" />
                  <View style={styles.expandIcon}><Ionicons name="expand-outline" size={18} color={colors.ink} /></View>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {images.map((uri, index) => (
                <View key={uri + "-dot-" + index} style={[styles.dot, index === activeSlide && styles.dotActive]} />
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t("2. Performans")}</Text>
          <Text style={styles.paragraph}>{t("A16 Bionic çip və A17 Pro çip cihazların sürətini, qrafik imkanlarını və enerji səmərəliliyini maksimum səviyyəyə çatdırır.")}</Text>
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{t("Bu məqaləni faydalı hesab etdiniz?")}</Text>
          <Text style={styles.feedbackSubtitle}>{t("Rəyiniz bizim üçün önəmlidir.")}</Text>
          <Pressable onPress={() => setLiked((current) => !current)} style={[styles.likeButton, liked && styles.likeButtonActive]} accessibilityRole="button">
            <Ionicons name={liked ? "thumbs-up" : "thumbs-up-outline"} size={20} color={liked ? colors.green : colors.ink} />
            <Text style={styles.likeText}>{t(liked ? "Bəyəndiniz" : "Bəyənirəm")}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <GalleryViewerModal
        visible={galleryVisible}
        images={images}
        initialIndex={galleryIndex}
        onClose={() => setGalleryVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F6F8" },
  header: { height: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  headerButton: { width: 42, height: 42, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft },
  headerTitle: { flex: 1, marginLeft: 14, color: colors.ink, fontSize: 17, fontWeight: "700" },
  headerSpacer: { width: 42 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 28 },
  cover: { width: "100%", height: 238, backgroundColor: colors.soft },
  coverTag: { position: "absolute", left: 16, top: 16, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 13, backgroundColor: "#FFFFFF" },
  coverTagText: { color: colors.brand, fontSize: 13, fontWeight: "800" },
  articleCard: { marginHorizontal: 14, marginTop: -1, paddingHorizontal: 18, paddingVertical: 18, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: "#FFFFFF" },
  category: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  title: { marginTop: 7, color: colors.ink, fontSize: 24, fontWeight: "800" },
  metaRow: { minHeight: 45, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  metaText: { marginRight: 7, color: colors.muted, fontSize: 13, fontWeight: "600" },
  authorRow: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: 10 },
  authorAvatar: { width: 42, height: 42, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.paleBrand },
  authorName: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: "700" },
  articleBody: { marginHorizontal: 14, marginTop: 14, paddingHorizontal: 17, paddingVertical: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFFFF" },
  paragraph: { color: "#252C3B", fontSize: 15, lineHeight: 25, marginBottom: 20 },
  sectionTitle: { marginTop: 9, marginBottom: 10, color: colors.ink, fontSize: 19, lineHeight: 26, fontWeight: "800" },
  gallerySection: { marginHorizontal: -17, marginBottom: 25 },
  slide: { width: pageWidth, height: 235, paddingHorizontal: 17, alignItems: "center", justifyContent: "center", position: "relative" },
  slideImage: { width: "100%", height: "100%", borderRadius: 14, backgroundColor: "#F2F3F5" },
  expandIcon: { position: "absolute", right: 27, bottom: 10, width: 34, height: 34, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.95)" },
  pagination: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 5, backgroundColor: "#D5D8DF" },
  dotActive: { backgroundColor: colors.brand, width: 9, height: 9 },
  feedbackCard: { margin: 16, padding: 18, borderRadius: 17, backgroundColor: "#F1F2F4" },
  feedbackTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  feedbackSubtitle: { marginTop: 4, color: colors.muted, fontSize: 13 },
  likeButton: { minHeight: 48, marginTop: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 13, backgroundColor: "#FFFFFF" },
  likeButtonActive: { borderColor: colors.green, backgroundColor: "#F0FFF8" },
  likeText: { color: colors.ink, fontSize: 14, fontWeight: "700" },
});
