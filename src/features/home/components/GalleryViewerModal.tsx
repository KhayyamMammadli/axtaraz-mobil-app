import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

type Props = {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  onCall?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export function GalleryViewerModal({
  visible,
  images,
  initialIndex = 0,
  onClose,
  onCall,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const listRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!visible) return;
    const index = Math.max(0, Math.min(initialIndex, images.length - 1));
    setActiveIndex(index);
    setZoom(1);
    requestAnimationFrame(() => listRef.current?.scrollTo({ x: index * screenWidth, animated: false }));
  }, [visible, initialIndex, images.length]);

  const close = () => {
    setZoom(1);
    onClose();
  };

  const changeImage = (index: number) => {
    setActiveIndex(index);
    setZoom(1);
    listRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen" onRequestClose={close}>
      <StatusBar hidden />
      <View style={styles.screen}>
        <View style={styles.toolbar}>
          <Pressable style={styles.control} onPress={() => setZoom((value) => Math.max(1, value - 0.5))} accessibilityLabel="Kiçilt">
            <Ionicons name="remove" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.control} onPress={() => setZoom(1)} accessibilityLabel="Ölçünü sıfırla">
            <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
          </Pressable>
          <Pressable style={styles.control} onPress={() => setZoom((value) => Math.min(3, value + 0.5))} accessibilityLabel="Böyüt">
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </Pressable>
          {onCall ? (
            <Pressable style={styles.control} onPress={onCall} accessibilityLabel="Zəng et">
              <Ionicons name="call-outline" size={20} color="#FFFFFF" />
            </Pressable>
          ) : null}
          {onToggleFavorite ? (
            <Pressable style={styles.control} onPress={onToggleFavorite} accessibilityLabel="Seçilmişlər">
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={21} color={isFavorite ? colors.brand : "#FFFFFF"} />
            </Pressable>
          ) : null}
          <Pressable style={styles.control} onPress={close} accessibilityLabel="Bağla">
            <Ionicons name="close" size={25} color="#FFFFFF" />
          </Pressable>
        </View>

        {images.length ? (
          <ScrollView
            ref={listRef}
            horizontal
            pagingEnabled
            snapToInterval={screenWidth}
            decelerationRate="fast"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: Math.min(initialIndex, images.length - 1) * screenWidth, y: 0 }}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setActiveIndex(nextIndex);
              setZoom(1);
            }}
            style={styles.pager}
          >
            {images.map((uri, index) => (
              <View key={uri + index} style={styles.page}>
                <Image
                  source={{ uri }}
                  resizeMode="contain"
                  style={[styles.photo, { transform: [{ scale: index === activeIndex ? zoom : 1 }] }]}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.empty}><Ionicons name="image-outline" size={42} color="#737783" /></View>
        )}

        <View style={styles.bottom}>
          <Text style={styles.counter}>{images.length ? activeIndex + 1 : 0} / {images.length}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnails}>
            {images.map((uri, index) => (
              <Pressable key={uri + index} onPress={() => changeImage(index)} style={[styles.thumb, activeIndex === index && styles.thumbActive]}>
                <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#07080B", justifyContent: "center" },
  toolbar: { position: "absolute", zIndex: 2, top: 12, left: 10, right: 10, minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 7 },
  control: { minWidth: 38, height: 38, paddingHorizontal: 8, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(24,25,31,0.78)" },
  zoomText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  pager: { flex: 1 },
  page: { width: screenWidth, height: screenHeight, alignItems: "center", justifyContent: "center", paddingVertical: 76 },
  photo: { width: screenWidth, height: screenHeight * 0.72 },
  bottom: { position: "absolute", left: 0, right: 0, bottom: 18, alignItems: "center" },
  counter: { color: "#FFFFFF", fontSize: 13, fontWeight: "700", marginBottom: 12 },
  thumbnails: { gap: 8, paddingHorizontal: 14 },
  thumb: { width: 56, height: 56, overflow: "hidden", borderRadius: 8, borderWidth: 2, borderColor: "transparent" },
  thumbActive: { borderColor: colors.brand },
  thumbImage: { width: "100%", height: "100%" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
