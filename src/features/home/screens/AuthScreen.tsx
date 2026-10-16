import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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

type AuthPage = "login" | "register" | "forgot";
type Props = { onHome: () => void; onLoginSuccess: () => void };

export function AuthScreen({ onHome, onLoginSuccess }: Props) {
  const { t } = useI18n();
  const [page, setPage] = useState<AuthPage>("login");
  const [phone, setPhone] = useState("0501234567");
  const [password, setPassword] = useState("axtar123");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const insets = useSafeAreaInsets();

  const goTo = (next: AuthPage) => {
    setPage(next);
    setCaptcha(false);
    setCodeSent(false);
    setOtp("");
  };

  const submitLogin = () => {
    const normalizedPhone = phone.split("").filter((character) => character >= "0" && character <= "9").join("");
    if (normalizedPhone !== "0501234567" || password !== "axtar123") {
      Alert.alert(t("Demo giriş"), t("Nömrə və ya şifrə yanlışdır. Demo məlumatlarından istifadə edin."));
      return;
    }
    onLoginSuccess();
  };

  const submitRegister = () => {
    if (!name.trim() || !surname.trim() || !phone.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert(t("Məlumatları tamamlayın"), t("Qeydiyyat üçün bütün xanaları doldurun."));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("Şifrələr uyğun deyil"), t("Şifrə və təkrar şifrəni eyni daxil edin."));
      return;
    }
    if (!captcha) {
      Alert.alert(t("Təsdiq tələb olunur"), t("Davam etmək üçün “Mən robot deyiləm” seçimini edin."));
      return;
    }
    Alert.alert(t("Qeydiyyat"), t("Qeydiyyat xidməti hələ backend-ə qoşulmayıb."));
  };

  const submitForgot = () => {
    if (!phone.trim()) {
      Alert.alert(t("Mobil nömrə tələb olunur"), t("Şifrəni bərpa etmək üçün mobil nömrənizi daxil edin."));
      return;
    }
    if (!captcha) {
      Alert.alert(t("Təsdiq tələb olunur"), t("Davam etmək üçün “Mən robot deyiləm” seçimini edin."));
      return;
    }
    if (!codeSent) {
      setCodeSent(true);
      Alert.alert(t("Təsdiq kodu"), t("Demo ekran: nömrəyə göndərilən kod prosesi backend qoşulanda aktiv olacaq."));
      return;
    }
    if (!otp.trim() || !password || password !== confirmPassword) {
      Alert.alert(t("Məlumatları yoxlayın"), t("OTP kodu və uyğun yeni şifrəni daxil edin."));
      return;
    }
    Alert.alert(t("Şifrə"), t("Şifrə yeniləmə xidməti hələ backend-ə qoşulmayıb."));
  };

  const title = t(page === "login" ? "Xoş gəlmisiniz" : page === "register" ? "Qeydiyyat" : "Şifrəmi unutmuşam");
  const subtitle = t(page === "login"
    ? "Zəhmət olmasa giriş üçün məlumatları daxil edin"
    : page === "register"
      ? "Zəhmət olmasa qeydiyyat üçün məlumatları daxil edin"
      : "Şifrənizi sıfırlamaq üçün mobil nömrənizi daxil edin. Nömrəyə 6 rəqəmli OTP kod göndəriləcək.");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 105 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.form, page === "login" && styles.loginForm]}>
            <View style={styles.logoMark}><View style={styles.logoCircle} /><Text style={styles.logo}>{t("axtar.az")}</Text></View>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            {page === "register" ? (
              <>
                <InputField label="Ad" icon="person-outline" value={name} onChangeText={setName} placeholder={t("Adınız")} />
                <InputField label="Soyad" icon="person-outline" value={surname} onChangeText={setSurname} placeholder={t("Soyadınız")} />
              </>
            ) : null}

            <InputField
              label="Mobil nömrə"
              icon="call"
              value={phone}
              onChangeText={setPhone}
              placeholder={t("(050) 000-00-00")}
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            {page === "register" ? (
              <InputField label="E-poçt ünvanı" icon="mail" value={email} onChangeText={setEmail} placeholder={t("hello@mail.com")} keyboardType="email-address" autoCapitalize="none" />
            ) : null}

            {page !== "forgot" || codeSent ? (
              <>
                <InputField
                  label={page === "forgot" ? "Yeni şifrə" : "Şifrə"}
                  icon="lock-closed"
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("Şifrənizi daxil edin")}
                  secureTextEntry={!showPassword}
                  rightAction={() => setShowPassword((value) => !value)}
                  rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                />
                {page === "register" || (page === "forgot" && codeSent) ? (
                  <InputField
                    label="Şifrənin təkrarı"
                    icon="lock-closed"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={t("Şifrəni təkrar daxil edin")}
                    secureTextEntry={!showPassword}
                    rightAction={() => setShowPassword((value) => !value)}
                    rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                  />
                ) : null}
              </>
            ) : null}

            {page === "forgot" && codeSent ? (
              <InputField label="SMS kodu" icon="key-outline" value={otp} onChangeText={setOtp} placeholder={t("6 rəqəmli kod")} keyboardType="number-pad" />
            ) : null}

            {page === "login" ? (
              <View style={styles.demoHint}>
                <Ionicons name="information-circle-outline" size={18} color={colors.action} />
                <Text style={styles.demoHintText}>{t("Demo hesabı:")} 050 123 45 67 · axtar123</Text>
              </View>
            ) : (
              <Pressable
                onPress={() => setCaptcha((value) => !value)}
                style={styles.captcha}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: captcha }}
              >
                <View style={[styles.checkbox, captcha && styles.checkboxChecked]}>
                  {captcha ? <Ionicons name="checkmark" size={17} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.captchaText}>{t("Mən robot deyiləm")}</Text>
                <View style={styles.captchaBrand}><Ionicons name="refresh-circle" size={27} color="#4285F4" /><Text style={styles.captchaCaption}>{t("reCAPTCHA")}</Text></View>
              </Pressable>
            )}

            {page === "login" ? (
              <View style={styles.loginOptions}>
                <Pressable onPress={() => setRemember((value) => !value)} style={styles.remember} accessibilityRole="checkbox" accessibilityState={{ checked: remember }}>
                  <View style={[styles.smallCheckbox, remember && styles.smallCheckboxChecked]}>{remember ? <Ionicons name="checkmark" size={12} color="#FFFFFF" /> : null}</View>
                  <Text style={styles.optionText}>{t("Məni yadda saxla")}</Text>
                </Pressable>
                <Pressable onPress={() => goTo("forgot")}><Text style={styles.linkText}>{t("Şifrəni unutmusunuz?")}</Text></Pressable>
              </View>
            ) : null}

            <Pressable
              onPress={page === "login" ? submitLogin : page === "register" ? submitRegister : submitForgot}
              style={styles.submit}
              accessibilityRole="button"
            >
              <Text style={styles.submitText}>
                {t(page === "login" ? "Daxil olun" : page === "register" ? "Qeydiyyatdan keç" : codeSent ? "Şifrəni yenilə" : "Kod göndər")}
              </Text>
            </Pressable>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {page === "login" ? "Hələ də qeydiyyatdan keçməmisiniz?" : page === "register" ? "Artıq hesabınız var?" : "Hesabınız artıq mövcuddur?"}
              </Text>
              <Pressable onPress={() => goTo(page === "register" || page === "forgot" ? "login" : "register")} style={styles.switchButton}>
                <Text style={styles.switchButtonText}>{t(page === "register" || page === "forgot" ? "Giriş et" : "Qeydiyyat")}</Text>
              </Pressable>
            </View>
          </View>
          {page === "register" || page === "forgot" ? (
            <View style={styles.footer}><Text style={styles.footerText}>{t("Müəllif hüquqları qorunur — 2026")}</Text></View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.bottomBar, { height: 64 + insets.bottom, paddingBottom: insets.bottom }]}>
        <BottomItem icon="home" label="Ana səhifə" onPress={onHome} />
        <BottomItem icon="heart" label="Seçilmişlər" onPress={() => Alert.alert(t("Seçilmişlər"), t("Bu bölməyə baxmaq üçün giriş edin."))} />
        <Pressable style={styles.addButton} onPress={() => Alert.alert(t("Yeni elan"), t("Elan yerləşdirmək üçün əvvəlcə giriş edin."))} accessibilityLabel={t("Yeni elan")}>
          <Ionicons name="add" size={27} color={colors.brand} />
        </Pressable>
        <BottomItem icon="chatbubble-ellipses" label="Mesajlarım" onPress={() => Alert.alert(t("Mesajlarım"), t("Bu bölməyə baxmaq üçün giriş edin."))} />
        <BottomItem icon="person-circle-outline" label="Daxil ol" active onPress={() => goTo("login")} />
      </View>
    </SafeAreaView>
  );
}

function InputField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  rightAction,
  rightIcon,
  autoComplete,
  autoCapitalize,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  secureTextEntry?: boolean;
  rightAction?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  autoComplete?: "tel";
  autoCapitalize?: "none" | "sentences";
}) {
  const { t } = useI18n();
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{t(label)}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={19} color="#98A0AE" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t(placeholder)}
          placeholderTextColor="#8F96A3"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          style={styles.input}
        />
        {rightAction && rightIcon ? (
          <Pressable onPress={rightAction} hitSlop={10} accessibilityLabel={t("Şifrəni göstər/gizlət")}>
            <Ionicons name={rightIcon} size={21} color="#707887" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function BottomItem({ icon, label, active, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; active?: boolean; onPress: () => void }) {
  const { t } = useI18n();
  return (
    <Pressable onPress={onPress} style={styles.bottomItem} accessibilityRole="tab" accessibilityState={{ selected: active }}>
      <Ionicons name={icon} size={20} color={active ? colors.ink : "#596477"} />
      <Text style={[styles.bottomLabel, active && styles.bottomLabelActive]} numberOfLines={1}>{t(label)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboard: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  form: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 28 },
  loginForm: { paddingTop: 46 },
  logoMark: { alignSelf: "center", height: 86, justifyContent: "flex-end", alignItems: "center", marginBottom: 18 },
  logoCircle: { position: "absolute", top: 0, width: 72, height: 72, borderRadius: 40, backgroundColor: "#F7F8FA", borderWidth: 1, borderColor: "#ECEEF1" },
  logo: { color: colors.brand, fontSize: 31, fontWeight: "900", letterSpacing: -1 },
  heading: { color: "#12151D", fontSize: 23, lineHeight: 30, fontWeight: "700", textAlign: "center", marginTop: 8 },
  subtitle: { color: "#596171", fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 7, marginBottom: 28 },
  field: { marginBottom: 17 },
  label: { color: "#171A22", fontSize: 14, fontWeight: "600", marginBottom: 7 },
  inputWrap: { height: 52, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: "#DDE1E8", borderRadius: 13, backgroundColor: "#FFFFFF" },
  input: { flex: 1, minWidth: 0, paddingVertical: 0, color: "#171A22", fontSize: 15 },
  demoHint: { minHeight: 44, marginBottom: 18, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, backgroundColor: "#EFF4FF" },
  demoHintText: { flex: 1, color: "#35415A", fontSize: 12, lineHeight: 18 },
  captcha: { height: 76, marginHorizontal: 20, marginTop: 2, marginBottom: 20, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 11, borderWidth: 1, borderColor: "#D9D9D9", backgroundColor: "#FAFAFA", elevation: 1 },
  checkbox: { width: 23, height: 23, borderWidth: 2, borderColor: "#596171", borderRadius: 3, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  checkboxChecked: { borderColor: colors.brand, backgroundColor: colors.brand },
  captchaText: { flex: 1, color: "#15171C", fontSize: 14, fontWeight: "500" },
  captchaBrand: { width: 62, alignItems: "center", justifyContent: "center" },
  captchaCaption: { color: "#555B64", fontSize: 8 },
  loginOptions: { minHeight: 38, marginTop: -3, marginBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 7 },
  remember: { flexDirection: "row", alignItems: "center", gap: 7 },
  smallCheckbox: { width: 19, height: 19, borderWidth: 1.5, borderColor: "#DDE1E8", borderRadius: 4, alignItems: "center", justifyContent: "center" },
  smallCheckboxChecked: { backgroundColor: colors.brand, borderColor: colors.brand },
  optionText: { color: "#303644", fontSize: 11 },
  linkText: { color: "#3764F5", fontSize: 12, fontWeight: "500" },
  submit: { minHeight: 54, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand, marginTop: 1 },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  switchRow: { marginTop: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 8 },
  switchText: { color: "#596171", fontSize: 12, textAlign: "center" },
  switchButton: { minHeight: 39, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1, borderColor: "#E0E3E9", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", elevation: 1 },
  switchButtonText: { color: "#303849", fontSize: 13, fontWeight: "600" },
  footer: { marginTop: "auto", paddingHorizontal: 15, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between" },
  footerText: { color: "#171A22", fontSize: 10 },
  bottomBar: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.98)", borderTopWidth: 1, borderTopColor: "#EEF0F3" },
  bottomItem: { width: "18%", height: 54, alignItems: "center", justifyContent: "center", gap: 2 },
  bottomLabel: { color: "#596477", fontSize: 8, fontWeight: "500" },
  bottomLabelActive: { color: colors.brand, fontWeight: "700" },
  addButton: { width: 65, height: 65, marginTop: -20, borderRadius: 34, borderWidth: 2, borderColor: colors.brand, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
});
