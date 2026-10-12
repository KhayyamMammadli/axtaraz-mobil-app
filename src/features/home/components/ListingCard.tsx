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
        {listing.badge ? (
          <View style={styles.badge}>
            <Ionicons name={listing.badge === "VIP" ? "ribbon" : "diamond"} size={11} color={colors.white} />
            <Text style={styles.badgeText}>{listing.badge}</Text>
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"}
          onPress={toggleFavorite}
          hitSlop={8}
          style={styles.favorite}
        >
          <Ionicons name={saved ? "heart" : "heart-outline"} size={18} color={saved ? colors.brand : colors.ink} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.price}>{listing.price}</Text>
        <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={13} color={colors.muted} />
          <Text style={styles.metaText}>{listing.location}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText} numberOfLines={1}>{listing.age}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, overflow: "hidden", borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  imageWrap: { height: 138, backgroundColor: colors.soft, position: "relative" },
  image: { width: "100%", height: "100%" },
  badge: { position: "absolute", left: 9, top: 9, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, backgroundColor: colors.brand },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "800", letterSpacing: 0.4 },
  favorite: { position: "absolute", right: 9, top: 9, width: 31, height: 31, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.94)" },
  body: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 11 },
  price: { color: colors.ink, fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  title: { color: colors.ink, fontSize: 12, lineHeight: 17, minHeight: 34, marginTop: 4, fontWeight: "500" },
  meta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  metaText: { color: colors.muted, fontSize: 10, flexShrink: 1 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.subtle, marginHorizontal: 1 },
});
