import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import type { Listing } from "../data/homeData";

type Props = { listing: Listing; onFavoriteChange?: (id: string, saved: boolean) => void };

export function ListingCard({ listing, onFavoriteChange }: Props) {
  const [saved, setSaved] = useState(false);

  const toggleFavorite = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    onFavoriteChange?.(listing.id, nextSaved);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: listing.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="alert-circle" size={11} color={colors.white} />
            <Text style={styles.badgeText}>İTKİN</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="search" size={11} color={colors.brand} />
            <Text style={[styles.badgeText, styles.searchBadgeText]}>AXTARILIR</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"}
          onPress={toggleFavorite}
          hitSlop={8}
          style={styles.favorite}
        >
          <Ionicons name={saved ? "heart" : "heart-outline"} size={19} color={saved ? colors.brand : colors.ink} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
        <View style={styles.meta}>
          <Ionicons name="location" size={12} color={colors.muted} />
          <Text style={styles.metaText}>{listing.location}</Text>
          <Text style={styles.metaSeparator}>·</Text>
          <Text style={styles.metaText} numberOfLines={1}>{listing.age}</Text>
          <View style={styles.serviceBadges}>
            {listing.badge ? <Ionicons name={listing.badge === "VIP" ? "diamond" : "ribbon"} size={13} color={colors.gold} /> : null}
            <Ionicons name="flash" size={13} color={colors.gold} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, overflow: "hidden", borderRadius: 13, backgroundColor: "#FFF9F7" },
  imageWrap: { width: "100%", aspectRatio: 0.98, backgroundColor: colors.soft, position: "relative", borderRadius: 13, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  badges: { position: "absolute", left: 8, top: 8, gap: 4 },
  badge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7, backgroundColor: "#FFF9F7" },
  badgeText: { color: colors.brand, fontSize: 8, fontWeight: "800", letterSpacing: 0.3 },
  searchBadgeText: { color: colors.brand },
  favorite: { position: "absolute", right: 9, top: 9, width: 34, height: 34, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.95)" },
  body: { paddingHorizontal: 9, paddingTop: 8, paddingBottom: 9 },
  price: { color: colors.brand, fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  title: { color: colors.ink, fontSize: 11, lineHeight: 15, minHeight: 30, marginTop: 4, fontWeight: "500" },
  meta: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 7, minHeight: 17 },
  metaText: { color: colors.muted, fontSize: 8, flexShrink: 1 },
  metaSeparator: { color: colors.subtle, fontSize: 10 },
  serviceBadges: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 4 },
});
