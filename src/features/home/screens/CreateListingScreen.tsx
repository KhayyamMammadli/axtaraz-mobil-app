import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { useI18n } from "../../../i18n/I18nProvider";

type CreateListingScreenProps = {
  onBack: () => void;
};

type PickerState = {
  title: string;
  options: string[];
  onSelect: (value: string) => void;
} | null;

type WorkHours = Record<string, { start: string; end: string }>;

const categoryOptions = [
  "Elektronika",
  "Daşınmaz əmlak",
  "Nəqliyyat",
  "Ev və bağ",
  "Geyimlər",
  "Xidmətlər",
];
const cityOptions = ["Bakı", "Sumqayıt", "Gəncə", "Mingəçevir", "Şəki", "Lənkəran"];
const weekdays = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"];
const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2).toString().padStart(2, "0");
  const minute = index % 2 ? "30" : "00";
  return hour + ":" + minute;
});

export function CreateListingScreen({ onBack }: CreateListingScreenProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [picker, setPicker] = useState<PickerState>(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [sameHours, setSameHours] = useState(false);
  const [sameStart, setSameStart] = useState("09:00");
  const [sameEnd, setSameEnd] = useState("18:00");
  const [days, setDays] = useState<string[]>(weekdays);
  const [hours, setHours] = useState<WorkHours>(() =>
    Object.fromEntries(weekdays.map((day, index) => [
      day,
      index === 5 ? { start: "10:00", end: "16:00" } : index === 6 ? { start: "12:00", end: "17:00" } : { start: "09:00", end: "18:00" },
    ]))
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [robotChecked, setRobotChecked] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);

  const showPicker = (titleText: string, options: string[], onSelect: (value: string) => void) => {
    setPicker({ title: titleText, options, onSelect });
  };

  const availableDays = useMemo(() => weekdays.filter((day) => !days.includes(day)), [days]);

  const updateHour = (day: string, key: "start" | "end", value: string) => {
    setHours((current) => ({
      ...current,
      [day]: { ...(current[day] ?? { start: "09:00", end: "18:00" }), [key]: value },
    }));
  };

  const handleSubmit = () => {
    const required = [category, title.trim(), price.trim(), city, description.trim(), address.trim(), firstName.trim(), lastName.trim(), email.trim(), phone.trim(), password, passwordAgain];
    if (required.some((value) => !value)) {
      Alert.alert(t("Məlumat çatışmır"), t("Məcburi xanaları doldurun."));
      return;
    }
    if (password !== passwordAgain) {
      Alert.alert(t("Şifrələr uyğun gəlmir"), t("Şifrə və təkrar şifrə eyni olmalıdır."));
      return;
    }
    if (!robotChecked) {
      Alert.alert(t("Təsdiq tələb olunur"), t("Davam etmək üçün robot olmadığınızı təsdiqləyin."));
      return;
    }
    Alert.alert(t("Elan yerləşdirmə"), t("Elan yerləşdirmə API-si qoşulduqdan sonra aktiv olacaq."));
  };

  if (previewVisible) {
    return (
      <ListingPreview
        title={title}
        price={price}
        city={city}
        description={description}
        address={address}
        phone={phone}
        onEdit={() => setPreviewVisible(false)}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onBack} accessibilityRole="button" accessibilityLabel={t("Geri")}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.topTitle}>{t("Yeni elan yerləşdir")}</Text>
        <View style={styles.topSpacer} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.formContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionCard}>
          <SectionHeading title={t("Elan haqqında məlumatlar")} />
          <SelectField label={t("Kateqoriya seçimi")} value={category ? t(category) : ""} placeholder={t("Seçin")} onPress={() => showPicker(t("Kateqoriya seçimi"), categoryOptions, setCategory)} />
          <FormField label={t("Elanın adı")} value={title} onChangeText={setTitle} placeholder={t("Elanın adını yazın")} />
          <FormField label={t("Qiymət")} value={price} onChangeText={setPrice} placeholder="0" keyboardType="decimal-pad" trailing="₼" />
          <SelectField label={t("Şəhər")} value={city ? t(city) : ""} placeholder={t("Seçin")} onPress={() => showPicker(t("Şəhər"), cityOptions, setCity)} />
          <View style={styles.field}>
            <FieldLabel text={t("Elan haqqında məlumat")} />
            <TextInput
              value={description}
              onChangeText={(value) => setDescription(value.slice(0, 200))}
              placeholder={t("Ətraflı məlumat əlavə edin")}
              placeholderTextColor={colors.subtle}
              multiline
              maxLength={200}
              textAlignVertical="top"
              style={[styles.input, styles.descriptionInput]}
            />
            <Text style={styles.counter}>{description.length}/200</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <SectionHeading title={t("Şəkillər")} subtitle={t("Məhsulunuzu daha yaxşı təqdim etmək üçün aydın və keyfiyyətli şəkillər əlavə edin.")} />
          <Pressable
            style={styles.uploadBox}
            onPress={() => Alert.alert(t("Şəkil əlavə edin"), t("Şəkil yükləmə demo versiyada əlçatan deyil."))}
            accessibilityRole="button"
          >
            <Ionicons name="cloud-upload" size={30} color={colors.brand} />
            <Text style={styles.uploadTitle}>{t("Şəkil əlavə edin")}</Text>
            <Text style={styles.uploadMeta}>{t("JPG, PNG formatında, maksimum 5 MB")}</Text>
            <Text style={styles.uploadMeta}>{t("Minimum 1 şəkil əlavə olunur")}</Text>
          </Pressable>
          <Text style={styles.photoCount}>{t("Əlavə edilən şəkillər")} <Text style={styles.mutedStrong}>(0/20)</Text></Text>
          <View style={styles.photoPlaceholder}>
            <Ionicons name="images-outline" size={24} color={colors.subtle} />
            <Text style={styles.photoPlaceholderText}>{t("Şəkil əlavə edildikdən sonra burada görünəcək")}</Text>
          </View>
          <InfoNote text={t("Elanınıza ön şəkil seçmək üçün şəklin üzərinə klikləyin.")} />
        </View>

        <View style={styles.sectionCard}>
          <SectionHeading title={t("Məhsul və ya xidmət üçün məkan təyin edin")} />
          <View style={styles.mapPreview}>
            <View style={styles.mapRoadHorizontal} />
            <View style={styles.mapRoadVertical} />
            <View style={styles.mapRoadDiagonal} />
            <Ionicons name="location" size={38} color={colors.brand} />
            <Text style={styles.mapLabel}>{address ? t(city || "Bakı") + " · " + address : t("Məkan seçin")}</Text>
          </View>
          <FormField label={t("Ünvan")} value={address} onChangeText={setAddress} placeholder={t("Ünvanı axtarın: Bakı, Nərimanov, Gəncə...")} />
          <Pressable style={styles.mapButton} onPress={() => setMapExpanded((value) => !value)} accessibilityRole="button">
            <Ionicons name="location" size={18} color={colors.ink} />
            <Text style={styles.mapButtonText}>{t(mapExpanded ? "Xəritəni gizlət" : "Xəritədə göstər")}</Text>
          </Pressable>
          {mapExpanded ? (
            <View style={styles.mapExpanded}>
              <View style={styles.mapRoadHorizontal} />
              <View style={styles.mapRoadVertical} />
              <Ionicons name="location" size={40} color={colors.brand} />
              <Text style={styles.mapExpandedText}>{t("Xəritə ünvan seçildikdə burada göstəriləcək.")}</Text>
            </View>
          ) : null}
          <Text style={styles.helper}>{t("Ünvanı yazın və xəritədə göstər düyməsinə toxunun.")}</Text>
        </View>

        <View style={styles.sectionCard}>
          <SectionHeading title={t("İş saatları")} />
          <RadioOption label={t("Hər gün eyni saatlarda")} selected={sameHours} onPress={() => setSameHours(true)} />
          <RadioOption label={t("Fərqli iş qrafiki")} selected={!sameHours} onPress={() => setSameHours(false)} />
          {sameHours ? (
            <View style={styles.sameHoursRow}>
              <Text style={styles.dayLabel}>{t("Hər gün")}</Text>
              <TimeButton value={sameStart} onPress={() => showPicker(t("Başlama saatı"), timeOptions, setSameStart)} />
              <Text style={styles.timeDash}>–</Text>
              <TimeButton value={sameEnd} onPress={() => showPicker(t("Bitmə saatı"), timeOptions, setSameEnd)} />
            </View>
          ) : (
            <>
              {days.map((day) => (
                <View key={day} style={styles.workDayRow}>
                  <Text style={styles.dayLabel} numberOfLines={2}>{t(day)}</Text>
                  <TimeButton value={hours[day]?.start ?? "09:00"} onPress={() => showPicker(t("Başlama saatı"), timeOptions, (value) => updateHour(day, "start", value))} />
                  <Text style={styles.timeDash}>–</Text>
                  <TimeButton value={hours[day]?.end ?? "18:00"} onPress={() => showPicker(t("Bitmə saatı"), timeOptions, (value) => updateHour(day, "end", value))} />
                  <Pressable
                    onPress={() => setDays((current) => current.filter((item) => item !== day))}
                    style={styles.deleteDay}
                    accessibilityRole="button"
                    accessibilityLabel={t("Günü sil")}
                  >
                    <Ionicons name="trash-outline" size={17} color={colors.brand} />
                  </Pressable>
                </View>
              ))}
              <Pressable
                style={styles.addDayButton}
                onPress={() => {
                  if (availableDays.length) showPicker(t("Gün əlavə et"), availableDays, (day) => {
                    setDays((current) => [...current, day]);
                    updateHour(day, "start", "09:00");
                  });
                }}
                accessibilityRole="button"
              >
                <Ionicons name="add" size={19} color={colors.ink} />
                <Text style={styles.addDayText}>{t("Gün əlavə et")}</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.sectionCard}>
          <SectionHeading title={t("Əlaqə məlumatlarınız")} />
          <FormField label={t("Ad")} value={firstName} onChangeText={setFirstName} placeholder={t("Adınızı yazın")} />
          <FormField label={t("Soyad")} value={lastName} onChangeText={setLastName} placeholder={t("Soyadınızı yazın")} />
          <FormField label={t("E-mail")} value={email} onChangeText={setEmail} placeholder={t("E-mail ünvanınızı yazın")} keyboardType="email-address" />
          <FormField label={t("Mobil nömrə")} value={phone} onChangeText={setPhone} placeholder="(055) 000-00-00" keyboardType="phone-pad" leading="+994" />
          <PasswordField label={t("Şifrə")} value={password} onChangeText={setPassword} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} placeholder={t("Şifrə yaradın")} />
          <PasswordField label={t("Şifrənin təkrarı")} value={passwordAgain} onChangeText={setPasswordAgain} visible={showPasswordAgain} onToggle={() => setShowPasswordAgain((value) => !value)} placeholder={t("Şifrənizi təkrarlayın")} />
          <InfoNote text={t("Gizliliyinizi qoruyuruq. Məlumatlarınızı üçüncü şəxslərlə paylaşmırıq.")} />
          <Pressable style={styles.robotRow} onPress={() => setRobotChecked((value) => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: robotChecked }}>
            <View style={[styles.checkbox, robotChecked && styles.checkboxChecked]}>
              {robotChecked ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
            </View>
            <Text style={styles.robotText}>{t("Mən robot deyiləm")}</Text>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.muted} />
          </Pressable>
        </View>
      </ScrollView>

      <Pressable
        style={[styles.previewFab, { bottom: 92 + insets.bottom }]}
        onPress={() => setPreviewVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={t("Önbaxış")}
      >
        <Ionicons name="eye-outline" size={26} color={colors.white} />
      </Pressable>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <PrimaryButton title={t("Elanı yerləşdir")} onPress={handleSubmit} />
      </View>

      <Modal visible={!!picker} transparent animationType="slide" onRequestClose={() => setPicker(null)}>
        <View style={styles.pickerRoot}>
          <Pressable style={styles.pickerBackdrop} onPress={() => setPicker(null)} />
          <View style={[styles.pickerSheet, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            <View style={styles.pickerHandle} />
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>{picker?.title}</Text>
              <Pressable onPress={() => setPicker(null)} accessibilityLabel={t("Bağla")}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>
            <ScrollView style={styles.pickerOptions}>
              {picker?.options.map((option) => (
                <Pressable
                  key={option}
                  style={styles.pickerOption}
                  onPress={() => {
                    picker.onSelect(option);
                    setPicker(null);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={styles.pickerOptionText}>{t(option)}</Text>
                  <Ionicons name="chevron-forward" size={17} color={colors.muted} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "decimal-pad" | "email-address" | "phone-pad";
  trailing?: string;
  leading?: string;
};

function FormField({ label, value, onChangeText, placeholder, keyboardType = "default", trailing, leading }: FieldProps) {
  return (
    <View style={styles.field}>
      <FieldLabel text={label} />
      <View style={styles.inputWrap}>
        {leading ? <Text style={styles.inputPrefix}>{leading}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.subtle}
          keyboardType={keyboardType}
          style={styles.input}
        />
        {trailing ? <Text style={styles.inputSuffix}>{trailing}</Text> : null}
      </View>
    </View>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <Text style={styles.fieldLabel}>{text}<Text style={styles.required}> *</Text></Text>;
}

function SelectField({ label, value, placeholder, onPress }: { label: string; value: string; placeholder: string; onPress: () => void }) {
  return (
    <View style={styles.field}>
      <FieldLabel text={label} />
      <Pressable style={styles.inputWrap} onPress={onPress} accessibilityRole="button">
        <Text style={[styles.selectValue, !value && styles.placeholder]}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.muted} />
      </Pressable>
    </View>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.headingAccent} />
      <View style={styles.headingCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

function InfoNote({ text }: { text: string }) {
  return (
    <View style={styles.infoNote}>
      <Ionicons name="information-circle" size={20} color="#3F71CF" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function RadioOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={styles.radioRow} onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }}>
      <View style={[styles.radio, selected && styles.radioSelected]} />
      <Text style={styles.radioText}>{label}</Text>
    </Pressable>
  );
}

function TimeButton({ value, onPress }: { value: string; onPress: () => void }) {
  return (
    <Pressable style={styles.timeButton} onPress={onPress} accessibilityRole="button">
      <Text style={styles.timeText}>{value}</Text>
      <Ionicons name="chevron-down" size={14} color={colors.ink} />
    </Pressable>
  );
}

function PasswordField({ label, value, onChangeText, visible, onToggle, placeholder }: { label: string; value: string; onChangeText: (value: string) => void; visible: boolean; onToggle: () => void; placeholder: string }) {
  return (
    <View style={styles.field}>
      <FieldLabel text={label} />
      <View style={styles.inputWrap}>
        <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.subtle} secureTextEntry={!visible} style={styles.input} />
        <Pressable onPress={onToggle} hitSlop={8} accessibilityRole="button">
          <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={20} color={colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable style={styles.primaryButton} onPress={onPress} accessibilityRole="button">
      <Text style={styles.primaryButtonText}>{title}</Text>
      <Ionicons name="arrow-forward" size={19} color={colors.white} />
    </Pressable>
  );
}

function ListingPreview({ title, price, city, description, address, phone, onEdit, onSubmit }: {
  title: string;
  price: string;
  city: string;
  description: string;
  address: string;
  phone: string;
  onEdit: () => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.previewHeader}>
        <Pressable style={styles.previewBack} onPress={onEdit} accessibilityRole="button" accessibilityLabel={t("Redaktəyə qayıt")}>
          <Ionicons name="arrow-back" size={21} color={colors.ink} />
        </Pressable>
        <Text style={styles.previewHeaderTitle}>{t("Elanınız belə görünəcək")}</Text>
        <View style={styles.topSpacer} />
      </View>
      <ScrollView contentContainerStyle={[styles.previewContent, { paddingBottom: 126 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.previewCard}>
          <View style={styles.previewListingHeading}>
            <Text style={styles.previewListingTitle}>{title || t("Elanın adı burada görünəcək")}</Text>
            <View style={styles.previewMore}><Ionicons name="ellipsis-horizontal" size={21} color={colors.muted} /></View>
          </View>
          <View style={styles.previewImage}>
            <Ionicons name="image-outline" size={55} color="#AEBBC7" />
            <Text style={styles.previewImageText}>{t("Şəkil əlavə edilməyib")}</Text>
          </View>
          <View style={styles.previewStats}>
            <PreviewStat icon="eye-outline" label={t("Baxış")} value="0" />
            <PreviewStat icon="pricetag-outline" label={t("Elan ID")} value="—" />
            <PreviewStat icon="bookmark-outline" label={t("Saxla")} value="" />
            <PreviewStat icon="time-outline" label={t("24 saat qalır")} value="" />
          </View>
          <View style={styles.previewBody}>
            <Text style={styles.previewSectionTitle}>{t("Elanın təsviri")}</Text>
            <Text style={styles.previewDescription}>{description || t("Elan haqqında daxil etdiyiniz məlumat burada görünəcək.")}</Text>
            <Text style={styles.moreText}>{t("Daha ətraflı")} →</Text>
            <Text style={styles.previewPrice}>{price ? price + " ₼" : "0 ₼"}</Text>
            <View style={styles.previewOwner}>
              <View style={styles.ownerAvatar}><Ionicons name="person" size={20} color={colors.subtle} /></View>
              <View>
                <Text style={styles.ownerCaption}>{t("Elan sahibi")}</Text>
                <Text style={styles.ownerName}>{t("İstifadəçi")}</Text>
                <Text style={styles.ownerVerified}>● {t("Onlayndır")}</Text>
              </View>
            </View>
            <View style={styles.activeRow}><Ionicons name="checkmark-circle" size={17} color={colors.green} /><Text style={styles.activeText}>{t("Aktivdir")}</Text></View>
            <OutlineAction icon="heart-outline" title={t("İzlə")} />
            <OutlineAction icon="call" title={"+994 " + (phone || "50 000 00 00")} />
            <OutlineAction icon="chatbubble" title={t("Mesaj yaz")} />
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}><Text style={styles.addressTitle}>{t("Ünvan")}</Text><Text style={styles.mapLink}>{t("Xəritədə göstər")} →</Text></View>
              <View style={styles.addressMap}><Ionicons name="location" size={32} color={colors.brand} /></View>
              <Text style={styles.addressText}>{[city, address].filter(Boolean).join(", ") || t("Məkan əlavə edilməyib")}</Text>
            </View>
            <InfoNote text={t("Təhlükəsiz alış-veriş üçün məsləhətlər")} />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.previewFooter, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <Pressable style={styles.secondaryButton} onPress={onEdit} accessibilityRole="button">
          <Text style={styles.secondaryButtonText}>{t("Redaktəyə qayıt")}</Text>
        </Pressable>
        <Pressable style={[styles.primaryButton, styles.previewSubmitButton]} onPress={onSubmit} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>{t("Elanı yerləşdir")}</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


function PreviewStat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.previewStat}>
      <Ionicons name={icon} size={15} color={colors.muted} />
      <Text style={styles.previewStatText}>{value ? value + " " : ""}{label}</Text>
    </View>
  );
}

function OutlineAction({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={styles.outlineAction}>
      <Ionicons name={icon} size={18} color={colors.brand} />
      <Text style={styles.outlineActionText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F6F8" },
  topBar: { minHeight: 62, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F5F7" },
  topTitle: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: "700" },
  topSpacer: { width: 12 },
  scroll: { flex: 1 },
  formContent: { paddingHorizontal: 12, paddingTop: 12, gap: 12 },
  sectionCard: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: "#E6EBF1", backgroundColor: colors.white },
  sectionHeading: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 18 },
  headingAccent: { width: 4, minHeight: 36, borderRadius: 3, backgroundColor: colors.brand, marginTop: 2 },
  headingCopy: { flex: 1, gap: 4 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  sectionSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  field: { marginBottom: 15 },
  fieldLabel: { marginBottom: 8, color: colors.ink, fontSize: 14, fontWeight: "700" },
  required: { color: colors.brand },
  inputWrap: { minHeight: 52, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, borderWidth: 1, borderColor: "#DDE3EB", backgroundColor: colors.white },
  input: { flex: 1, minHeight: 50, paddingVertical: 10, color: colors.ink, fontSize: 15 },
  inputPrefix: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  inputSuffix: { color: colors.muted, fontSize: 15, fontWeight: "700" },
  selectValue: { flex: 1, color: colors.ink, fontSize: 15 },
  placeholder: { color: colors.subtle },
  descriptionInput: { minHeight: 126, paddingTop: 14, paddingBottom: 26 },
  counter: { position: "absolute", right: 12, bottom: 8, color: colors.muted, fontSize: 12, fontWeight: "600" },
  uploadBox: { minHeight: 150, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 1, borderColor: "#DDE3EB", backgroundColor: "#FBFCFD" },
  uploadTitle: { marginTop: 9, color: colors.ink, fontSize: 15, fontWeight: "700" },
  uploadMeta: { marginTop: 5, color: colors.muted, fontSize: 12, textAlign: "center" },
  photoCount: { marginTop: 14, marginBottom: 8, color: colors.ink, fontSize: 14, fontWeight: "700" },
  mutedStrong: { color: colors.muted },
  photoPlaceholder: { minHeight: 84, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 13, borderWidth: 1, borderColor: "#DDE3EB" },
  photoPlaceholderText: { maxWidth: 230, color: colors.subtle, fontSize: 13, fontWeight: "600", lineHeight: 19 },
  infoNote: { marginTop: 12, minHeight: 58, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 11, borderWidth: 1, borderColor: "#C9D9FF", backgroundColor: "#F3F7FF" },
  infoText: { flex: 1, color: "#3F71CF", fontSize: 12, lineHeight: 18, fontWeight: "600" },
  mapPreview: { height: 142, marginBottom: 16, overflow: "hidden", alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#EAF2E8" },
  mapRoadHorizontal: { position: "absolute", left: -20, right: -20, top: "52%", height: 15, backgroundColor: "#F4D5A4", transform: [{ rotate: "-8deg" }] },
  mapRoadVertical: { position: "absolute", width: 14, top: -30, bottom: -30, left: "58%", backgroundColor: "#F6DCA9", transform: [{ rotate: "22deg" }] },
  mapRoadDiagonal: { position: "absolute", width: 12, top: -20, bottom: -20, left: "27%", backgroundColor: "#F3D1A4", transform: [{ rotate: "-28deg" }] },
  mapLabel: { position: "absolute", left: 10, right: 10, bottom: 8, padding: 7, borderRadius: 8, color: colors.ink, fontSize: 11, fontWeight: "600", textAlign: "center", backgroundColor: "rgba(255,255,255,0.9)" },
  helper: { marginTop: 10, color: colors.muted, fontSize: 12, lineHeight: 18 },
  mapButton: { minHeight: 48, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, borderWidth: 1, borderColor: "#DDE3EB", backgroundColor: "#F7F8FA" },
  mapButtonText: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  mapExpanded: { height: 180, marginTop: 10, overflow: "hidden", alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: "#EAF2E8" },
  mapExpandedText: { position: "absolute", left: 10, right: 10, bottom: 8, padding: 6, borderRadius: 7, color: colors.muted, fontSize: 11, textAlign: "center", backgroundColor: "rgba(255,255,255,0.9)" },
  radioRow: { minHeight: 40, flexDirection: "row", alignItems: "center", gap: 10 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.muted },
  radioSelected: { borderColor: colors.brand, borderWidth: 6 },
  radioText: { color: colors.ink, fontSize: 14, fontWeight: "600" },
  sameHoursRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 5 },
  workDayRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 5 },
  dayLabel: { width: 100, color: colors.ink, fontSize: 12, fontWeight: "600" },
  timeButton: { flex: 1, minWidth: 0, height: 44, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 4, borderRadius: 10, borderWidth: 1, borderColor: "#DDE3EB", backgroundColor: colors.white },
  timeText: { color: colors.ink, fontSize: 12 },
  timeDash: { color: colors.muted, fontSize: 13 },
  deleteDay: { width: 34, height: 40, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF4F5" },
  addDayButton: { minHeight: 44, marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 11, borderWidth: 1, borderStyle: "dashed", borderColor: "#C9D6E8", backgroundColor: "#FAFBFC" },
  addDayText: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  robotRow: { minHeight: 48, alignSelf: "flex-start", marginTop: 14, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 7 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: colors.muted, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: colors.brand, borderColor: colors.brand },
  robotText: { color: colors.ink, fontSize: 12, fontWeight: "600" },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white },
  primaryButton: { minHeight: 54, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 13, backgroundColor: colors.brand },
  primaryButtonText: { color: colors.white, fontSize: 15, fontWeight: "800" },
  previewFab: { position: "absolute", right: 16, width: 62, height: 62, borderRadius: 31, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: colors.white, backgroundColor: colors.brand, shadowColor: colors.brand, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 10 },
  pickerRoot: { flex: 1, justifyContent: "flex-end" },
  pickerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(20,24,34,0.38)" },
  pickerSheet: { maxHeight: "72%", paddingHorizontal: 18, paddingTop: 10, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.white },
  pickerHandle: { alignSelf: "center", width: 38, height: 4, marginBottom: 14, borderRadius: 2, backgroundColor: "#D9DCE3" },
  pickerHeader: { minHeight: 40, marginBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pickerTitle: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  pickerOptions: { flexGrow: 0 },
  pickerOption: { minHeight: 51, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line },
  pickerOptionText: { color: colors.ink, fontSize: 14, fontWeight: "600" },
  previewHeader: { minHeight: 58, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 5, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.white },
  previewBack: { width: 36, height: 42, alignItems: "center", justifyContent: "center" },
  previewHeaderTitle: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: "700", textAlign: "center" },
  previewContent: { padding: 12 },
  previewCard: { overflow: "hidden", borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: "#E7EBEF" },
  previewListingHeading: { minHeight: 58, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10 },
  previewListingTitle: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: "700" },
  previewMore: { width: 38, height: 38, borderRadius: 20, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  previewImage: { height: 300, alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#E5EEF3" },
  previewImageText: { color: colors.muted, fontSize: 14, fontWeight: "700" },
  previewStats: { minHeight: 50, paddingHorizontal: 10, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  previewStat: { minWidth: "43%", flexDirection: "row", alignItems: "center", gap: 5 },
  previewStatText: { color: colors.muted, fontSize: 11 },
  previewBody: { padding: 15 },
  previewSectionTitle: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  previewDescription: { minHeight: 76, marginTop: 10, color: colors.ink, fontSize: 14, lineHeight: 21 },
  moreText: { marginTop: 12, color: "#3569D4", fontSize: 14, fontWeight: "700" },
  previewPrice: { marginTop: 42, marginBottom: 20, color: colors.brand, fontSize: 25, fontWeight: "800" },
  previewOwner: { minHeight: 68, paddingTop: 13, flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1, borderTopColor: colors.line },
  ownerAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  ownerCaption: { color: colors.muted, fontSize: 11 },
  ownerName: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  ownerVerified: { marginTop: 3, color: colors.green, fontSize: 11 },
  activeRow: { marginTop: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 5 },
  activeText: { color: colors.green, fontSize: 13, fontWeight: "600" },
  outlineAction: { minHeight: 48, marginBottom: 9, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 11, borderWidth: 1, borderColor: colors.brand },
  outlineActionText: { color: colors.brand, fontSize: 14, fontWeight: "700" },
  addressCard: { marginTop: 12, padding: 12, borderRadius: 13, borderWidth: 1, borderColor: "#E7EBEF" },
  addressHeader: { flexDirection: "row", justifyContent: "space-between" },
  addressTitle: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  mapLink: { color: "#3569D4", fontSize: 12, fontWeight: "700" },
  addressMap: { height: 125, marginTop: 10, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#E6F0E6" },
  addressText: { marginTop: 8, color: colors.muted, fontSize: 12 },
  previewFooter: { position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: 10, paddingHorizontal: 12, flexDirection: "row", gap: 9, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white },
  secondaryButton: { flex: 0.9, minHeight: 54, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: "#D5DCE5", backgroundColor: colors.white },
  secondaryButtonText: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  previewSubmitButton: { flex: 1.1 },
});
