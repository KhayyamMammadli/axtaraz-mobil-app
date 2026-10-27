import { useState, type ReactNode } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ui } from "../../../theme/metrics";
import { colors } from "../../../theme/colors";

type Props = { onBack: () => void };
type SectionId = "general" | "visual" | "hours" | "contact" | "subdomain" | "address";
type Draft = { category: string; city: string; name: string; slogan: string; about: string; phone: string; address: string };

const initialDraft: Draft = { category: "", city: "", name: "", slogan: "", about: "", phone: "", address: "" };
const sectionTitles: Record<SectionId, string> = {
  general: "Ümumi məlumatlar", visual: "Vizual materiallar", hours: "İş saatları",
  contact: "Əlaqə məlumatları", subdomain: "Subdomain", address: "Ünvan",
};

export function BusinessCreateScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [draft, setDraft] = useState(initialDraft);
  const [expanded, setExpanded] = useState<Record<SectionId, boolean>>({ general: true, visual: true, hours: false, contact: false, subdomain: false, address: false });
  const [plan, setPlan] = useState("BUSINESS");
  const [duration, setDuration] = useState(30);
  const [agreed, setAgreed] = useState(true);

  const update = (key: keyof Draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const toggle = (id: SectionId) => setExpanded((current) => ({ ...current, [id]: !current[id] }));
  const field = (label: string, key: keyof Draft, placeholder: string, multiline = false, required = false) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{required ? <Text style={styles.required}> *</Text> : null}</Text>
      <TextInput
        value={draft[key]}
        onChangeText={(value) => update(key, value)}
        placeholder={placeholder}
        placeholderTextColor="#9AA5B7"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textarea]}
      />
      {key === "about" ? <Text style={styles.counter}>{draft.about.length}/1000</Text> : null}
      {key === "slogan" ? <Text style={styles.counter}>{draft.slogan.length}/80</Text> : null}
    </View>
  );
  const select = (label: string, key: "category" | "city", placeholder: string, required = false) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{required ? <Text style={styles.required}> *</Text> : null}</Text>
      <Pressable style={styles.select} onPress={() => Alert.alert(label, "Seçim edin", (key === "category" ? ["Geyim və aksesuar", "Ev və bağ", "Xidmətlər", "Elektronika", "Digər"] : ["Bakı", "Gəncə", "Sumqayıt", "Şəki", "Lənkəran"]).map((option) => ({ text: option, onPress: () => update(key, option) })))}>
        <Text style={[styles.selectText, !draft[key] && styles.placeholder]}>{draft[key] || placeholder}</Text>
        <Ionicons name="chevron-down" size={18} color="#172653" />
      </Pressable>
    </View>
  );
  const section = (id: SectionId, content: ReactNode, note?: string) => (
    <View style={styles.sectionCard} key={id}>
      <Pressable style={styles.sectionHeader} onPress={() => toggle(id)} accessibilityRole="button" accessibilityState={{ expanded: expanded[id] }}>
        <View style={styles.redMark} />
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>{sectionTitles[id]}</Text>
          {note ? <Text style={styles.sectionNote}>{note}</Text> : null}
        </View>
        <Ionicons name={expanded[id] ? "chevron-up" : "chevron-down"} size={20} color="#172653" />
      </Pressable>
      {expanded[id] ? <View style={styles.sectionBody}>{content}</View> : null}
    </View>
  );

  if (previewVisible) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.previewTop}>
          <Pressable style={styles.previewBack} onPress={() => setPreviewVisible(false)}><Ionicons name="chevron-back" size={20} color="#111827" /><Text style={styles.previewBackText}>Redaktəyə qayıt</Text></Pressable>
          <Text style={styles.previewHeading}>Ön baxış</Text>
        </View>
        <ScrollView style={styles.previewScroll} contentContainerStyle={styles.previewContent}>
          <View style={styles.previewCover}><Ionicons name="image-outline" size={42} color="#8B96A7" /></View>
          <View style={styles.profileCard}>
            <View style={styles.previewLogo}><Ionicons name="image-outline" size={27} color="#8B96A7" /></View>
            <View style={styles.profileNameBlock}>
              <Text style={styles.profileName}>{draft.name || "Biznesin adı"}</Text>
              <Text style={styles.premiumBadge}>◯  {plan === "PREMIUM" ? "Premium" : plan}</Text>
              <Text style={styles.profileMeta}>{draft.category || "Kateqoriya seçilməyib"}</Text>
              <Text style={styles.rating}>⭐  4.9 (230 rəy)</Text>
            </View>
            <View style={styles.profileActions}>
              <Pressable style={styles.outlineAction}><Ionicons name="eye-outline" size={17} color="#3478F6" /><Text style={styles.blueText}>İzlə</Text></Pressable>
              <Pressable style={[styles.outlineAction, styles.redOutline]}><Text style={styles.redText}>Mesaj yaz</Text></Pressable>
              <Pressable style={[styles.outlineAction, styles.phoneAction]}><Ionicons name="call" size={17} color="#18AE62" /><Text style={styles.greenText}>{draft.phone || "+994 55 123 45 67"}</Text></Pressable>
            </View>
            <View style={styles.stats}>
              <Stat icon="bag-handle" number="568" label="Elan" />
              <Stat icon="diamond" number="12 845" label="Baxış" />
              <Stat icon="people" number="312" label="İzləyici" />
            </View>
            <Text style={styles.previewInfo}>⌖  {draft.address || "Ünvan seçilməyib"}</Text>
            <Text style={styles.previewInfo}>    Hər gün 09:00 - 18:00</Text>
            <Text style={styles.openText}>Açıqdır  ﹀</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewTabs}>
              {["＋ Haqqımızda", "🛒 Təkliflər", "▣ Qalereya", "Rəylər (2)"].map((item) => <Text key={item} style={styles.previewTab}>{item}</Text>)}
            </ScrollView>
            <Text style={styles.aboutText}>{draft.about || "Biznesiniz haqqında yazdığınız məlumat burada görünəcək."}</Text>
            <Text style={styles.galleryTitle}>Qalereya</Text>
            <View style={styles.galleryGrid}>{[1, 2, 3, 4].map((item) => <View key={item} style={styles.galleryTile} />)}</View>
          </View>
        </ScrollView>
        <View style={styles.previewFooter}>
          <Pressable style={[styles.returnButton, styles.previewReturnButton]} onPress={() => setPreviewVisible(false)}><Text style={styles.returnText}>Redaktəyə qayıt</Text></Pressable>
          <Pressable style={[styles.submitButton, styles.previewSubmitButton]} onPress={() => Alert.alert("Yoxlamaya göndər", "Məlumatları göndərmək üçün əvvəlcə biznes qeydiyyatını tamamlayın.")}><Text style={styles.submitText} numberOfLines={1}>Yoxlamaya göndər</Text></Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onBack}><Ionicons name="arrow-back" size={22} color="#111827" /></Pressable>
        <Text style={styles.topTitle}>Yeni biznes yarat</Text>
      </View>
      <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.stepTitle}>1. Paket seçimi</Text>
        <Text style={styles.stepSubtitle}>Ehtiyacınıza ən uyğun paketi seçərək başlayın.</Text>
        <View style={styles.planTabs}>{["START", "BUSINESS", "PREMIUM"].map((item) => <Pressable key={item} onPress={() => setPlan(item)} style={[styles.planTab, plan === item && styles.planTabActive]}><Text style={[styles.planTabText, plan === item && styles.planTabTextActive]}>{item}</Text></Pressable>)}</View>
        <View style={styles.planCard}>
          <View style={styles.planIcon}><Ionicons name="stats-chart" size={31} color="#F83249" /></View>
          <View style={styles.planCopy}><Text style={styles.planName}>{plan}</Text><Text style={styles.price}>{Math.round(({ START: 49, BUSINESS: 99, PREMIUM: 199 }[plan as "START" | "BUSINESS" | "PREMIUM"] * duration) / 30)} AZN<Text style={styles.period}> / {duration} gün</Text></Text></View>
          <Text style={styles.chosen}>seçili</Text>
          {["Qalereya (30 şəkil)", "Premium görünüş", "Ana səhifədə üstünlük", "Ətraflı statistika", "Prioritet dəstək"].map((item) => <View key={item} style={styles.feature}><Ionicons name="checkmark" size={18} color="#19BE69" /><Text style={styles.featureText}>{item}</Text></View>)}
          <View style={styles.planSelected}><Text style={styles.planSelectedText}>Seçildi  ✓</Text></View>
        </View>
        <View style={styles.durationRow}>{[30, 60, 90, 180].map((days) => <Pressable key={days} onPress={() => setDuration(days)} style={[styles.duration, duration === days && styles.durationActive]}><Text style={[styles.durationText, duration === days && styles.durationTextActive]}>{days} gün{duration === days ? "\nseçili" : ""}</Text></Pressable>)}</View>

        {section("general", <>{select("Kateqoriya", "category", "Seçin", true)}{select("Şəhər", "city", "Seçin")}{field("Biznes adı", "name", "Məs: Modern Home", false, true)}{field("Slogan (istəyə bağlı)", "slogan", "Məs: Eviniz üçün ən yaxşı seçimlər")}{field("Haqqımızda", "about", "Biznesiniz haqqında məlumat yazın...", true, true)}</>)}
        {section("visual", <>
          <Text style={styles.label}>Mağaza loqosu<Text style={styles.required}> *</Text></Text>
          <Pressable style={styles.uploadRow} onPress={() => Alert.alert("Loqo yüklə", "Şəkil seçimi növbəti mərhələdə qoşulacaq.")}><View style={styles.logoPlaceholder}><Ionicons name="image-outline" size={25} color="#FFFFFF" /></View><View style={styles.uploadBox}><Ionicons name="cloud-upload" size={23} color="#172653" /><Text style={styles.uploadTitle}>Loqo yüklə</Text><Text style={styles.uploadHint}>PNG, JPG (500x500px)</Text><Text style={styles.uploadHint}>və ya sürükləyib buraxın</Text></View></Pressable>
          <Text style={styles.label}>Mağazanın örtüyü (cover)<Text style={styles.required}> *</Text></Text>
          <Pressable style={styles.uploadBoxWide} onPress={() => Alert.alert("Örtük şəkli yüklə", "Şəkil seçimi növbəti mərhələdə qoşulacaq.")}><Ionicons name="cloud-upload" size={23} color="#172653" /><Text style={styles.uploadTitle}>Örtük şəkli yüklə</Text><Text style={styles.uploadHint}>və ya sürükləyib buraxın</Text></Pressable>
          <Text style={styles.galleryLabel}>Qalereya şəkilləri (istəyə bağlı)     0 / 30 şəkil</Text>
          <Pressable style={styles.uploadBoxWide} onPress={() => Alert.alert("Şəkil əlavə et", "Şəkil seçimi növbəti mərhələdə qoşulacaq.")}><Ionicons name="cloud-upload" size={23} color="#172653" /><Text style={styles.uploadTitle}>Şəkil əlavə et</Text><Text style={styles.uploadHint}>Maksimum 30 şəkil yükləyə bilərsiniz</Text></Pressable>
        </>)}
        {section("hours", <><Text style={styles.label}>İş qrafiki</Text>{["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"].map((day) => <View key={day} style={styles.dayRow}><Text style={styles.dayText}>{day}</Text><Text style={styles.timeText}>09:00  –  18:00</Text></View>)}</>)}
        {section("contact", <>{field("Əsas telefon", "phone", "+994 55 123 45 67", false, true)}<Pressable style={styles.addPhone}><Text style={styles.addPhoneText}>＋  Əlavə telefon əlavə et</Text></Pressable></>)}
        {section("subdomain", <><View style={styles.subdomain}><TextInput placeholder="biznesiniz" style={styles.subdomainInput} /><Text style={styles.domain}>.axtar.az</Text></View><Text style={styles.subdomainHint}>Yalnız Premium paketində mövcuddur. Premium paket seçdikdən sonra subdomaininizi daxil edə bilərsiniz.</Text></>)}
        {section("address", <>{field("Ünvan", "address", "Məs: Bakı, Nəsimi r., Azadlıq pr. 152", false, true)}<Pressable style={styles.mapButton}><Text style={styles.mapButtonText}>⌖ Xəritədə göstər</Text></Pressable></>)}
        <Pressable style={styles.agreementRow} onPress={() => setAgreed(!agreed)}><View style={[styles.checkbox, agreed && styles.checkboxChecked]}>{agreed ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : null}</View><Text style={styles.agreement}>Axtar.az istifadəçi razılaşması ilə tanış oldum və qəbul edirəm.</Text></Pressable>
        <Pressable style={styles.submitButton} onPress={() => Alert.alert("Yoxlamaya göndər", "Form göndərilməzdən əvvəl tələb olunan məlumatları tamamlayın.")}><Ionicons name="send" size={17} color="#FFFFFF" /><Text style={styles.submitText}>Yoxlamaya göndər</Text></Pressable>
        <Text style={styles.privacy}>🔒 Məlumatlarınız admin tərəfindən yoxlanılacaq və təsdiq edildikdən sonra aktiv olacaq</Text>
      </ScrollView>
      <Pressable style={[styles.floatingPreview, { bottom: Math.max(insets.bottom, 12) + 18 }]} onPress={() => setPreviewVisible(true)} accessibilityRole="button" accessibilityLabel="Ön baxış">
        <Ionicons name="eye-outline" size={29} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

function Stat({ icon, number, label }: { icon: keyof typeof Ionicons.glyphMap; number: string; label: string }) {
  return <View style={styles.stat}><Ionicons name={icon} size={19} color="#3478F6" /><Text style={styles.statNumber}>{number}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F8FA" },
  topBar: { minHeight: 58, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E5EAF2" },
  backButton: { width: 40, height: 40, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F5F7" },
  topTitle: { color: "#111827", fontSize: ui.font.title, fontWeight: "900", letterSpacing: -0.5 },
  formContent: { paddingHorizontal: ui.space.lg, paddingTop: ui.space.xl, paddingBottom: 100 },
  stepTitle: { color: "#172653", fontSize: ui.font.title, fontWeight: "900" },
  stepSubtitle: { marginTop: ui.space.sm, color: "#66758E", fontSize: ui.font.body, lineHeight: 20, fontWeight: "700" },
  planTabs: { height: 54, marginTop: 20, flexDirection: "row", borderRadius: 17, borderWidth: 1, borderColor: "#DEE6F2", backgroundColor: "#FFFFFF", overflow: "hidden" },
  planTab: { flex: 1, alignItems: "center", justifyContent: "center", borderBottomWidth: 4, borderBottomColor: "transparent" },
  planTabActive: { borderBottomColor: "#4384FF" },
  planTabText: { color: "#172653", fontSize: ui.font.small, fontWeight: "900" },
  planTabTextActive: { color: "#3478F6" },
  planCard: { marginTop: ui.space.md, padding: ui.space.lg, borderRadius: ui.radius.card, borderWidth: 1.5, borderColor: "#FF4255", backgroundColor: "#F9FFFC" },
  planIcon: { width: 56, height: 56, marginBottom: 8, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#FFF0F2" },
  planCopy: { position: "absolute", left: 88, top: 22 },
  planName: { color: "#3478F6", fontSize: ui.font.section, fontWeight: "900" },
  price: { marginTop: 4, color: "#172653", fontSize: 20, fontWeight: "900" },
  period: { color: "#68758A", fontSize: ui.font.small, fontWeight: "700" },
  chosen: { position: "absolute", top: 20, right: 19, color: "#FFFFFF", backgroundColor: "#20C56A", borderRadius: 18, paddingHorizontal: 15, paddingVertical: 6, fontSize: 10, fontWeight: "800", overflow: "hidden" },
  feature: { marginTop: ui.space.md, flexDirection: "row", alignItems: "center", gap: 9 },
  featureText: { color: "#172653", fontSize: ui.font.body, fontWeight: "800" },
  planSelected: { height: 48, marginTop: 20, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 2, borderColor: "#9ABEFF", backgroundColor: "#FFFFFF" },
  planSelectedText: { color: "#3478F6", fontSize: 16, fontWeight: "900" },
  durationRow: { marginTop: ui.space.md, marginBottom: 30, flexDirection: "row", justifyContent: "space-between", gap: ui.space.sm },
  duration: { flex: 1, height: 62, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: "#DDE5F1", backgroundColor: "#FFFFFF" },
  durationActive: { borderWidth: 2, borderColor: "#FF4255" },
  durationText: { textAlign: "center", color: "#172653", fontSize: 13, fontWeight: "800" },
  durationTextActive: { color: "#FF4255" },
  sectionCard: { marginBottom: 14, overflow: "hidden", borderRadius: 19, borderWidth: 1, borderColor: "#DFE7F2", backgroundColor: "#FFFFFF", elevation: 2 },
  sectionHeader: { minHeight: 60, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: "#EDF0F5" },
  redMark: { width: 6, height: 38, borderRadius: 4, backgroundColor: "#FF263B" },
  sectionHeadingCopy: { flex: 1, minWidth: 0 },
  sectionTitle: { color: "#172653", fontSize: ui.font.section, lineHeight: 23, fontWeight: "900" },
  sectionNote: { marginTop: 2, color: "#69758B", fontSize: ui.font.caption, lineHeight: 15, fontWeight: "700" },
  sectionBody: { paddingHorizontal: 15, paddingTop: 16, paddingBottom: 17 },
  field: { marginBottom: 20 },
  label: { marginBottom: 8, color: "#172653", fontSize: ui.font.body, fontWeight: "900" },
  required: { color: "#FF3347" },
  input: { minHeight: ui.controlHeight, paddingHorizontal: 13, borderRadius: 8, borderWidth: 1, borderColor: "#DCE4F0", backgroundColor: "#FFFFFF", color: "#172653", fontSize: 14, fontWeight: "600" },
  textarea: { height: 150, paddingTop: 14, paddingBottom: 36 },
  counter: { position: "absolute", right: 14, bottom: 9, color: "#9AA5B7", fontSize: 12, fontWeight: "800" },
  select: { minHeight: ui.controlHeight, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 8, borderWidth: 1, borderColor: "#DCE4F0", backgroundColor: "#FFFFFF" },
  selectText: { color: "#172653", fontSize: 14, fontWeight: "700" },
  placeholder: { color: "#172653" },
  uploadRow: { marginBottom: 18, flexDirection: "row", alignItems: "center", gap: 16 },
  logoPlaceholder: { width: 68, height: 68, alignItems: "center", justifyContent: "center", borderRadius: 48, backgroundColor: "#111111" },
  uploadBox: { flex: 1, minHeight: 88, alignItems: "center", justifyContent: "center", borderRadius: 9, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#DEE5F0", backgroundColor: "#F9FAFC" },
  uploadBoxWide: { minHeight: 82, marginBottom: 18, alignItems: "center", justifyContent: "center", borderRadius: 9, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#DEE5F0", backgroundColor: "#F9FAFC" },
  uploadTitle: { marginTop: 6, color: "#172653", fontSize: 14, fontWeight: "900" },
  uploadHint: { marginTop: 3, color: "#8B96A8", fontSize: 11, fontWeight: "700" },
  galleryLabel: { marginBottom: 15, color: "#172653", fontSize: 13, fontWeight: "800" },
  dayRow: { minHeight: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#F0F2F6" },
  dayText: { color: "#38445A", fontSize: 12, fontWeight: "700" },
  timeText: { color: "#172653", fontSize: 13, fontWeight: "700" },
  addPhone: { minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderStyle: "dashed", borderColor: "#DFE6F0" },
  addPhoneText: { color: "#172653", fontSize: 14, fontWeight: "800" },
  subdomain: { height: 54, flexDirection: "row", borderWidth: 1, borderColor: "#DCE4F0", borderRadius: 10, overflow: "hidden" },
  subdomainInput: { flex: 1, paddingHorizontal: 14, backgroundColor: "#F3F4F6", color: "#172653", fontWeight: "700" },
  domain: { paddingHorizontal: 12, textAlignVertical: "center", color: "#647089", backgroundColor: "#F8FAFC", fontWeight: "800" },
  subdomainHint: { marginTop: 16, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#FFE0A6", backgroundColor: "#FFF8E9", color: "#9C6A19", fontSize: 13, lineHeight: 20, fontWeight: "600" },
  mapButton: { height: 50, marginTop: -8, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: "#DEE6F2", backgroundColor: "#F9FAFC" },
  mapButtonText: { color: "#38445A", fontSize: 14, fontWeight: "800" },
  agreementRow: { marginTop: 4, marginBottom: 18, flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: { width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: 4, borderWidth: 1.5, borderColor: "#3478F6" },
  checkboxChecked: { backgroundColor: "#3478F6" },
  agreement: { flex: 1, color: "#687891", fontSize: 13, lineHeight: 19, fontWeight: "700" },
  submitButton: { minHeight: ui.buttonHeight, marginTop: 3, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 10, backgroundColor: "#FF1019", elevation: 5 },
  submitText: { color: "#FFFFFF", fontSize: ui.font.button, fontWeight: "900" },
  privacy: { marginTop: 19, color: "#8490A5", fontSize: 12, lineHeight: 19, fontWeight: "700" },
  floatingPreview: { position: "absolute", right: 16, width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: 38, borderWidth: 5, borderColor: "#FFFFFF", backgroundColor: "#FF1732", elevation: 11 },
  previewTop: { height: 62, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#E6EAF0", backgroundColor: "#FFFFFF" },
  previewBack: { flexDirection: "row", alignItems: "center", gap: 2 },
  previewBackText: { color: "#111827", fontSize: 14 },
  previewHeading: { color: "#111827", fontSize: 18, fontWeight: "900" },
  previewScroll: { flex: 1 },
  previewContent: { padding: 15, paddingBottom: 24 },
  previewCover: { height: 200, alignItems: "center", justifyContent: "center", borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: "#E9EEF6" },
  profileCard: { paddingHorizontal: 17, paddingTop: 18, paddingBottom: 24, backgroundColor: "#FFFFFF", borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  previewLogo: { position: "absolute", left: 20, top: -40, zIndex: 2, width: 92, height: 92, alignItems: "center", justifyContent: "center", borderRadius: 50, borderWidth: 5, borderColor: "#FFFFFF", backgroundColor: "#F0F2F6" },
  profileNameBlock: { marginLeft: 124, minHeight: 130 },
  profileName: { color: "#172653", fontSize: 22, fontWeight: "900" },
  premiumBadge: { alignSelf: "flex-start", marginTop: 8, paddingHorizontal: 10, paddingVertical: 5, overflow: "hidden", borderRadius: 15, color: "#C98218", backgroundColor: "#FFF2D8", fontSize: 12, fontWeight: "800" },
  profileMeta: { marginTop: 12, color: "#69758B", fontSize: 13 },
  rating: { marginTop: 10, color: "#172653", fontSize: 13, fontWeight: "700" },
  profileActions: { marginTop: 6, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  outlineAction: { flex: 1, minWidth: "47%", minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: 14, borderWidth: 1, borderColor: "#8CB5FF" },
  redOutline: { borderColor: "#FF7886" },
  phoneAction: { flexBasis: "100%", borderColor: "#61D99B" },
  blueText: { color: "#3478F6", fontSize: 15, fontWeight: "800" },
  redText: { color: "#FF283D", fontSize: 15, fontWeight: "800" },
  greenText: { color: "#18AE62", fontSize: 15, fontWeight: "800" },
  stats: { height: 116, marginTop: 20, flexDirection: "row", borderRadius: 16, borderWidth: 1, borderColor: "#E0E7F2", overflow: "hidden", backgroundColor: "#FFFFFF" },
  stat: { flex: 1, alignItems: "center", justifyContent: "center", gap: 5, borderRightWidth: 1, borderRightColor: "#E0E7F2" },
  statNumber: { color: "#172653", fontSize: 17, fontWeight: "900" },
  statLabel: { color: "#8490A5", fontSize: 12 },
  previewInfo: { marginTop: 22, color: "#69758B", fontSize: 14 },
  openText: { marginTop: 20, marginLeft: 12, color: "#18B85B", fontSize: 14 },
  previewTabs: { marginTop: 27, marginHorizontal: -17, paddingHorizontal: 17, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#E7EBF2" },
  previewTab: { paddingVertical: 15, paddingHorizontal: 11, color: "#172653", fontSize: 13, fontWeight: "800" },
  aboutText: { marginTop: 20, color: "#69758B", fontSize: 14, lineHeight: 24 },
  galleryTitle: { marginTop: 26, color: "#172653", fontSize: 18, fontWeight: "900" },
  galleryGrid: { marginTop: 15, flexDirection: "row", flexWrap: "wrap", gap: 12 },
  galleryTile: { width: "48%", aspectRatio: 1, borderRadius: 14, backgroundColor: "#E9EEF6" },
  previewFooter: { paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", gap: 8, borderTopWidth: 1, borderColor: "#E6EAF0", backgroundColor: "#FFFFFF" },
  returnButton: { minWidth: 0, minHeight: 50, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 1, borderColor: "#DDE5F1" },
  returnText: { color: "#111111", fontSize: ui.font.small, fontWeight: "800" },
  previewReturnButton: { flex: 0.95, paddingHorizontal: 5 },
  previewSubmitButton: { flex: 1.15, marginTop: 0, paddingHorizontal: 8 },
});
