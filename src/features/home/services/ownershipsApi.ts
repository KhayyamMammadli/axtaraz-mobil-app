import type { Business } from "../data/homeData";

const OWNERSHIPS_API_URL = "https://api.axtar.az/api/ownerships";

type ApiOwnership = {
  id: number | string;
  status?: string | null;
  level?: string | null;
  recommended?: number | boolean | null;
  title: string;
  slogan?: string | null;
  description?: string | null;
  mobile_number?: string | null;
  subdomain?: string | null;
  url?: string | null;
  template?: string | null;
  category?: { id?: number; title?: string } | null;
  active_menu_links?: string[] | null;
  work_days?: string[] | null;
  work_day_names?: string[] | null;
  socials?: Record<string, string | null> | null;
  main_image?: string | null;
  main_image_full?: string | null;
  images?: string[] | null;
  images_full?: string[] | null;
  products_count?: number | null;
  created_at?: string | null;
};

type OwnershipsResponse = {
  success?: boolean;
  data: ApiOwnership[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
};

export type OwnershipsPage = {
  businesses: Business[];
  currentPage: number;
  lastPage: number;
  total: number;
};

function formatPhone(value?: string | null) {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+994 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 12 && digits.startsWith("994")) {
    return `+994 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return value;
}

function mapOwnership(ownership: ApiOwnership): Business {
  const productsCount = ownership.products_count ?? 0;
  return {
    id: String(ownership.id),
    name: ownership.title,
    listings: `${productsCount} elan`,
    slogan: ownership.slogan ?? undefined,
    description: ownership.description ?? undefined,
    phone: formatPhone(ownership.mobile_number),
    url: ownership.url ?? undefined,
    subdomain: ownership.subdomain ?? undefined,
    template: ownership.template ?? undefined,
    category: ownership.category?.title ?? undefined,
    activeMenuLinks: ownership.active_menu_links ?? [],
    workDayNames: ownership.work_day_names ?? [],
    socials: ownership.socials ?? {},
    image: ownership.main_image ?? ownership.main_image_full ?? undefined,
    images: ownership.images?.length ? ownership.images : ownership.images_full ?? [],
    productsCount,
    status: ownership.status ?? undefined,
    level: ownership.level ?? undefined,
    recommended: Boolean(ownership.recommended),
    createdAt: ownership.created_at ?? undefined,
  };
}

export async function fetchOwnerships(page = 1): Promise<OwnershipsPage> {
  const response = await fetch(`${OWNERSHIPS_API_URL}?page=${page}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Bizneslər yüklənmədi (${response.status})`);
  }

  const payload = await response.json() as OwnershipsResponse;
  if (!Array.isArray(payload.data)) {
    throw new Error("API cavabının formatı gözlənilən kimi deyil");
  }

  return {
    businesses: payload.data.map(mapOwnership),
    currentPage: payload.meta?.current_page ?? page,
    lastPage: payload.meta?.last_page ?? page,
    total: payload.meta?.total ?? payload.data.length,
  };
}
