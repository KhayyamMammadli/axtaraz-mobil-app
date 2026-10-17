import type { Listing } from "../data/homeData";

const PRODUCTS_API_URL = "https://api.axtar.az/api/products";

type ApiProduct = {
  id: number | string;
  id_slug?: string | null;
  title: string;
  description?: string | null;
  price?: number | string | null;
  image?: string | null;
  images?: Array<string | { url?: string; image?: string }> | null;
  city_id?: number | null;
  city?: { title?: string; name?: string } | null;
  city_title?: string | null;
  category?: { id?: number; title?: string } | null;
  level?: string | null;
  status?: string | null;
  view_count?: number | null;
  started_at?: string | null;
};

type ProductsResponse = {
  success?: boolean;
  data: ApiProduct[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
};

export type ProductsPage = {
  listings: Listing[];
  currentPage: number;
  lastPage: number;
  total: number;
};

function formatPrice(value: ApiProduct["price"]) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "—";
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₼`;
}

function formatPhone(description: string) {
  const match = description.match(/\+994[\d\s().-]{7,}/);
  if (!match) return undefined;
  const digits = match[0].replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("994")) {
    return `+994 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return match[0].trim();
}

function getImages(product: ApiProduct) {
  const images = (product.images ?? [])
    .map((image) => typeof image === "string" ? image : image.url ?? image.image ?? "")
    .filter(Boolean);
  if (product.image && !images.includes(product.image)) images.unshift(product.image);
  return images;
}

function mapProduct(product: ApiProduct): Listing {
  const description = product.description ?? "";
  const level = product.level?.toLowerCase();
  const badge = level === "premium" ? "Premium" : level === "vip" ? "VIP" : level === "urgent" ? "Təcili" : undefined;

  return {
    id: String(product.id),
    slug: product.id_slug ?? undefined,
    title: product.title,
    description,
    price: formatPrice(product.price),
    location: product.city?.title ?? product.city?.name ?? product.city_title ?? (product.city_id === 1 ? "Bakı" : "Bakı"),
    age: product.started_at ? new Date(product.started_at).toLocaleDateString("az-AZ") : "",
    image: product.image ?? getImages(product)[0] ?? "",
    images: getImages(product),
    badge,
    category: product.category?.title ?? "",
    viewCount: product.view_count ?? 0,
    startedAt: product.started_at ?? undefined,
    status: product.status ?? undefined,
    phone: formatPhone(description),
  };
}

export async function fetchProducts(page = 1): Promise<ProductsPage> {
  const response = await fetch(`${PRODUCTS_API_URL}?page=${page}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Elanlar yüklənmədi (${response.status})`);
  }

  const payload = await response.json() as ProductsResponse;
  if (!Array.isArray(payload.data)) {
    throw new Error("API cavabının formatı gözlənilən kimi deyil");
  }

  return {
    listings: payload.data.map(mapProduct),
    currentPage: payload.meta?.current_page ?? page,
    lastPage: payload.meta?.last_page ?? page,
    total: payload.meta?.total ?? payload.data.length,
  };
}
