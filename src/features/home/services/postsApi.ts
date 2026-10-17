import type { BlogPost } from "../screens/BlogDetailScreen";

const POSTS_API_URL = "https://api.axtar.az/api/posts";

type ApiPost = {
  id: number | string;
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  id_slug?: string | null;
  excerpt?: string | null;
  summary?: string | null;
  short_description?: string | null;
  description?: string | null;
  content?: string | null;
  body?: string | null;
  text?: string | null;
  category?: string | { id?: number; title?: string; name?: string } | null;
  category_title?: string | null;
  image?: string | { url?: string; path?: string } | null;
  main_image?: string | null;
  main_image_full?: string | null;
  thumbnail?: string | null;
  cover_image?: string | null;
  image_url?: string | null;
  images?: Array<string | { url?: string; image?: string; path?: string }> | null;
  images_full?: string[] | null;
  created_at?: string | null;
  published_at?: string | null;
  date?: string | null;
  view_count?: number | null;
  views_count?: number | null;
  author?: string | { name?: string } | null;
};

type PostsResponse = {
  success?: boolean;
  data: ApiPost[] | { data?: ApiPost[] };
  meta?: { total?: number; current_page?: number; last_page?: number };
};

export type PostsPage = {
  posts: BlogPost[];
  currentPage: number;
  lastPage: number;
  total: number;
};

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  return undefined;
}

function normalizeImage(value?: string) {
  if (!value) return "";
  if (/^https?:\\/\\//i.test(value)) return value;
  return `https://storage.axtar.az/${value.replace(/^\\/+/, "")}`;
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\\s+/g, " ").trim();
}

function getImage(post: ApiPost, images: string[]) {
  const image = typeof post.image === "string" ? post.image : post.image?.url ?? post.image?.path;
  return normalizeImage(
    asString(image) ??
    post.main_image ??
    post.main_image_full ??
    post.thumbnail ??
    post.cover_image ??
    post.image_url ??
    images[0],
  );
}

function getImages(post: ApiPost) {
  const values = [
    ...(post.images ?? []).map((item) => typeof item === "string" ? item : item.url ?? item.image ?? item.path ?? ""),
    ...(post.images_full ?? []),
  ];
  const normalized = values.map(normalizeImage).filter(Boolean);
  const cover = getImage(post, normalized);
  if (cover && !normalized.includes(cover)) normalized.unshift(cover);
  return [...new Set(normalized)];
}

function mapPost(post: ApiPost): BlogPost {
  const images = getImages(post);
  const title = asString(post.title) ?? asString(post.name) ?? `Blog #${post.id}`;
  const content = stripHtml(asString(post.content) ?? asString(post.body) ?? asString(post.text) ?? asString(post.description) ?? "");
  const excerpt = stripHtml(
    asString(post.excerpt) ??
    asString(post.summary) ??
    asString(post.short_description) ??
    asString(post.description) ??
    content,
  );
  const category = typeof post.category === "string"
    ? post.category
    : post.category?.title ?? post.category?.name ?? post.category_title ?? "Blog";
  const createdAt = post.published_at ?? post.created_at ?? post.date ?? undefined;
  const author = typeof post.author === "string" ? post.author : post.author?.name;
  const viewCount = post.view_count ?? post.views_count ?? 0;

  return {
    id: String(post.id),
    slug: post.slug ?? post.id_slug ?? undefined,
    category,
    title,
    excerpt: excerpt.length > 180 ? `${excerpt.slice(0, 177).trim()}…` : excerpt,
    content,
    createdAt,
    viewCount,
    author: author ?? undefined,
    image: getImage(post, images) || "https://axtar.az/img/hand.svg",
    images,
  };
}

export async function fetchPosts(page = 1): Promise<PostsPage> {
  const response = await fetch(`${POSTS_API_URL}?page=${page}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Bloqları yükləmək alınmadı (${response.status})`);

  const payload = await response.json() as PostsResponse;
  const rows = Array.isArray(payload.data) ? payload.data : payload.data?.data;
  if (!Array.isArray(rows)) throw new Error("API cavabının formatı gözlənilən kimi deyil");

  return {
    posts: rows.map(mapPost),
    currentPage: payload.meta?.current_page ?? page,
    lastPage: payload.meta?.last_page ?? page,
    total: payload.meta?.total ?? rows.length,
  };
}
