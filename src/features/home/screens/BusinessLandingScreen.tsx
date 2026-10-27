import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { useI18n } from "../../../i18n/I18nProvider";

type Props = { onBack: () => void };
type PlanId = "start" | "business" | "premium";

const plans: { id: PlanId; title: string; price: number; icon: keyof typeof Ionicons.glyphMap; color: string; background: string; features: string[] }[] = [
  { id: "start", title: "START", price: 49, icon: "business-outline", color: "#20BF8F", background: "#E9FBF4", features: ["Biznes səhifəsi", "Subdomain (biznesiniz.axtar.az)", "50 aktiv elan", "Qalereya (15 şəkil)", "Xəritə və ünvan", "İş saatları", "Standart dəstək"] },
  { id: "business", title: "BUSINESS", price: 99, icon: "stats-chart", color: "#F83249", background: "#FFF0F2", features: ["Start paketin bütün imkanları", "300 aktiv elan", "Sosial şəbəkə keçidləri", "Prioritet biznes nişanı", "Qalereya (30 şəkil)", "Prioritet dəstək"] },
  { id: "premium", title: "PREMIUM", price: 199, icon: "diamond-outline", color: "#7539F7", background: "#F4EDFF", features: ["Business paketin bütün imkanları", "Ana səhifə karuseli", "Kateqoriyalarda ön sıralar", "Axtarış nəticələrində üstünlük", "Qalereya (100 şəkil)", "Premium görünüş", "Reklam və kampaniya dəstəyi", "Prioritet dəstək"] },
];

const faqs = [
  { question: "Biznes yaratmaq nə qədər çəkir?", answer: "Məlumatları doldurduqdan sonra biznes səhifəniz qısa müddətdə aktivləşir." },
  { question: "Ödənişi necə edə bilərəm?", answer: "Ödəniş üsulları biznes qeydiyyatı mərhələsində təqdim olunacaq." },
  { question: "Paketi dəyişmək mümkündür?", answer: "Paketi biznes səhifənizin idarəetmə bölməsindən dəyişə bilərsiniz." },
  { question: "Sonradan paketi dəyişə bilərəm?", answer: "Bəli, paket müddəti ərzində planınızı yüksəldə bilərsiniz." },
  { question: "Subdomain nədir?", answer: "Biznes səhifəniz üçün biznesiniz.axtar.az formatında ayrıca keçiddir." },
  { question: "Texniki dəstək necə olur?", answer: "Dəstək seçdiyiniz paketə uyğun təqdim edilir." },
];

export function BusinessLandingScreen({ onBack }: Props) {
  const { t } = useI18n();
  const [duration, setDuration] = useState(30);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("business");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onBack} accessibilityRole="button" accessibilityLabel={t("Geri")}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.topTitle}>{t("Biznes səhifəsi")}</Text>
        <View style={styles.topSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>Axtar<Text style={styles.brandAccent}>.az</Text></Text>
            <Text style={styles.brandTag}>{t("BİZNES SƏHİFƏSİ")}</Text>
          </View>
          <Text style={styles.heroTitle}>{t("Biznesinizi")} <Text style={styles.brandAccent}>Axtar.az</Text>{t("-da yaradın")}</Text>
          <Text style={styles.heroText}>{t("Öz biznes səhifənizi yaradın, məhsul və xidmətlərinizi nümayiş etdirin, daha çox müştəri əldə edin və satışlarınızı artırın.")}</Text>
          {["Daha çox müştəri və görünürlük", "Güvənli və peşəkar imic", "Sadə idarəetmə paneli", "Reklam və tanıtım imkanları", "7/24 texniki dəstək"].map((item) => (
            <View key={item} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={19} color={colors.brand} />
              <Text style={styles.benefitText}>{t(item)}</Text>
            </View>
          ))}
          <Image
            source={require("../../../../assets/images/biznesimg.jpeg")}
            style={styles.businessPreviewImage}
            resizeMode="contain"
            accessibilityLabel={t("Biznes səhifəsinin mobil və kompüter önbaxışı")}
          />
        </View>

        <Text style={styles.sectionTitle}>{t("BİZNES PAKETLƏRİ")}</Text>
        <View style={styles.durationGrid}>
          {[30, 60, 90, 180].map((days) => {
            const active = duration === days;
            return (
              <Pressable key={days} onPress={() => setDuration(days)} style={[styles.durationButton, active && styles.durationButtonActive]} accessibilityRole="button" accessibilityState={{ selected: active }}>
                <Text style={[styles.durationText, active && styles.durationTextActive]}>{days} {t("gün")}</Text>
              </Pressable>
            );
          })}
        </View>

        {plans.map((plan) => {
          const selected = selectedPlan === plan.id;
          const termPrice = Math.round(plan.price * duration / 30);
          return (
            <View key={plan.id} style={[styles.planCard, selected && { borderColor: plan.color, backgroundColor: plan.background + "35" }]}>
              {plan.id === "business" ? <Text style={styles.popularTag}>{t("ƏN ÇOX SEÇİLƏN")}</Text> : null}
              {selected ? <Text style={[styles.selectedTag, { backgroundColor: plan.color }]}>{t("Seçilmiş paket")}</Text> : null}
              <Text style={[styles.planTitle, { color: plan.color }]}>{t(plan.title)}</Text>
              <Text style={styles.planPrice}>{termPrice} AZN <Text style={styles.planTerm}>/ {duration} {t("gün")}</Text></Text>
              <View style={[styles.planIcon, { backgroundColor: plan.background }]}>
                <Ionicons name={plan.icon} size={31} color={plan.color} />
              </View>
              <View style={styles.featureList}>
                {plan.features.map((feature) => (
                  <View key={feature} style={styles.featureRow}>
                    <Ionicons name="checkmark" size={17} color={plan.color} />
                    <Text style={styles.featureText}>{t(feature)}</Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={() => setSelectedPlan(plan.id)} style={[styles.planButton, selected && { backgroundColor: plan.color, borderColor: plan.color }]} accessibilityRole="button">
                <Text style={[styles.planButtonText, selected && styles.planButtonTextSelected]}>{t(selected ? "Seçildi" : "Seç")}</Text>
              </Pressable>
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, styles.faqTitle]}>{t("TEZ-TEZ VERİLƏN SUALLAR")}</Text>
        {faqs.map((faq, index) => {
          const expanded = openFaq === index;
          return (
            <Pressable key={faq.question} onPress={() => setOpenFaq(expanded ? -1 : index)} style={styles.faqItem} accessibilityRole="button" accessibilityState={{ expanded }}>
              <View style={styles.faqQuestionRow}>
                <Text style={styles.faqQuestion}>{t(faq.question)}</Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={19} color={colors.muted} />
              </View>
              {expanded ? <Text style={styles.faqAnswer}>{t(faq.answer)}</Text> : null}
            </Pressable>
          );
        })}

        <View style={styles.ctaCard}>
          <Image
            source={require("../../../../assets/images/imglog.png")}
            style={styles.customerProofImage}
            resizeMode="contain"
            accessibilityLabel={t("Axtar.az istifadəçiləri və rəyləri")}
          />
          <Text style={styles.ctaTitle}>{t("Artıq 1000+ biznes Axtar.az-da!")}</Text>
          <Text style={styles.ctaText}>{t("Siz də indi qoşulun, biznesinizi internetdə böyüdün, daha çox müştəriyə çatın.")}</Text>
          <Pressable
            style={styles.ctaButton}
            onPress={() => Alert.alert(t("Biznes yarat"), t("Biznes qeydiyyatı növbəti mərhələdə açılacaq."))}
            accessibilityRole="button"
          >
            <Text style={styles.ctaButtonText}>{t("Biznes yarat")}</Text>
            <Ionicons name="arrow-forward" size={22} color={colors.white} />
          </Pressable>
        </View>
        <View style={styles.serviceList}>
          {[
            ["business-outline", "Sürətli aktivləşdirmə", "1 saat ərzində"],
            ["shield-checkmark-outline", "Təhlükəsiz ödəniş", "100% qorunur"],
            ["time-outline", "Daimi dəstək", "Hər gün 09:00 - 18:00"],
            ["megaphone-outline", "Reklam dəstəyi", "Meta reklam təlimatı və dəstək"],
          ].map(([icon, title, subtitle]) => (
            <View key={title} style={styles.serviceRow}>
              <View style={styles.serviceIcon}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={21} color={colors.brand} /></View>
              <View><Text style={styles.serviceTitle}>{t(title)}</Text><Text style={styles.serviceSubtitle}>{t(subtitle)}</Text></View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  topBar: { minHeight: 58, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.white },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F5F7" },
  topTitle: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: "700" },
  topSpacer: { width: 12 },
  content: { paddingBottom: 28, backgroundColor: "#FFFFFF" },
  hero: { paddingHorizontal: 20, paddingTop: 22 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  brand: { color: "#16295D", fontSize: 27, fontWeight: "900", letterSpacing: -1 },
  brandAccent: { color: "#F83249" },
  brandTag: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 6, overflow: "hidden", color: "#F83249", backgroundColor: "#FFF0F2", fontSize: 11, fontWeight: "800" },
  heroTitle: { marginTop: 24, color: "#16295D", fontSize: 29, lineHeight: 36, fontWeight: "900", letterSpacing: -0.8 },
  heroText: { marginTop: 14, color: "#65728A", fontSize: 15, lineHeight: 24 },
  benefitRow: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 10 },
  benefitText: { color: "#283447", fontSize: 14, fontWeight: "700" },
  businessPreviewImage: { width: "100%", height: 177, alignSelf: "center", marginTop: 22, marginBottom: 26 },
  sectionTitle: { marginHorizontal: 20, marginTop: 4, marginBottom: 15, color: "#16295D", fontSize: 21, fontWeight: "900", textAlign: "center" },
  durationGrid: { paddingHorizontal: 18, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  durationButton: { width: "47%", minHeight: 47, alignItems: "center", justifyContent: "center", borderRadius: 11, borderWidth: 1, borderColor: "#DCE4EF", backgroundColor: colors.white },
  durationButtonActive: { borderColor: "#F83249", backgroundColor: "#FFF7F8" },
  durationText: { color: "#364358", fontSize: 15, fontWeight: "800" },
  durationTextActive: { color: "#F83249" },
  planCard: { marginHorizontal: 16, marginTop: 26, paddingHorizontal: 18, paddingTop: 28, paddingBottom: 18, alignItems: "center", borderRadius: 20, borderWidth: 1, borderColor: "#E0E7F2", backgroundColor: colors.white },
  popularTag: { position: "absolute", top: -13, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9, overflow: "hidden", color: colors.white, backgroundColor: "#F83249", fontSize: 10, fontWeight: "900" },
  selectedTag: { position: "absolute", top: 15, right: 14, paddingHorizontal: 11, paddingVertical: 6, overflow: "hidden", borderRadius: 14, color: colors.white, fontSize: 9, fontWeight: "800" },
  planTitle: { marginTop: 4, fontSize: 25, fontWeight: "900" },
  planPrice: { marginTop: 9, color: "#16295D", fontSize: 24, fontWeight: "900" },
  planTerm: { color: "#556174", fontSize: 13, fontWeight: "700" },
  planIcon: { width: 68, height: 68, marginTop: 20, marginBottom: 15, alignItems: "center", justifyContent: "center", borderRadius: 36 },
  featureList: { alignSelf: "stretch", gap: 13, marginTop: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { flex: 1, color: "#414A5B", fontSize: 13, lineHeight: 19, fontWeight: "700" },
  planButton: { alignSelf: "stretch", minHeight: 48, marginTop: 18, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 2, borderColor: "#DDE4EE" },
  planButtonText: { color: "#39465A", fontSize: 16, fontWeight: "900" },
  planButtonTextSelected: { color: colors.white },
  faqTitle: { marginTop: 34 },
  faqItem: { marginHorizontal: 16, marginBottom: 11, padding: 16, borderRadius: 13, borderWidth: 1, borderColor: "#E0E7F2", backgroundColor: colors.white },
  faqQuestionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  faqQuestion: { flex: 1, color: "#283447", fontSize: 14, fontWeight: "800" },
  faqAnswer: { marginTop: 12, color: "#65728A", fontSize: 13, lineHeight: 20 },
  ctaCard: { marginTop: 25, paddingHorizontal: 20, paddingVertical: 27, alignItems: "center", backgroundColor: "#FFF3F4" },
  customerProofImage: { width: "100%", height: 135, alignSelf: "center", marginBottom: 18 },
  ctaTitle: { color: "#16295D", fontSize: 25, fontWeight: "900", textAlign: "center" },
  ctaText: { marginTop: 12, color: "#65728A", fontSize: 15, lineHeight: 23, fontWeight: "600", textAlign: "center" },
  ctaButton: { width: "100%", minHeight: 58, marginTop: 24, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12, backgroundColor: "#F83249", elevation: 3 },
  ctaButtonText: { color: colors.white, fontSize: 19, fontWeight: "900" },
  serviceList: { paddingHorizontal: 22, paddingVertical: 16, gap: 19 },
  serviceRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  serviceIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 25, backgroundColor: "#FFF0F2" },
  serviceTitle: { color: "#16295D", fontSize: 15, fontWeight: "800" },
  serviceSubtitle: { marginTop: 5, color: "#65728A", fontSize: 13, fontWeight: "600" },
});
