import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { useI18n } from "../../../i18n/I18nProvider";
import { businesses, listings, ownershipCover } from "../data/homeData";

type AccountTab = "info" | "listings" | "businesses" | "blogs";
type ViewMode = "grid" | "list";
type ListingStatus = "active" | "initialReview" | "expired" | "review" | "rejected" | "cancelled";

type AccountListing = {
  id: string;
  title: string;
  price: string;
  image: string;
  status: ListingStatus;
  location: string;
  age: string;
};

const initialListings: AccountListing[] = [
  { id: "my-1", title: "Haval H6", price: "34 ₼", image: listings[0].image, status: "active", location: "Bakı", age: "4 ay əvvəl" },
  { id: "my-2", title: "BMW X5", price: "51 000 ₼", image: listings[1].image, status: "active", location: "Bakı", age: "4 ay əvvəl" },
  { id: "my-3", title: "İşlənmiş telefon", price: "123 ₼", image: listings[2].image, status: "initialReview", location: "Sumqayıt", age: "Bu gün" },
  { id: "my-4", title: "Ofis üçün avadanlıq", price: "850 ₼", image: listings[3].image, status: "rejected", location: "Bakı", age: "Dünən" },
];

const initialBlogs = [
  { id: "blog-1", category: "Elektronika", title: "Test", image: "https://storage.axtar.az/uploads/posts/min/2026/08/16/6a81c8c682955-8c473ea6eaaec3447d728283aea346a7.png", offers: 153 },
  { id: "blog-2", category: "Bloq kateqoriyası", title: "test blog 7", image: "https://storage.axtar.az/uploads/posts/min/2026/06/10/6a292ee80429a-a242d5f7bd988b2edbdfeb0b1931e8dd.png", offers: 265 },
  { id: "blog-3", category: "Bloq kateqoriyası", title: "blog test 6", image: "https://storage.axtar.az/uploads/posts/min/2026/06/10/6a29275c18122-c2d40615727189a2200b6088299fd16b.png", offers: 227 },
];

const tabInfo: { id: AccountTab; title: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "info", title: "Məlumatlarım", icon: "person-outline" },
  { id: "listings", title: "Elanlarım", icon: "megaphone-outline" },
  { id: "businesses", title: "Bizneslərim", icon: "storefront-outline" },
  { id: "blogs", title: "Bloglarım", icon: "reader-outline" },
];

type Props = {
  onHome: () => void;
  onLogout: () => void;
};

export function AccountScreen({ onHome, onLogout }: Props) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<AccountTab>("info");
  const [viewModes, setViewModes] = useState<Record<Exclude<AccountTab, "info">, ViewMode>>({
    listings: "grid",
    businesses: "grid",
    blogs: "list",
  });
  const [listingFilter, setListingFilter] = useState<ListingStatus>("active");
  const [myListings, setMyListings] = useState(initialListings);
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Xəyyam",
    lastName: "Məmmədli",
    phone: "0501234567",
    email: "demo@axtar.az",
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [currentPassword, setCurrentPassword] = useState("axtar123");
  const [passwordFields, setPasswordFields] = useState({ current: "", next: "", confirm: "" });

  const filteredListings = useMemo(
    () => myListings.filter((item) => item.status === listingFilter),
    [listingFilter, myListings],
  );

  const setMode = (next: ViewMode) => {
    if (tab === "info") return;
    setViewModes((current) => ({ ...current, [tab]: next }));
  };

  const openEdit = () => {
    setDraftProfile(profile);
    setEditVisible(true);
  };

  const saveProfile = () => {
    if (!draftProfile.firstName.trim() || !draftProfile.lastName.trim() || !draftProfile.phone.trim() || !draftProfile.email.trim()) {
      Alert.alert(t("Məlumatları tamamlayın"), t("Bütün xanaları doldurun."));
      return;
    }
    setProfile(draftProfile);
    setEditVisible(false);
    Alert.alert(t("Məlumatlar yeniləndi"), t("Profil məlumatlarınız yadda saxlanıldı."));
  };

  const savePassword = () => {
    if (!passwordFields.current || !passwordFields.next || !passwordFields.confirm) {
      Alert.alert(t("Məlumatları tamamlayın"), t("Bütün xanaları doldurun."));
      return;
    }
    if (passwordFields.current !== currentPassword) {
      Alert.alert(t("Şifrə yanlışdır"), t("Hazırkı şifrənizi düzgün daxil edin."));
      return;
    }
    if (passwordFields.next.length < 6) {
      Alert.alert(t("Şifrə zəifdir"), t("Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır."));
      return;
    }
    if (passwordFields.next !== passwordFields.confirm) {
      Alert.alert(t("Şifrələr uyğun deyil"), t("Yeni şifrə və təkrar şifrə eyni olmalıdır."));
      return;
    }
    setCurrentPassword(passwordFields.next);
    setPasswordFields({ current: "", next: "", confirm: "" });
    setPasswordVisible(false);
    Alert.alert(t("Şifrə yeniləndi"), t("Yeni şifrəniz yadda saxlanıldı."));
  };

  const confirmLogout = () => {
    Alert.alert(t("Hesabdan çıxış"), t("Hesabdan çıxmaq istəyirsiniz?"), [
      { text: t("İmtina et"), style: "cancel" },
      { text: t("Çıxış"), style: "destructive", onPress: onLogout },
    ]);
  };

  const deleteListing = (item: AccountListing) => {
    Alert.alert(t("Elanı sil"), t("Bu mock elanı siyahıdan silmək istəyirsiniz?"), [
      { text: t("İmtina et"), style: "cancel" },
      { text: t("Sil"), style: "destructive", onPress: () => setMyListings((current) => current.filter((entry) => entry.id !== item.id)) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: 5 }]}>
        <View style={styles.topSpacer} />
        <Pressable onPress={confirmLogout} style={styles.logoutButton} accessibilityRole="button" accessibilityLabel={t("Hesabdan çıxış")}>
          <Ionicons name="log-out-outline" size={21} color={colors.ink} />
        </Pressable>
      </View>

      <View style={styles.tabsCard}>
        <View style={styles.tabRow}>
        {tabInfo.map((item) => {
          const active = item.id === tab;
          return (
            <Pressable
              key={item.id}
              onPress={() => setTab(item.id)}
              style={[styles.tabButton, active && styles.tabButtonActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Ionicons name={item.icon} size={19} color={active ? colors.white : colors.ink} />
              <Text numberOfLines={2} style={[styles.tabLabel, active && styles.tabLabelActive]}>{t(item.title)}</Text>
            </Pressable>
          );
        })}

        </View>
        <View style={styles.tabRule} />
        {tab !== "info" ? (
          <View style={styles.viewToggle}>
            <ModeButton icon="reorder-three-outline" active={viewModes[tab] === "list"} label={t("Siyahı görünüşü")} onPress={() => setMode("list")} />
            <ModeButton icon="grid" active={viewModes[tab] === "grid"} label={t("Kart görünüşü")} onPress={() => setMode("grid")} />
          </View>
        ) : null}
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={[styles.content, { paddingBottom: 88 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {tab === "info" ? (
          <View style={styles.profileCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={42} color="#16181D" />
              </View>
              <Pressable
                style={styles.photoButton}
                onPress={() => Alert.alert(t("Profil şəkli"), t("Şəkil yükləmə demo versiyada əlçatan deyil."))}
              >
                <Ionicons name="camera-outline" size={16} color={colors.ink} />
                <Text style={styles.photoButtonText}>{t("Şəkli dəyiş")}</Text>
              </Pressable>
            </View>
            <Text style={styles.profileName}>{profile.firstName} {profile.lastName}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>

            <Pressable onPress={openEdit} style={styles.inlineAction}>
              <Text style={styles.inlineActionText}>{t("Məlumatlarını yenilə")}</Text>
              <Ionicons name="create-outline" size={19} color={colors.action} />
            </Pressable>
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>{t("Şifrə:")}</Text>
            <View style={styles.passwordPreview}>
              <Text style={styles.passwordDots}>••••••••••••</Text>
              <Ionicons name="eye-off-outline" size={25} color={colors.muted} />
            </View>
            <Pressable onPress={() => setPasswordVisible(true)} style={styles.inlineAction}>
              <Text style={styles.inlineActionText}>{t("Şifrəni yenilə")}</Text>
              <Ionicons name="create-outline" size={19} color={colors.action} />
            </Pressable>
            <View style={styles.divider} />
            <InfoField label={t("Telefon nömrəsi:")} value={formatPhone(profile.phone)} />
            <InfoField label={t("E-poçt ünvanı:")} value={profile.email} />
            <InfoField label={t("Qeydiyyat tarixi:")} value="29.11.2025" last />
          </View>
        ) : null}

        {tab === "listings" ? (
          <View>
            <Text style={styles.sectionHeading}>{t("Elanlarım")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
              {([
                { status: "active", label: "Aktiv elanlarım", icon: "megaphone-outline" },
                { status: "initialReview", label: "İlkin yoxlanışda", icon: "time-outline" },
                { status: "expired", label: "Vaxtı bitmişlər", icon: "hourglass-outline" },
                { status: "review", label: "Yoxlanışda", icon: "search-outline" },
                { status: "rejected", label: "Xətalı", icon: "close-circle-outline" },
                { status: "cancelled", label: "Ləğv edilib", icon: "ban-outline" },
              ] as const).map(({ status, label, icon }) => {
                const active = listingFilter === status;
                const count = myListings.filter((item) => item.status === status).length;
                return (
                  <Pressable
                    key={status}
                    onPress={() => setListingFilter(status)}
                    style={[styles.filterTab, active && styles.filterTabActive]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                  >
                    <Ionicons name={icon} size={19} color={active ? colors.brand : colors.muted} />
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>{t(label)} ({count})</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {filteredListings.length ? (
              <View style={viewModes.listings === "grid" ? styles.grid : styles.list}>
                {filteredListings.map((item) => (
                  <ListingItem
                    key={item.id}
                    item={item}
                    mode={viewModes.listings}
                    onEdit={() => Alert.alert(t("Elanı redaktə et"), t("Elan redaktəsi demo rejimində aktiv deyil."))}
                    onDelete={() => deleteListing(item)}
                  />
                ))}
              </View>
            ) : (
              <EmptyState title={t("Elan yoxdur")} body={t("Bu statusda elan tapılmadı.")} />
            )}
          </View>
        ) : null}

        {tab === "businesses" ? (
          <View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionHeading}>{t("Biznes siyahısı")}</Text>
              <Pressable onPress={() => Alert.alert(t("Yeni biznes"), t("Biznes yaratma demo rejimində aktiv deyil."))} style={styles.addButton}>
                <Text style={styles.addButtonText}>{t("Yeni biznes")}</Text>
                <Ionicons name="add-circle-outline" size={18} color={colors.white} />
              </Pressable>
            </View>
            <View style={viewModes.businesses === "grid" ? styles.grid : styles.list}>
              {businesses.map((item) => (
                <BusinessItem key={item.id} item={item} mode={viewModes.businesses} />
              ))}
            </View>
          </View>
        ) : null}

        {tab === "blogs" ? (
          <View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionHeading}>{t("Blog siyahısı")}</Text>
              <Pressable onPress={() => Alert.alert(t("Yeni blog yarat"), t("Blog yaratma demo rejimində aktiv deyil."))} style={styles.addButton}>
                <Text style={styles.addButtonText}>{t("Yeni blog yarat")}</Text>
                <Ionicons name="add-circle-outline" size={18} color={colors.white} />
              </Pressable>
            </View>
            <View style={viewModes.blogs === "grid" ? styles.grid : styles.list}>
              {initialBlogs.map((item) => (
                <BlogItem key={item.id} item={item} mode={viewModes.blogs} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(8, insets.bottom) }]}>
        <BottomItem icon="home" label="Ana səhifə" onPress={onHome} />
        <BottomItem icon="heart" label="Seçilmişlər" onPress={() => Alert.alert(t("Seçilmişlər"), t("Bu bölmə növbəti mərhələdə əlavə olunacaq."))} />
        <View style={styles.bottomAdd}><Ionicons name="add" size={27} color={colors.brand} /></View>
        <BottomItem icon="chatbubble-ellipses" label="Mesajlarım" onPress={() => Alert.alert(t("Mesajlarım"), t("Bu bölmə növbəti mərhələdə əlavə olunacaq."))} />
        <BottomItem icon="person-circle-outline" label="Kabinetim" active onPress={() => setTab("info")} />
      </View>

      <ProfileEditModal
        visible={editVisible}
        profile={draftProfile}
        onChange={setDraftProfile}
        onClose={() => setEditVisible(false)}
        onSave={saveProfile}
      />
      <PasswordModal
        visible={passwordVisible}
        values={passwordFields}
        onChange={setPasswordFields}
        onClose={() => setPasswordVisible(false)}
        onSave={savePassword}
      />
    </View>
  );
}

function formatPhone(phone: string) {
  const value = phone.replace(/\D/g, "");
  return value.length === 10 ? `(+994) ${value.slice(0, 3)} ${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8)}` : phone;
}

function ModeButton({ icon, active, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeButton, active && styles.modeButtonActive]} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }}>
      <Ionicons name={icon} size={20} color={active ? colors.brand : colors.muted} />
    </Pressable>
  );
}

function InfoField({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoField, last && styles.infoFieldLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text selectable style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ListingItem({ item, mode, onEdit, onDelete }: { item: AccountListing; mode: ViewMode; onEdit: () => void; onDelete: () => void }) {
  const { t } = useI18n();
  const image = <Image source={{ uri: item.image }} style={mode === "grid" ? styles.listingImage : styles.rowImage} resizeMode="cover" />;
  if (mode === "list") {
    return (
      <View style={styles.listingRow}>
        {image}
        <View style={styles.rowCopy}>
          <Text style={styles.rowPrice}>{t(item.price)}</Text>
          <Text style={styles.rowTitle} numberOfLines={2}>{t(item.title)}</Text>
          <Text style={styles.rowMeta}>{t(item.location)} · {t(item.age)}</Text>
        </View>
        <View style={styles.rowActions}>
          <Pressable onPress={onEdit} accessibilityLabel={t("Redaktə et")}><Ionicons name="create-outline" size={20} color={colors.action} /></Pressable>
          <Pressable onPress={onDelete} accessibilityLabel={t("Sil")}><Ionicons name="trash-outline" size={20} color={colors.brand} /></Pressable>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.listingCard}>
      <View style={styles.cardImageWrap}>
        {image}
        <View style={styles.cardActions}>
          <ActionIcon icon="create-outline" color={colors.action} label={t("Redaktə et")} onPress={onEdit} />
          <ActionIcon icon="trash-outline" color={colors.brand} label={t("Sil")} onPress={onDelete} />
          <View style={styles.heartIcon}><Ionicons name="heart" size={17} color={colors.ink} /></View>
        </View>
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.rowPrice}>{t(item.price)}</Text>
        <Text style={styles.rowTitle} numberOfLines={1}>{t(item.title)}</Text>
        <Text style={styles.rowMeta}>{t(item.location)} · {t(item.age)}</Text>
      </View>
    </View>
  );
}

function BusinessItem({ item, mode }: { item: (typeof businesses)[number]; mode: ViewMode }) {
  const { t } = useI18n();
  if (mode === "list") {
    return (
      <View style={styles.businessRow}>
        <Image source={{ uri: ownershipCover }} style={styles.businessRowImage} resizeMode="cover" />
        <View style={styles.rowCopy}>
          <Text style={styles.rowTitle}>{t(item.name)}</Text>
          <Text style={styles.rowMeta}>{t(item.listings)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
    );
  }
  return (
    <View style={styles.businessCard}>
      <View style={styles.businessCover}>
        <Image source={{ uri: ownershipCover }} style={styles.businessImage} resizeMode="cover" />
        <View style={styles.cardActions}>
          <ActionIcon icon="create-outline" color={colors.action} label={t("Redaktə et")} onPress={() => Alert.alert(t("Biznesi redaktə et"), t("Biznes redaktəsi demo rejimində aktiv deyil."))} />
          <ActionIcon icon="trash-outline" color={colors.brand} label={t("Sil")} onPress={() => Alert.alert(t("Biznesi sil"), t("Biznes silmə demo rejimində aktiv deyil."))} />
        </View>
      </View>
      <View style={styles.businessCopy}>
        <Text style={styles.rowTitle} numberOfLines={1}>{t(item.name)}</Text>
        <Text style={styles.countPill}><Ionicons name="grid-outline" size={12} color={colors.muted} /> {t(item.listings)}</Text>
        <View style={styles.onlineRow}><Ionicons name="location-outline" size={14} color={colors.muted} /><Ionicons name="car-outline" size={14} color={colors.muted} /><Ionicons name="card-outline" size={14} color={colors.muted} /><View style={styles.onlineDot} /></View>
      </View>
    </View>
  );
}

function BlogItem({ item, mode }: { item: (typeof initialBlogs)[number]; mode: ViewMode }) {
  const { t } = useI18n();
  if (mode === "list") {
    return (
      <View style={styles.blogRow}>
        <Image source={{ uri: item.image }} style={styles.blogRowImage} resizeMode="cover" />
        <View style={styles.blogCopy}>
          <View style={styles.blogCategoryLine}><View style={styles.blogCategoryIcon}><Ionicons name="pricetag" size={13} color={colors.brand} /></View><Text style={styles.blogCategory}>{t(item.category)}</Text></View>
          <Text style={styles.blogTitle} numberOfLines={2}>{t(item.title)}</Text>
          <View style={styles.blogOffers}><Text style={styles.offerButton}>{t(`${item.offers} uyğun elan`)}</Text><Ionicons name="arrow-forward" size={15} color={colors.brand} /></View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.blogCard}>
      <Image source={{ uri: item.image }} style={styles.blogImage} resizeMode="cover" />
      <View style={styles.blogCardCopy}>
        <View style={styles.blogCategoryLine}><View style={styles.blogCategoryIcon}><Ionicons name="pricetag" size={13} color={colors.brand} /></View><Text style={styles.blogCategory}>{t(item.category)}</Text></View>
        <Text style={styles.blogTitle} numberOfLines={2}>{t(item.title)}</Text>
        <Text style={styles.offerButton}>{t(`${item.offers} uyğun elan`)}</Text>
      </View>
    </View>
  );
}

function ActionIcon({ icon, color, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; color: string; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.actionIcon} accessibilityRole="button" accessibilityLabel={label}><Ionicons name={icon} size={18} color={color} /></Pressable>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="documents-outline" size={30} color={colors.subtle} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

function BottomItem({ icon, label, active, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; active?: boolean; onPress: () => void }) {
  const { t } = useI18n();
  return (
    <Pressable onPress={onPress} style={styles.bottomItem} accessibilityRole="tab" accessibilityState={{ selected: !!active }}>
      <Ionicons name={icon} size={20} color={active ? colors.brand : colors.muted} />
      <Text style={[styles.bottomLabel, active && styles.bottomLabelActive]} numberOfLines={1}>{t(label)}</Text>
    </Pressable>
  );
}

function ProfileEditModal({ visible, profile, onChange, onClose, onSave }: {
  visible: boolean;
  profile: { firstName: string; lastName: string; phone: string; email: string };
  onChange: (profile: { firstName: string; lastName: string; phone: string; email: string }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} accessibilityRole="button" accessibilityLabel={t("Bağla")} />
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={[styles.sheetCard, { paddingBottom: Math.max(24, insets.bottom + 12) }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{t("Məlumatlarını yenilə")}</Text><Pressable onPress={onClose}><Ionicons name="close" size={24} color={colors.ink} /></Pressable></View>
            <View style={styles.avatarRowSmall}><View style={styles.avatarSmall}><Ionicons name="person" size={28} color="#16181D" /></View><Pressable style={styles.photoButtonSmall} onPress={() => Alert.alert(t("Profil şəkli"), t("Şəkil yükləmə demo versiyada əlçatan deyil."))}><Text style={styles.photoButtonText}>{t("Şəkli dəyiş")}</Text></Pressable></View>
            <FormField label={t("Adınız")} value={profile.firstName} onChangeText={(firstName) => onChange({ ...profile, firstName })} />
            <FormField label={t("Soyadınız")} value={profile.lastName} onChangeText={(lastName) => onChange({ ...profile, lastName })} />
            <FormField label={t("Telefon nömrəsi")} value={profile.phone} onChangeText={(phone) => onChange({ ...profile, phone })} keyboardType="phone-pad" />
            <FormField label={t("E-poçt ünvanı")} value={profile.email} onChangeText={(email) => onChange({ ...profile, email })} keyboardType="email-address" />
            <ModalActions cancelLabel={t("İmtina et")} saveLabel={t("Yadda saxla")} onCancel={onClose} onSave={onSave} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function PasswordModal({ visible, values, onChange, onClose, onSave }: {
  visible: boolean;
  values: { current: string; next: string; confirm: string };
  onChange: (value: { current: string; next: string; confirm: string }) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} accessibilityRole="button" accessibilityLabel={t("Bağla")} />
        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={[styles.sheetCard, { paddingBottom: Math.max(24, insets.bottom + 12) }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{t("Şifrəni yenilə")}</Text><Pressable onPress={onClose}><Ionicons name="close" size={24} color={colors.ink} /></Pressable></View>
            <FormField label={t("Hazırkı şifrə")} value={values.current} onChangeText={(current) => onChange({ ...values, current })} secureTextEntry />
            <FormField label={t("Yeni şifrə")} value={values.next} onChangeText={(next) => onChange({ ...values, next })} secureTextEntry />
            <FormField label={t("Şifrə təkrarı")} value={values.confirm} onChangeText={(confirm) => onChange({ ...values, confirm })} secureTextEntry />
            <ModalActions cancelLabel={t("İmtina et")} saveLabel={t("Yadda saxla")} onCancel={onClose} onSave={onSave} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function FormField({ label, value, onChangeText, secureTextEntry, keyboardType }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} placeholder={label} placeholderTextColor={colors.subtle} secureTextEntry={secureTextEntry} keyboardType={keyboardType} autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"} />
    </View>
  );
}

function ModalActions({ cancelLabel, saveLabel, onCancel, onSave }: { cancelLabel: string; saveLabel: string; onCancel: () => void; onSave: () => void }) {
  return (
    <View style={styles.modalActions}>
      <Pressable onPress={onCancel} style={styles.cancelButton}><Text style={styles.cancelText}>{cancelLabel}</Text></Pressable>
      <Pressable onPress={onSave} style={styles.saveButton}><Text style={styles.saveText}>{saveLabel}</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F5F7" },
  topBar: { height: 58, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF" },
  topSpacer: { flex: 1 },
  logoutButton: { width: 42, height: 42, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft },
  tabsCard: { marginHorizontal: 14, marginTop: 10, padding: 10, borderRadius: 22, backgroundColor: "#FFFFFF" },
  tabRow: { flexDirection: "row", gap: 7 },
  tabButton: { flex: 1, minHeight: 76, paddingHorizontal: 3, paddingVertical: 10, alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 15, backgroundColor: "#F3F4F6" },
  tabButtonActive: { backgroundColor: colors.brand },
  tabLabel: { color: "#576071", fontSize: 10, textAlign: "center", fontWeight: "600" },
  tabLabelActive: { color: "#FFFFFF" },
  tabRule: { height: StyleSheet.hairlineWidth, marginTop: 12, marginHorizontal: 2, backgroundColor: colors.line },
  viewToggle: { height: 44, marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 8 },
  modeButton: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modeButtonActive: { backgroundColor: colors.paleBrand },
  contentScroll: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 8 },
  profileCard: { paddingHorizontal: 20, paddingTop: 23, paddingBottom: 20, borderRadius: 22, backgroundColor: "#FFFFFF" },
  avatarRow: { minHeight: 128, flexDirection: "row", alignItems: "center", gap: 22 },
  avatar: { width: 94, height: 94, borderRadius: 48, alignItems: "center", justifyContent: "center", backgroundColor: "#F3F4F6", borderWidth: 6, borderColor: "#F8F8F9" },
  photoButton: { minHeight: 44, paddingHorizontal: 16, borderRadius: 24, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", gap: 7 },
  photoButtonText: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  profileName: { marginTop: 20, color: colors.ink, fontSize: 21, fontWeight: "800" },
  profileEmail: { marginTop: 5, color: colors.ink, fontSize: 15 },
  inlineAction: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 9, marginTop: 12 },
  inlineActionText: { color: colors.action, fontSize: 16, fontWeight: "600" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginVertical: 12 },
  fieldLabel: { color: colors.muted, fontSize: 14, marginTop: 10 },
  passwordPreview: { minHeight: 63, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  passwordDots: { color: colors.ink, fontSize: 21, letterSpacing: 4 },
  infoField: { paddingTop: 20, paddingBottom: 8, gap: 16 },
  infoFieldLast: { paddingBottom: 8 },
  infoLabel: { color: colors.muted, fontSize: 14 },
  infoValue: { color: colors.ink, fontSize: 17, lineHeight: 24, fontWeight: "500" },
  sectionHeading: { marginLeft: 2, marginTop: 12, marginBottom: 14, color: colors.ink, fontSize: 19, fontWeight: "700" },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  filterTabs: { flexDirection: "row", alignItems: "stretch", borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line, paddingHorizontal: 2, marginBottom: 14 },
  filterTab: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 5, marginRight: 18, borderBottomWidth: 3, borderBottomColor: "transparent" },
  filterTabActive: { borderBottomColor: colors.brand },
  filterText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: colors.brand },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  list: { gap: 12 },
  listingCard: { width: "48%", borderRadius: 15, overflow: "hidden", borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFFFF", elevation: 2 },
  cardImageWrap: { width: "100%", aspectRatio: 1.14, backgroundColor: colors.soft },
  listingImage: { width: "100%", height: "100%" },
  cardActions: { position: "absolute", top: 9, left: 9, right: 9, flexDirection: "row", alignItems: "center", gap: 7 },
  actionIcon: { width: 34, height: 34, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.96)" },
  heartIcon: { marginLeft: "auto", width: 34, height: 34, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.96)" },
  cardCopy: { padding: 10, gap: 4 },
  rowPrice: { color: colors.brand, fontSize: 17, fontWeight: "800" },
  rowTitle: { color: colors.ink, fontSize: 14, fontWeight: "600" },
  rowMeta: { color: colors.muted, fontSize: 11, marginTop: 5 },
  listingRow: { minHeight: 100, padding: 10, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFFFF" },
  rowImage: { width: 86, height: 76, borderRadius: 11, backgroundColor: colors.soft },
  rowCopy: { flex: 1, minWidth: 0 },
  rowActions: { gap: 12, paddingHorizontal: 4 },
  businessCard: { width: "48%", borderRadius: 15, overflow: "hidden", borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFFFF", elevation: 2 },
  businessCover: { height: 112, backgroundColor: "#111318" },
  businessImage: { width: "100%", height: "100%" },
  businessCopy: { padding: 10, gap: 7 },
  countPill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 10, backgroundColor: colors.soft, color: colors.ink, fontSize: 10 },
  onlineRow: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line, paddingTop: 7 },
  onlineDot: { marginLeft: "auto", width: 10, height: 10, borderRadius: 6, backgroundColor: colors.green },
  businessRow: { minHeight: 88, padding: 10, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFFFF" },
  businessRowImage: { width: 70, height: 65, borderRadius: 9, backgroundColor: colors.soft },
  blogRow: { minHeight: 150, flexDirection: "row", overflow: "hidden", borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFFFF", elevation: 1 },
  blogRowImage: { width: "34%", minHeight: 150, backgroundColor: colors.soft },
  blogCopy: { flex: 1, minWidth: 0, padding: 11, justifyContent: "space-between" },
  blogCategoryLine: { flexDirection: "row", alignItems: "center", gap: 7 },
  blogCategoryIcon: { width: 27, height: 27, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.paleBrand },
  blogCategory: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  blogTitle: { color: colors.ink, fontSize: 15, fontWeight: "700", marginTop: 5 },
  blogOffers: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 6 },
  offerButton: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.brand, color: colors.brand, fontSize: 11, fontWeight: "700" },
  blogCard: { width: "48%", overflow: "hidden", borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: "#FFFFFF" },
  blogImage: { width: "100%", height: 130, backgroundColor: colors.soft },
  blogCardCopy: { padding: 10 },
  emptyState: { minHeight: 200, alignItems: "center", justifyContent: "center", padding: 25, borderRadius: 16, backgroundColor: "#FFFFFF" },
  emptyTitle: { marginTop: 10, color: colors.ink, fontSize: 16, fontWeight: "700" },
  emptyBody: { marginTop: 5, color: colors.muted, fontSize: 13, textAlign: "center" },
  bottomBar: { position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 70, paddingHorizontal: 12, paddingTop: 7, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line, backgroundColor: "#FFFFFF" },
  bottomItem: { flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center", gap: 2, paddingTop: 4 },
  bottomLabel: { color: colors.muted, fontSize: 9, fontWeight: "500" },
  bottomLabelActive: { color: colors.brand },
  bottomAdd: { width: 62, height: 62, marginTop: -22, borderRadius: 32, borderWidth: 2, borderColor: colors.brand, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  sheetBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(17,24,39,0.38)" },
  sheetScroll: { flexGrow: 0, maxHeight: "86%", backgroundColor: "#FFFFFF", borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: "hidden" },
  sheetCard: { paddingTop: 12, paddingHorizontal: 20 },
  sheetHandle: { width: 38, height: 5, alignSelf: "center", marginBottom: 14, borderRadius: 3, backgroundColor: "#D6D9DF" },
  modalHeader: { minHeight: 38, marginBottom: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  avatarRowSmall: { minHeight: 100, flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 10 },
  avatarSmall: { width: 66, height: 66, borderRadius: 36, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft },
  photoButtonSmall: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 20, backgroundColor: colors.soft },
  formField: { marginBottom: 15, gap: 7 },
  formLabel: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  input: { height: 50, paddingHorizontal: 14, borderWidth: 1, borderColor: "#DDE1E8", borderRadius: 13, color: colors.ink, fontSize: 14, backgroundColor: "#FFFFFF" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.soft },
  cancelText: { color: colors.ink, fontSize: 14, fontWeight: "600" },
  saveButton: { flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.brand },
  saveText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
