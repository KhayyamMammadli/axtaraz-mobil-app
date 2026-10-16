import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuPage = "menu" | "about" | "rules";
type MenuLink = { title: string; icon: keyof typeof Ionicons.glyphMap; page: Exclude<MenuPage, "menu"> };

const menuLinks: MenuLink[] = [
  { title: "Haqqımızda", icon: "flag", page: "about" },
  { title: "Qaydalar", icon: "document-text", page: "rules" },
];

const pageContent: Record<Exclude<MenuPage, "menu">, { title: string; body: string }> = {
  about: {
    title: "Haqqımızda",
    body: "Axtar.az Azərbaycanın ən yeni, ən sərfəli və ən yenilikçi elan platformasıdır. Bizimlə iş görmək sizə sərf edəcək.",
  },
  rules: {
    title: "Qaydalar",
    body: "Saytda yerləşdirilmiş elanların məzmununa görə Axtar.az məsuliyyət daşımır. Satıcı ilə alıcı arasında baş verən razılaşmalara görə sayt məsuliyyət daşımır.",
  },
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function MenuModal({ visible, onClose }: Props) {
  const [page, setPage] = useState<MenuPage>("menu");
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (visible) {
      setPage("menu");
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [visible]);

  const openContact = () => {
    setPage("menu");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 300, animated: true }));
  };

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Açılmadı", "Bu əməliyyat üçün uyğun tətbiq tapılmadı.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => (page === "menu" ? onClose() : setPage("menu"))}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          {page === "menu" ? (
            <Text accessibilityLabel="Axtar.az" style={styles.wordmark}>
              axtar.az
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Menyuya qayıt"
              onPress={() => setPage("menu")}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={22} color="#17191F" />
            </Pressable>
          )}
          {page !== "menu" ? (
            <Text style={styles.pageTitle}>{pageContent[page].title}</Text>
          ) : null}
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Menyunu bağla"
            hitSlop={6}
          >
            <Ionicons name="close" size={25} color="#17191F" />
          </Pressable>
        </View>

        {page === "menu" ? (
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.navigation}>
              {menuLinks.map((item) => (
                <Pressable
                  key={item.page}
                  onPress={() => setPage(item.page)}
                  style={({ pressed }) => [styles.navigationRow, pressed && styles.pressed]}
                  accessibilityRole="button"
                >
                  <Ionicons name={item.icon} size={24} color="#C6CBD3" />
                  <Text style={styles.navigationLabel}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#C6CBD3" />
                </Pressable>
              ))}
              <Pressable
                onPress={openContact}
                style={({ pressed }) => [styles.navigationRow, pressed && styles.pressed]}
                accessibilityRole="button"
              >
                <Ionicons name="call" size={24} color="#C6CBD3" />
                <Text style={styles.navigationLabel}>Əlaqə</Text>
                <Ionicons name="chevron-forward" size={18} color="#C6CBD3" />
              </Pressable>
            </View>

            <View style={styles.separator} />

            <View style={styles.contactList}>
              <ContactRow
                icon="at"
                label="Email:"
                value="support@axtar.az"
                onPress={() => openUrl("mailto:support@axtar.az")}
              />
              <ContactRow
                icon="call"
                label="Nömrə:"
                value="+99450 000 00 00"
                onPress={() => openUrl("tel:+994500000000")}
              />
              <ContactRow
                icon="location"
                label="Ünvan:"
                value="Bəşir Abbasquluzadə 46/2"
                onPress={() =>
                  openUrl("https://maps.google.com/?q=B%C9%99%C5%9Fir+Abbasquluzad%C9%99+46%2F2+Baku")
                }
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.socialSection}>
              <Text style={styles.sectionLabel}>Sosial şəbəkələr</Text>
              <View style={styles.socialRow}>
                <SocialIcon name="logo-facebook" color="#1687E8" label="Facebook" />
                <SocialIcon name="logo-instagram" color="#D94282" label="Instagram" />
                <SocialIcon name="logo-linkedin" color="#0A66C2" label="LinkedIn" />
                <SocialIcon name="logo-whatsapp" color="#2FBE63" label="WhatsApp" />
              </View>
            </View>

            <View style={styles.paymentSection}>
              <PaymentMark label=" Pay" style={styles.applePay} />
              <PaymentMark label="stripe" style={styles.stripe} />
              <PaymentMark label="AMEX" style={styles.amex} />
              <PaymentMark label="amazon pay" style={styles.amazonPay} />
              <PaymentMark label="●●" style={styles.mastercard} />
              <PaymentMark label="VISA" style={styles.visa} />
            </View>

            <Text style={styles.copyright}>© Müəllif hüquqları qorunur ©2025</Text>
          </ScrollView>
        ) : (
          <View style={styles.detailPage}>
            <View style={styles.detailIcon}>
              <Ionicons
                name={page === "about" ? "information-circle-outline" : "shield-checkmark-outline"}
                size={30}
                color="#F14350"
              />
            </View>
            <Text style={styles.detailTitle}>{pageContent[page].title}</Text>
            <Text style={styles.detailBody}>{pageContent[page].body}</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.contactRow, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${value}`}
    >
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={20} color="#17191F" />
      </View>
      <View style={styles.contactCopy}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#C6CBD3" />
    </Pressable>
  );
}

function SocialIcon({
  name,
  color,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
}) {
  return (
    <View style={styles.socialItem} accessibilityLabel={label}>
      <Ionicons name={name} size={27} color={color} />
    </View>
  );
}

function PaymentMark({ label, style }: { label: string; style: ViewStyle }) {
  return (
    <View style={[styles.paymentMark, style]}>
      <Text style={styles.paymentText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    minHeight: 82,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7E9ED",
  },
  wordmark: { flex: 1, color: "#F3434A", fontSize: 30, fontWeight: "900", letterSpacing: -1.3 },
  pageTitle: { flex: 1, marginLeft: 14, color: "#17191F", fontSize: 18, fontWeight: "800" },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#F3F4F6" },
  closeButton: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F2F4" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 12 },
  navigation: { paddingHorizontal: 26, paddingTop: 22, paddingBottom: 19 },
  navigationRow: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: 18, paddingHorizontal: 10, borderRadius: 14 },
  navigationLabel: { flex: 1, color: "#101116", fontSize: 22, fontWeight: "800", letterSpacing: -0.45 },
  pressed: { backgroundColor: "#F7F8FA" },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#E5E8ED", marginHorizontal: 20 },
  contactList: { paddingHorizontal: 23, paddingTop: 14, paddingBottom: 12 },
  contactRow: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 6, borderRadius: 12 },
  contactIcon: { width: 34, alignItems: "center" },
  contactCopy: { flex: 1, gap: 3 },
  contactLabel: { color: "#AEB2BA", fontSize: 14, fontWeight: "700" },
  contactValue: { color: "#17191F", fontSize: 16, fontWeight: "800" },
  socialSection: { paddingHorizontal: 26, paddingTop: 22, paddingBottom: 24 },
  sectionLabel: { color: "#AEB2BA", fontSize: 16, fontWeight: "600" },
  socialRow: { flexDirection: "row", alignItems: "center", gap: 25, marginTop: 20 },
  socialItem: { width: 32, height: 34, alignItems: "center", justifyContent: "center" },
  paymentSection: { minHeight: 74, paddingHorizontal: 24, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#E7E9ED", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  paymentMark: { minWidth: 43, height: 32, paddingHorizontal: 6, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  paymentText: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  applePay: { backgroundColor: "#08090C" },
  stripe: { backgroundColor: "#635BFF" },
  amex: { backgroundColor: "#3478C8" },
  amazonPay: { backgroundColor: "#333941" },
  mastercard: { backgroundColor: "#111318" },
  visa: { backgroundColor: "#263DC8" },
  copyright: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 8, color: "#24262D", fontSize: 14, fontWeight: "700" },
  detailPage: { flex: 1, paddingHorizontal: 24, paddingTop: 36 },
  detailIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0F1" },
  detailTitle: { marginTop: 22, color: "#17191F", fontSize: 24, fontWeight: "800" },
  detailBody: { marginTop: 12, color: "#545965", fontSize: 16, lineHeight: 25 },
});
