export type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  age: string;
  image: string;
  badge?: string;
};

export const categories = [
  { id: "electronics", title: "Elektronika", icon: "phone-portrait-outline" as const, tint: "#F0F5FF", color: "#4676D7" },
  { id: "property", title: "Daşınmaz əmlak", icon: "home-outline" as const, tint: "#FFF3EA", color: "#DA7C35" },
  { id: "transport", title: "Nəqliyyat", icon: "car-outline" as const, tint: "#EEF9F3", color: "#2B9B68" },
  { id: "fashion", title: "Geyimlər", icon: "shirt-outline" as const, tint: "#F8F0FF", color: "#8B5BC7" },
  { id: "home", title: "Ev və bağ", icon: "leaf-outline" as const, tint: "#FFF7E8", color: "#C68D2D" },
  { id: "services", title: "Xidmətlər", icon: "construct-outline" as const, tint: "#EEF7FA", color: "#3A91A7" },
];

export const businesses = [
  { id: "business-2", name: "Test MMC", listings: "0 elan" },
  { id: "business-3", name: "TEst 2", listings: "0 elan" },
  { id: "business-1", name: "template 2", listings: "0 elan" },
];

const ownershipCover = "https://storage.axtar.az/uploads/ownerships_main/min/2026/06/05/e7aac09e3bdeefa0c19f2791ddba60dd.png";
export { ownershipCover };

export const listings: Listing[] = [
  {
    id: "101",
    title: "Şlaqbaum 055 245 89 79",
    price: "1 000 ₼",
    location: "Bakı",
    age: "2 həftə əvvəl",
    image: "https://storage.axtar.az/uploads/products/min/2026/09/26/6ab7d75336d91-aa3beea2921e6a4155a296aa972d631b.jpg",
    badge: "PREMIUM",
  },
  {
    id: "100",
    title: "Maksisoft turniket sistemi",
    price: "1 000 ₼",
    location: "Bakı",
    age: "2 həftə əvvəl",
    image: "https://storage.axtar.az/uploads/products/min/2026/09/26/6ab7cfa6b5cba-f5d5588b203305afbd39f96fb8f2c770.jpeg",
    badge: "VIP",
  },
  {
    id: "99",
    title: "Bollard satışı",
    price: "2 000 ₼",
    location: "Bakı",
    age: "2 həftə əvvəl",
    image: "https://storage.axtar.az/uploads/products/min/2026/09/26/6ab7c15bbf1bd-35140c78f08e062ccc1268230f19f868.jpeg",
  },
  {
    id: "97",
    title: "Delineatorların satışı",
    price: "50 ₼",
    location: "Bakı",
    age: "1 ay əvvəl",
    image: "https://storage.axtar.az/uploads/products/min/2026/09/05/6a9c366362327-8df8c1e56e9b838f3bcbb8aa0a1357ac.jpg",
  },
];

export const feedTabs = [
  { id: "premium", label: "Premium", icon: "diamond" as const },
  { id: "vip", label: "VIP", icon: "ribbon" as const },
  { id: "urgent", label: "Təcili", icon: "flash" as const },
  { id: "discount", label: "Endirimlər", icon: "pricetag" as const },
  { id: "recommended", label: "Tövsiyə", icon: "thumbs-up" as const },
  { id: "latest", label: "Son elanlar", icon: "time" as const },
];
