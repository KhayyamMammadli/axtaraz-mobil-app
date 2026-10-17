import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
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
import { listings, ownershipCover, type Listing } from "../data/homeData";

type InboxTab = "all" | "mine" | "interested";
type MessageKind = "listing" | "business";
type ChatMessage = { id: string; text: string; from: "them" | "me"; time: string };
type Conversation = {
  id: string;
  name: string;
  item: Listing;
  updatedAt: string;
  lastMessage: string;
  mine: boolean;
  unread: boolean;
  favorite: boolean;
  kind: MessageKind;
  blocked: boolean;
  messages: ChatMessage[];
};
type InboxFilters = { kind: "all" | MessageKind; unreadOnly: boolean; favoritesOnly: boolean; sort: "newest" | "oldest" };

const initialConversations: Conversation[] = [
  {
    id: "chat-1", name: "Tural", item: { id: "chat-listing-1", title: "MacBook Pro", price: "3 243 ₼", location: "Bakı", age: "1 ay əvvəl", image: listings[2].image },
    updatedAt: "1 ay əvvəl", lastMessage: "Salam", mine: true, unread: true, favorite: false, kind: "listing", blocked: false,
    messages: [
      { id: "m1", text: "Salam, elan hələ aktivdir?", from: "them", time: "4 ay əvvəl" },
      { id: "m2", text: "Bəli, məlumat üçün yaza bilərsiniz.", from: "me", time: "4 ay əvvəl" },
      { id: "m3", text: "Salam", from: "me", time: "4 ay əvvəl" },
      { id: "m4", text: "Məhsulun vəziyyəti necədir?", from: "them", time: "4 ay əvvəl" },
      { id: "m5", text: "Yaxşı vəziyyətdədir.", from: "me", time: "4 ay əvvəl" },
    ],
  },
  {
    id: "chat-2", name: "Samir", item: { id: "chat-listing-2", title: "PlayStation 4", price: "450 ₼", location: "Bakı", age: "3 həftə əvvəl", image: listings[1].image },
    updatedAt: "3 həftə əvvəl", lastMessage: "123456", mine: false, unread: false, favorite: false, kind: "listing", blocked: false,
    messages: [
      { id: "m6", text: "Salam, PlayStation satılmayıb?", from: "them", time: "4 ay əvvəl" },
      { id: "m7", text: "Xeyr, elan aktivdir.", from: "me", time: "4 ay əvvəl" },
      { id: "m8", text: "123456", from: "them", time: "4 ay əvvəl" },
    ],
  },
  {
    id: "chat-3", name: "Murad", item: { id: "chat-listing-3", title: "Haval H6", price: "34 000 ₼", location: "Bakı", age: "3 ay əvvəl", image: listings[0].image },
    updatedAt: "3 ay əvvəl", lastMessage: "Avtomobilə baxmaq olar?", mine: true, unread: false, favorite: true, kind: "listing", blocked: false,
    messages: [
      { id: "m9", text: "Salam, avtomobilə baxmaq olar?", from: "them", time: "4 ay əvvəl" },
      { id: "m10", text: "Bəli, uyğun vaxtı razılaşdıraq.", from: "me", time: "4 ay əvvəl" },
    ],
  },
  {
    id: "chat-4", name: "Xəyyam", item: { id: "chat-listing-4", title: "Ofis üçün avadanlıq", price: "850 ₼", location: "Bakı", age: "Dünən", image: listings[3].image },
    updatedAt: "1 ay əvvəl", lastMessage: "Salam", mine: false, unread: true, favorite: false, kind: "listing", blocked: false,
    messages: [{ id: "m11", text: "Salam", from: "them", time: "4 ay əvvəl" }, { id: "m12", text: "Zəhmət olmasa ətraflı məlumat verin.", from: "me", time: "4 ay əvvəl" }],
  },
  {
    id: "chat-5", name: "Alpha Alpha", item: { id: "chat-listing-5", title: "Şlaqbaum 055 245 89 79", price: "1 000 ₼", location: "Bakı", age: "2 həftə əvvəl", image: ownershipCover },
    updatedAt: "1 ay əvvəl", lastMessage: "Domofon satışı ilə maraqlanıram.", mine: true, unread: false, favorite: false, kind: "business", blocked: false,
    messages: [{ id: "m13", text: "Salam, qiymət barədə məlumat verə bilərsiniz?", from: "them", time: "4 ay əvvəl" }, { id: "m14", text: "Əlbəttə, zəhmət olmasa zəng edin.", from: "me", time: "4 ay əvvəl" }],
  },
  {
    id: "chat-6", name: "Nihad", item: { id: "chat-listing-6", title: "Delineatorların satışı", price: "50 ₼", location: "Bakı", age: "1 ay əvvəl", image: listings[3].image },
    updatedAt: "1 ay əvvəl", lastMessage: "Çatdırılma mümkündür?", mine: false, unread: false, favorite: false, kind: "listing", blocked: false,
    messages: [{ id: "m15", text: "Çatdırılma mümkündür?", from: "them", time: "4 ay əvvəl" }, { id: "m16", text: "Bəli, Bakı üzrə çatdırılma var.", from: "me", time: "4 ay əvvəl" }],
  },
];

const emptyFilters: InboxFilters = { kind: "all", unreadOnly: false, favoritesOnly: false, sort: "newest" };

export function MessagesScreen({ onBack, onOpenListing }: { onBack: () => void; onOpenListing: (listing: Listing) => void }) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<InboxTab>("all");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<InboxFilters>(emptyFilters);
  const [draftFilters, setDraftFilters] = useState<InboxFilters>(emptyFilters);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);

  const activeChat = conversations.find((chat) => chat.id === activeChatId) ?? null;
  const filteredChats = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const matching = conversations.filter((chat) => {
      const matchesTab = tab === "all" || (tab === "mine" ? chat.mine : !chat.mine);
      const matchesType = filters.kind === "all" || chat.kind === filters.kind;
      const matchesUnread = !filters.unreadOnly || chat.unread;
      const matchesFavorite = !filters.favoritesOnly || chat.favorite;
      const matchesQuery = !normalized || [chat.name, chat.item.title, chat.lastMessage].some((value) => t(value).toLocaleLowerCase().includes(normalized));
      return matchesTab && matchesType && matchesUnread && matchesFavorite && matchesQuery;
    });
    return filters.sort === "oldest" ? matching.reverse() : matching;
  }, [conversations, filters, query, tab, t]);

  const openChat = (chat: Conversation) => {
    setActiveChatId(chat.id);
    setMenuVisible(false);
    setConversations((current) => current.map((entry) => entry.id === chat.id ? { ...entry, unread: false } : entry));
  };

  const updateChat = (id: string, updater: (chat: Conversation) => Conversation) => {
    setConversations((current) => current.map((chat) => chat.id === id ? updater(chat) : chat));
  };

  const sendMessage = (text = messageDraft) => {
    const value = text.trim();
    if (!activeChat || !value || activeChat.blocked) return;
    const nextMessage: ChatMessage = { id: `sent-${Date.now()}`, text: value, from: "me", time: "İndi" };
    updateChat(activeChat.id, (chat) => ({ ...chat, messages: [...chat.messages, nextMessage], lastMessage: value, updatedAt: "İndi" }));
    setMessageDraft("");
  };

  const loadOlder = () => {
    if (!activeChat) return;
    const older: ChatMessage[] = [
      { id: `older-${activeChat.id}-1`, text: "Salam, elanla maraqlanıram.", from: "them", time: "5 ay əvvəl" },
      { id: `older-${activeChat.id}-2`, text: "Zəhmət olmasa ətraflı məlumat verin.", from: "me", time: "5 ay əvvəl" },
    ];
    updateChat(activeChat.id, (chat) => ({ ...chat, messages: [...older, ...chat.messages] }));
  };

  const closeChat = () => { setActiveChatId(null); setMessageDraft(""); setMenuVisible(false); };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {activeChat ? (
        <View style={styles.chatScreen}>
          <View style={styles.chatHeader}>
            <Pressable onPress={closeChat} style={styles.backButton} accessibilityRole="button" accessibilityLabel={t("Geri")}><Ionicons name="arrow-back" size={22} color={colors.ink} /></Pressable>
            <View style={styles.avatar}><Ionicons name="person" size={28} color="#777A80" /></View>
            <Text style={styles.chatName} numberOfLines={1}>{t(activeChat.name)}</Text>
            <Pressable onPress={() => setMenuVisible((value) => !value)} style={styles.moreButton} accessibilityRole="button" accessibilityLabel={t("Daha çox")}><Ionicons name="ellipsis-vertical" size={21} color={colors.ink} /></Pressable>
          </View>

          <Pressable style={styles.listingPreview} onPress={() => onOpenListing(activeChat.item)} accessibilityRole="button">
            <Image source={{ uri: activeChat.item.image }} style={styles.previewImage} resizeMode="cover" />
            <View style={styles.previewCopy}>
              <Text style={styles.previewPrice}>{t(activeChat.item.price)}</Text>
              <Text style={styles.previewTitle} numberOfLines={1}>{t(activeChat.item.title)}</Text>
            </View>
            <View style={styles.openListingButton}><Text style={styles.openListingText}>{t("Elana bax")}</Text><Ionicons name="chevron-forward" size={16} color={colors.brand} /></View>
          </Pressable>

          <ScrollView style={styles.messagesScroll} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
            <Pressable onPress={loadOlder} style={styles.olderButton}><Ionicons name="arrow-up" size={17} color={colors.brand} /><Text style={styles.olderText}>{t("Əvvəlki mesajlar")}</Text></Pressable>
            {activeChat.messages.map((message) => (
              <View key={message.id} style={[styles.messageRow, message.from === "me" && styles.messageRowMine]}>
                {message.from === "them" ? <View style={styles.messageAvatar}><Ionicons name="person" size={20} color="#777A80" /></View> : null}
                <View style={[styles.bubble, message.from === "me" ? styles.bubbleMine : styles.bubbleThem]}>
                  <Text style={styles.bubbleText}>{t(message.text)}</Text>
                  <View style={styles.bubbleMeta}><Text style={styles.bubbleTime}>{t(message.time)}</Text>{message.from === "me" ? <Ionicons name="checkmark-done" size={15} color={colors.brand} /> : null}</View>
                </View>
              </View>
            ))}
          </ScrollView>

          {activeChat.blocked ? (
            <View style={[styles.blockedBanner, { paddingBottom: Math.max(12, insets.bottom + 8) }]}><Text style={styles.blockedText}>{t("Bu söhbət bloklanıb.")}</Text><Pressable onPress={() => updateChat(activeChat.id, (chat) => ({ ...chat, blocked: false }))}><Text style={styles.unblockText}>{t("Blokdan çıxar")}</Text></Pressable></View>
          ) : (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={0}>
              <View style={[styles.composer, { paddingBottom: Math.max(10, insets.bottom + 6) }]}>
                <Pressable style={styles.attachButton} onPress={() => Alert.alert(t("Fayl əlavə et"), t("Fayl göndərmə demo rejimində aktiv deyil."))} accessibilityRole="button" accessibilityLabel={t("Fayl əlavə et")}><Ionicons name="attach" size={23} color={colors.subtle} /></Pressable>
                <View style={styles.inputWrap}>
                  <TextInput value={messageDraft} onChangeText={setMessageDraft} placeholder={t("Mesaj yazın...")} placeholderTextColor={colors.muted} style={styles.messageInput} multiline maxLength={1000} />
                  <Pressable onPress={() => setMessageDraft((value) => value + "🙂")} accessibilityRole="button" accessibilityLabel={t("Emoji əlavə et")}><Ionicons name="happy-outline" size={22} color={colors.muted} /></Pressable>
                </View>
                <Pressable style={styles.sendButton} onPress={() => sendMessage()} accessibilityRole="button" accessibilityLabel={t("Mesajı göndər")}><Ionicons name="send" size={20} color="#FFFFFF" /></Pressable>
              </View>
            </KeyboardAvoidingView>
          )}

          {menuVisible ? (
            <View style={styles.menuLayer}>
              <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setMenuVisible(false)} />
              <View style={styles.chatMenu}>
                <Pressable style={styles.menuItem} onPress={() => { updateChat(activeChat.id, (chat) => ({ ...chat, favorite: !chat.favorite })); setMenuVisible(false); }}>
                  <Ionicons name={activeChat.favorite ? "heart-dislike-outline" : "heart"} size={19} color={colors.ink} /><Text style={styles.menuText}>{t(activeChat.favorite ? "Seçilmişdən çıxar" : "Seçilmiş et")}</Text>
                </Pressable>
                <Pressable style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert(t("Bütün elanları"), t("İstifadəçinin digər elanları açılacaq.")); }}>
                  <Ionicons name="list" size={19} color={colors.ink} /><Text style={styles.menuText}>{t("Bütün elanları")}</Text>
                </Pressable>
                <Pressable style={[styles.menuItem, styles.menuItemLast]} onPress={() => { updateChat(activeChat.id, (chat) => ({ ...chat, blocked: !chat.blocked })); setMenuVisible(false); }}>
                  <Ionicons name="ban-outline" size={19} color={colors.brand} /><Text style={styles.menuTextDanger}>{t(activeChat.blocked ? "Blokdan çıxar" : "Blok et")}</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <>
          <View style={styles.inboxHeader}>
            <Pressable onPress={onBack} style={styles.inboxBackButton} accessibilityRole="button" accessibilityLabel={t("Geri")}><Ionicons name="arrow-back" size={22} color={colors.ink} /></Pressable>
            <Text style={styles.inboxTitle}>{t("Mesajlar")}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.tabsViewport}>
            <ScrollView
              horizontal
              style={styles.tabs}
              contentContainerStyle={styles.tabsContent}
              showsHorizontalScrollIndicator={false}
              bounces={false}
            >
              {([
                { id: "all", label: "Hamısı" },
                { id: "mine", label: "Mənimkilər" },
                { id: "interested", label: "Maraqlandıqlarım" },
              ] as const).map((item) => {
                const active = tab === item.id;
                return (
                  <Pressable key={item.id} onPress={() => setTab(item.id)} style={[styles.tab, active && styles.tabActive]} accessibilityRole="tab" accessibilityState={{ selected: active }}>
                    <Text numberOfLines={1} style={[styles.tabText, active && styles.tabTextActive]}>{t(item.label)}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}><Ionicons name="search" size={19} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder={t("Söhbətlərdə axtar...")} placeholderTextColor={colors.ink} style={styles.searchInput} returnKeyType="search" /></View>
            <Pressable style={styles.filterButton} onPress={() => { setDraftFilters(filters); setFilterVisible(true); }} accessibilityRole="button" accessibilityLabel={t("Filtr")}><Ionicons name="options-outline" size={22} color={colors.ink} /></Pressable>
          </View>

          <ScrollView style={styles.inboxList} contentContainerStyle={styles.inboxListContent} showsVerticalScrollIndicator={false}>
            {filteredChats.length ? filteredChats.map((chat) => (
              <Pressable key={chat.id} onPress={() => openChat(chat)} style={styles.conversationRow} accessibilityRole="button">
                <View style={styles.conversationPhoto}>
                  <Image source={{ uri: chat.item.image }} style={styles.conversationImage} resizeMode="cover" />
                  {chat.unread ? <View style={styles.unreadDot} /> : null}
                </View>
                <View style={styles.conversationCopy}>
                  <View style={styles.conversationTitleRow}><Text style={styles.conversationTitle} numberOfLines={1}>{t(chat.item.title)}</Text><Text style={styles.conversationDate}>{t(chat.updatedAt)}</Text></View>
                  <Text style={styles.conversationSubtitle} numberOfLines={1}>{t(chat.kind === "business" ? "Biznes" : "Elan")} · {t(chat.name)}</Text>
                  <Text style={[styles.lastMessage, chat.unread && styles.lastMessageUnread]} numberOfLines={2}>{t(chat.lastMessage)}</Text>
                </View>
                {chat.favorite ? <Ionicons name="heart" size={16} color={colors.brand} /> : null}
              </Pressable>
            )) : <Text style={styles.emptyText}>{t("Yüklənmiş söhbətlərdə uyğun nəticə yoxdur.")}</Text>}
          </ScrollView>

          <View style={[styles.countFooter, { paddingBottom: Math.max(16, insets.bottom + 10) }]}><Text style={styles.countText}>{t("Söhbətlərin sayı:")} {filteredChats.length}</Text></View>

          <FilterSheet
            visible={filterVisible}
            value={draftFilters}
            onChange={setDraftFilters}
            onClose={() => setFilterVisible(false)}
            onReset={() => setDraftFilters(emptyFilters)}
            onApply={() => { setFilters(draftFilters); setFilterVisible(false); }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

function FilterSheet({ visible, value, onChange, onClose, onReset, onApply }: {
  visible: boolean;
  value: InboxFilters;
  onChange: (value: InboxFilters) => void;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
}) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const toggle = (key: "unreadOnly" | "favoritesOnly") => onChange({ ...value, [key]: !value[key] });
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.filterBackdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={[styles.filterSheet, { paddingBottom: Math.max(24, insets.bottom + 12) }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.filterTitleRow}><Text style={styles.filterTitle}>{t("Filtr")}</Text><Pressable onPress={onReset}><Text style={styles.resetText}>{t("Sıfırla")}</Text></Pressable><Pressable onPress={onClose} style={styles.closeFilter} accessibilityLabel={t("Bağla")}><Ionicons name="close" size={21} color={colors.brand} /></Pressable></View>

          <Text style={styles.filterSectionTitle}>{t("Növ")}</Text>
          <View style={styles.optionGroup}>
            {([
              { id: "all", label: "Hamısı" },
              { id: "listing", label: "Elanlar" },
              { id: "business", label: "Bizneslər" },
            ] as const).map((option, index) => {
              const selected = value.kind === option.id;
              return <Pressable key={option.id} onPress={() => onChange({ ...value, kind: option.id })} style={[styles.optionCell, index > 0 && styles.cellDivider]}><Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={17} color={selected ? colors.brand : colors.muted} /><Text style={[styles.optionText, selected && styles.optionTextSelected]}>{t(option.label)}</Text></Pressable>;
            })}
          </View>

          <Text style={styles.filterSectionTitle}>{t("Status")}</Text>
          <View style={styles.optionGroup}>
            <Pressable onPress={() => toggle("unreadOnly")} style={styles.optionCell}><Ionicons name={value.unreadOnly ? "checkbox" : "square-outline"} size={18} color={value.unreadOnly ? colors.brand : colors.muted} /><Text style={styles.optionText}>{t("Oxunmamış")}</Text></Pressable>
            <Pressable onPress={() => toggle("favoritesOnly")} style={[styles.optionCell, styles.cellDivider]}><Ionicons name={value.favoritesOnly ? "checkbox" : "square-outline"} size={18} color={value.favoritesOnly ? colors.brand : colors.muted} /><Text style={styles.optionText}>{t("Seçilmişlər")}</Text></Pressable>
          </View>

          <Text style={styles.filterSectionTitle}>{t("Sıralama")}</Text>
          <View style={styles.optionGroup}>
            {([
              { id: "newest", label: "Ən yeni" },
              { id: "oldest", label: "Ən köhnə" },
            ] as const).map((option, index) => {
              const selected = value.sort === option.id;
              return <Pressable key={option.id} onPress={() => onChange({ ...value, sort: option.id })} style={[styles.optionCell, index > 0 && styles.cellDivider]}><Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={17} color={selected ? colors.brand : colors.muted} /><Text style={[styles.optionText, selected && styles.optionTextSelected]}>{t(option.label)}</Text></Pressable>;
            })}
          </View>
          <Pressable onPress={onApply} style={styles.applyButton}><Text style={styles.applyText}>{t("Nəticələri göstər")}</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  inboxHeader: { height: 64, flexShrink: 0, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  inboxBackButton: { width: 40, height: 42, justifyContent: "center" },
  inboxTitle: { position: "absolute", left: 60, right: 60, textAlign: "center", color: colors.ink, fontSize: 22, fontWeight: "800" },
  headerSpacer: { width: 40 },
  tabsViewport: { height: 56, flexGrow: 0, flexShrink: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  tabs: { height: 55, flexGrow: 0, flexShrink: 0 },
  tabsContent: { height: 55, paddingHorizontal: 18, flexDirection: "row", alignItems: "center" },
  tab: { width: 150, height: 55, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", borderBottomWidth: 3, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: colors.brand },
  tabText: { color: colors.muted, fontSize: 14, fontWeight: "500" },
  tabTextActive: { color: colors.brand },
  searchRow: { flexShrink: 0, paddingHorizontal: 20, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 14 },
  searchBox: { flex: 1, height: 54, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 11, borderWidth: 1, borderColor: "#E3E5EA", borderRadius: 30, backgroundColor: "#FFFFFF" },
  searchInput: { flex: 1, color: colors.ink, fontSize: 15, paddingVertical: 0 },
  filterButton: { width: 54, height: 54, borderRadius: 17, backgroundColor: "#F1F2F5", alignItems: "center", justifyContent: "center" },
  inboxList: { flex: 1, minHeight: 0 },
  inboxListContent: { paddingHorizontal: 20, paddingBottom: 12 },
  conversationRow: { minHeight: 128, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  conversationPhoto: { width: 68, height: 68, borderRadius: 16, backgroundColor: "#F3F4F6" },
  conversationImage: { width: "100%", height: "100%", borderRadius: 16 },
  unreadDot: { position: "absolute", right: -2, top: -2, width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: "#FFFFFF", backgroundColor: colors.brand },
  conversationCopy: { flex: 1, minWidth: 0, gap: 7 },
  conversationTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  conversationTitle: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: "700" },
  conversationDate: { color: colors.muted, fontSize: 12 },
  conversationSubtitle: { color: colors.muted, fontSize: 13 },
  lastMessage: { color: "#657084", fontSize: 13, lineHeight: 19 },
  lastMessageUnread: { color: colors.ink, fontWeight: "600" },
  emptyText: { marginTop: 40, marginHorizontal: 30, color: colors.muted, fontSize: 16, lineHeight: 25 },
  countFooter: { minHeight: 58, flexShrink: 0, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  countText: { color: colors.muted, fontSize: 14, fontWeight: "500" },

  chatScreen: { flex: 1, backgroundColor: "#FFFFFF" },
  chatHeader: { height: 66, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 10 },
  backButton: { width: 38, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F3F4F6" },
  avatar: { width: 54, height: 54, borderRadius: 28, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#F4F4F5", backgroundColor: "#E5E7EB" },
  chatName: { flex: 1, color: colors.ink, fontSize: 17, fontWeight: "700" },
  moreButton: { width: 36, height: 42, alignItems: "center", justifyContent: "center" },
  listingPreview: { minHeight: 94, marginHorizontal: 16, marginTop: 8, marginBottom: 12, padding: 11, flexDirection: "row", alignItems: "center", gap: 11, borderWidth: 1, borderColor: colors.line, borderRadius: 19, backgroundColor: "#FFFFFF" },
  previewImage: { width: 68, height: 64, borderRadius: 11, backgroundColor: "#F2F3F5" },
  previewCopy: { flex: 1, minWidth: 0 },
  previewPrice: { color: colors.brand, fontSize: 19, fontWeight: "800" },
  previewTitle: { marginTop: 4, color: colors.ink, fontSize: 14, fontWeight: "700" },
  openListingButton: { minHeight: 44, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", borderRadius: 22, borderWidth: 1, borderColor: colors.line },
  openListingText: { color: colors.brand, fontSize: 12, fontWeight: "700" },
  messagesScroll: { flex: 1 },
  messagesContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 18, gap: 16 },
  olderButton: { alignSelf: "center", minHeight: 42, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 24, backgroundColor: "#FFF0F2" },
  olderText: { color: colors.brand, fontSize: 14, fontWeight: "700" },
  messageRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  messageRowMine: { justifyContent: "flex-end" },
  messageAvatar: { width: 34, height: 34, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#E5E7EB" },
  bubble: { maxWidth: "78%", minWidth: 95, paddingHorizontal: 14, paddingTop: 11, paddingBottom: 8, borderRadius: 22 },
  bubbleThem: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 7 },
  bubbleMine: { backgroundColor: "#FFF0F2", borderBottomRightRadius: 7 },
  bubbleText: { color: colors.ink, fontSize: 16, lineHeight: 22 },
  bubbleMeta: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 3 },
  bubbleTime: { color: colors.muted, fontSize: 11 },
  composer: { paddingHorizontal: 15, paddingTop: 8, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#FFFFFF", borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  attachButton: { width: 42, height: 44, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFB" },
  inputWrap: { flex: 1, minHeight: 48, maxHeight: 112, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "#E1E4E9", borderRadius: 26 },
  messageInput: { flex: 1, maxHeight: 96, color: colors.ink, fontSize: 15, paddingVertical: 10 },
  sendButton: { width: 50, height: 50, borderRadius: 26, alignItems: "center", justifyContent: "center", backgroundColor: colors.brand, elevation: 3 },
  blockedBanner: { paddingHorizontal: 18, paddingTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  blockedText: { color: colors.muted, fontSize: 13 },
  unblockText: { color: colors.brand, fontWeight: "700" },
  menuLayer: { ...StyleSheet.absoluteFillObject, zIndex: 4 },
  chatMenu: { position: "absolute", top: 60, right: 18, width: 230, paddingHorizontal: 14, borderRadius: 18, backgroundColor: "#FFFFFF", elevation: 12, shadowColor: "#000000", shadowOpacity: 0.14, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
  menuItem: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  menuItemLast: { borderBottomWidth: 0 },
  menuText: { color: colors.ink, fontSize: 14, fontWeight: "500" },
  menuTextDanger: { color: colors.brand, fontSize: 14, fontWeight: "500" },

  filterBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(17,24,39,0.38)" },
  filterSheet: { paddingTop: 11, paddingHorizontal: 20, borderTopLeftRadius: 27, borderTopRightRadius: 27, backgroundColor: "#FFFFFF" },
  sheetHandle: { width: 38, height: 5, alignSelf: "center", marginBottom: 18, borderRadius: 3, backgroundColor: "#D6D9DF" },
  filterTitleRow: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 16 },
  filterTitle: { flex: 1, color: colors.ink, fontSize: 23, fontWeight: "700" },
  resetText: { color: colors.brand, fontSize: 14, fontWeight: "600" },
  closeFilter: { width: 32, height: 38, alignItems: "flex-end", justifyContent: "center" },
  filterSectionTitle: { marginTop: 19, marginBottom: 11, color: colors.ink, fontSize: 16, fontWeight: "700" },
  optionGroup: { minHeight: 58, flexDirection: "row", alignItems: "stretch", borderWidth: 1, borderColor: colors.line, borderRadius: 15, overflow: "hidden" },
  optionCell: { flex: 1, minHeight: 58, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  cellDivider: { borderLeftWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  optionText: { color: colors.ink, fontSize: 13 },
  optionTextSelected: { color: colors.brand },
  applyButton: { minHeight: 58, marginTop: 21, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: colors.brand },
  applyText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
