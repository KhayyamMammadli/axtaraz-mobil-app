export type CatalogCategory = {
  id: string;
  name: string;
  icon: string;
  children?: CatalogCategory[];
};

export const catalogCategories: CatalogCategory[] = [
  {
    id: "clothing", name: "Geyimlər (Kişi, Qadın, Uşaq)", icon: "🧑‍🎤",
    children: [
      { id: "men-clothing", name: "Kişi geyimləri", icon: "👔", children: [
        { id: "men-shirts", name: "Köynəklər", icon: "👕" },
        { id: "men-tshirts", name: "Futbolkalar", icon: "👕" },
        { id: "men-trousers", name: "Şalvarlar", icon: "👖" },
        { id: "men-outerwear", name: "Gödəkçə və paltolar", icon: "🧥" },
        { id: "men-shoes", name: "Ayaqqabılar", icon: "👞" },
        { id: "men-accessories", name: "Aksesuarlar", icon: "🧢" },
      ]},
      { id: "women-clothing", name: "Qadın geyimləri", icon: "👗", children: [
        { id: "women-dresses", name: "Donlar", icon: "👗" },
        { id: "women-shoes", name: "Ayaqqabılar", icon: "👠" },
        { id: "women-bags", name: "Çantalar", icon: "👜" },
        { id: "women-accessories", name: "Aksesuarlar", icon: "💍" },
      ]},
      { id: "kids-clothing", name: "Uşaq geyimləri", icon: "🧒", children: [
        { id: "kids-boys", name: "Oğlan uşaqları üçün", icon: "🧢" },
        { id: "kids-girls", name: "Qız uşaqları üçün", icon: "🎀" },
        { id: "kids-shoes", name: "Uşaq ayaqqabıları", icon: "👟" },
      ]},
      { id: "clothing-watches", name: "Saatlar və zinət əşyaları", icon: "⌚" },
    ],
  },
  { id: "sports", name: "İdman və əyləncə", icon: "🏢", children: [
    { id: "fitness", name: "Fitnes və idman alətləri", icon: "🏋️" },
    { id: "bicycles", name: "Velosipedlər", icon: "🚲" },
    { id: "sportswear", name: "İdman geyimləri", icon: "🏃" },
    { id: "games", name: "Oyunlar və konsollar", icon: "🎮" },
    { id: "musical-instruments", name: "Musiqi alətləri", icon: "🎸" },
  ]},
  { id: "food", name: "Qida Məhsulları", icon: "🧊", children: [
    { id: "fruit-veg", name: "Meyvə və tərəvəz", icon: "🍎" },
    { id: "meat", name: "Ət və süd məhsulları", icon: "🥩" },
    { id: "bakery", name: "Şirniyyat və un məmulatları", icon: "🥐" },
    { id: "other-food", name: "Digər qida məhsulları", icon: "🛒" },
  ]},
  { id: "restaurants", name: "Restoranlar, Kafelər", icon: "🏡", children: [
    { id: "restaurants-rent", name: "Restoran və kafe avadanlığı", icon: "🍽️" },
    { id: "restaurants-business", name: "Hazır restoran və kafelər", icon: "🏪" },
    { id: "restaurants-jobs", name: "Restoran vakansiyaları", icon: "👨‍🍳" },
  ]},
  { id: "jewelry", name: "Qızıl Zinət Əşyaları", icon: "🚚", children: [
    { id: "gold", name: "Qızıl", icon: "💛" },
    { id: "silver", name: "Gümüş", icon: "🤍" },
    { id: "watches", name: "Saatlar", icon: "⌚" },
    { id: "jewelry-other", name: "Digər zinət əşyaları", icon: "💍" },
  ]},
  { id: "medical", name: "Tibbi Məhsullar", icon: "🏥", children: [
    { id: "medical-equipment", name: "Tibbi avadanlıqlar", icon: "🩺" },
    { id: "medical-products", name: "Dərman və tibbi məhsullar", icon: "💊" },
    { id: "medical-services", name: "Tibbi xidmətlər", icon: "⚕️" },
  ]},
  { id: "businesses", name: "Hazır Bizneslər", icon: "🧑‍🎤", children: [
    { id: "business-sale", name: "Satışda olan bizneslər", icon: "🏬" },
    { id: "business-partner", name: "Tərəfdaş axtarılır", icon: "🤝" },
    { id: "business-equipment", name: "Biznes avadanlıqları", icon: "🧰" },
  ]},
  { id: "animals", name: "Heyvanlar", icon: "🧑‍⚕️", children: [
    { id: "pets", name: "Ev heyvanları", icon: "🐶" },
    { id: "farm-animals", name: "Kənd təsərrüfatı heyvanları", icon: "🐄" },
    { id: "animal-accessories", name: "Heyvanlar üçün məhsullar", icon: "🐾" },
  ]},
  { id: "children", name: "Uşaq üçün", icon: "🧸", children: [
    { id: "baby-clothes", name: "Uşaq geyimləri", icon: "👶" },
    { id: "toys", name: "Oyuncaqlar", icon: "🧸" },
    { id: "strollers", name: "Uşaq arabaları", icon: "🚼" },
    { id: "child-furniture", name: "Uşaq mebeli", icon: "🛏️" },
  ]},
  { id: "lost-found", name: "İtmiş əşyalar", icon: "🏢", children: [
    { id: "lost-items", name: "İtirilmiş əşyalar", icon: "🔎" },
    { id: "found-items", name: "Tapılmış əşyalar", icon: "📍" },
  ]},
  { id: "outlet", name: "Outlet", icon: "🧊", children: [
    { id: "outlet-clothing", name: "Geyim və ayaqqabı", icon: "👟" },
    { id: "outlet-electronics", name: "Elektronika", icon: "📱" },
    { id: "outlet-home", name: "Ev üçün", icon: "🏠" },
  ]},
  { id: "jobs", name: "İş elanları", icon: "🏡", children: [
    { id: "jobs-vacancies", name: "Vakansiyalar", icon: "💼" },
    { id: "jobs-seeking", name: "İş axtaranlar", icon: "🔍" },
  ]},
  { id: "hobbies", name: "Hobbi və Asudə", icon: "🚚", children: [
    { id: "books", name: "Kitablar", icon: "📚" },
    { id: "collectibles", name: "Kolleksiya əşyaları", icon: "🪙" },
    { id: "outdoor", name: "Turizm və istirahət", icon: "🏕️" },
  ]},
  { id: "beauty", name: "Gözəllik və Sağlamlıq", icon: "🏥", children: [
    { id: "cosmetics", name: "Kosmetika", icon: "💄" },
    { id: "beauty-services", name: "Gözəllik xidmətləri", icon: "💅" },
    { id: "health-products", name: "Sağlamlıq məhsulları", icon: "🌿" },
  ]},
  { id: "transport", name: "Nəqliyyat", icon: "🚚", children: [
    { id: "cars", name: "Minik avtomobilləri", icon: "🚘" },
    { id: "commercial-transport", name: "Yük və kommersiya nəqliyyatı", icon: "🚛" },
    { id: "motorcycles", name: "Motosikletlər", icon: "🏍️" },
    { id: "transport-rent", name: "Nəqliyyat icarəsi", icon: "🔑" },
  ]},
  { id: "parts", name: "Ehtiyat Hissələri və Aksesuarlar", icon: "🧑‍⚕️", children: [
    { id: "car-parts", name: "Avtomobil ehtiyat hissələri", icon: "⚙️" },
    { id: "car-accessories", name: "Avtomobil aksesuarları", icon: "🚘" },
    { id: "tires", name: "Şinlər və disklər", icon: "🛞" },
    { id: "car-electronics", name: "Avtoelektronika", icon: "🔌" },
  ]},
  { id: "electronics", name: "Elektronika", icon: "📱", children: [
    { id: "phones", name: "Telefonlar", icon: "📱" },
    { id: "computers", name: "Kompüter və noutbuklar", icon: "💻" },
    { id: "appliances", name: "Məişət texnikası", icon: "🧺" },
    { id: "electronics-accessories", name: "Aksesuarlar", icon: "🎧" },
  ]},
  { id: "property", name: "Daşınmaz əmlak", icon: "🏘️", children: [
    { id: "apartments", name: "Mənzillər", icon: "🏢" },
    { id: "houses", name: "Həyət evləri və bağ evləri", icon: "🏡" },
    { id: "land", name: "Torpaq sahələri", icon: "🌳" },
    { id: "commercial-property", name: "Obyektlər və ofislər", icon: "🏬" },
  ]},
  { id: "home-garden", name: "Ev və bağ", icon: "🪴", children: [
    { id: "furniture", name: "Mebel", icon: "🛋️" },
    { id: "home-appliances", name: "Ev əşyaları", icon: "🪑" },
    { id: "garden", name: "Bağ və həyət", icon: "🌱" },
  ]},
  { id: "services", name: "Xidmətlər", icon: "🛠️", children: [
    { id: "repair", name: "Təmir və tikinti", icon: "🧱" },
    { id: "education", name: "Təhsil və kurslar", icon: "📖" },
    { id: "delivery", name: "Daşınma və çatdırılma", icon: "📦" },
    { id: "other-services", name: "Digər xidmətlər", icon: "🧰" },
  ]},
];
