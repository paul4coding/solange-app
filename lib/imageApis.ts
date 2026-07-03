export interface ImageResult {
  id: string;
  source: "pinterest" | "pexels" | "pixabay" | "unsplash" | "google";
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photographerUrl: string;
  sourceUrl: string;
}

/* ─── Pinterest (prioritaire) ─── */
export async function searchPinterest(query: string, perPage = 15): Promise<ImageResult[]> {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://api.pinterest.com/v5/search/pins?query=${encodeURIComponent(query)}&page_size=${Math.min(perPage, 50)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      // Code 3 = app not approved yet by Pinterest
      if (body.code === 3) {
        console.warn("Pinterest: App not approved yet. Submit for review at developers.pinterest.com");
      } else {
        console.error(`Pinterest API error ${res.status}:`, body.message);
      }
      return [];
    }
    const data = await res.json();
    const pins = data.items || [];

    return pins
      .filter((p: any) => p.media?.images)
      .map((p: any) => {
        const images = p.media.images;
        // Get best available image (largest first)
        const full =
          images["1200x"] ||
          images["736x"] ||
          images["600x"] ||
          images["400x"] ||
          images["236x"] ||
          Object.values(images)[0];
        const preview =
          images["600x"] ||
          images["400x"] ||
          images["236x"] ||
          full;

        return {
          id: `pinterest-${p.id}`,
          source: "pinterest" as const,
          url: (full as any)?.url || "",
          previewUrl: (preview as any)?.url || (full as any)?.url || "",
          width: (full as any)?.width || 0,
          height: (full as any)?.height || 0,
          alt: p.title || p.description || query,
          photographer: p.pinner?.username || "Pinterest",
          photographerUrl: p.pinner?.profile_url || "https://pinterest.com",
          sourceUrl: `https://pinterest.com/pin/${p.id}/`,
        };
      })
      .filter((r: ImageResult) => r.url);
  } catch (e: any) {
    console.error("Pinterest search error:", e.message);
    return [];
  }
}

/* ─── Pexels ─── */
export async function searchPexels(query: string, perPage = 15): Promise<ImageResult[]> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`,
    { headers: { Authorization: process.env.PEXELS_API_KEY! } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.photos || []).map((p: any) => ({
    id: `pexels-${p.id}`,
    source: "pexels" as const,
    url: p.src.large2x,
    previewUrl: p.src.large,
    width: p.width,
    height: p.height,
    alt: p.alt || query,
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
    sourceUrl: p.url,
  }));
}

/* ─── Pixabay ─── */
export async function searchPixabay(query: string, perPage = 15): Promise<ImageResult[]> {
  const res = await fetch(
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${perPage}&safesearch=true&orientation=vertical`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.hits || []).map((p: any) => ({
    id: `pixabay-${p.id}`,
    source: "pixabay" as const,
    url: p.largeImageURL,
    previewUrl: p.webformatURL,
    width: p.imageWidth,
    height: p.imageHeight,
    alt: p.tags || query,
    photographer: p.user,
    photographerUrl: `https://pixabay.com/users/${p.user}-${p.user_id}/`,
    sourceUrl: p.pageURL,
  }));
}

/* ─── Unsplash ─── */
export async function searchUnsplash(query: string, perPage = 15): Promise<ImageResult[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`,
    { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((p: any) => ({
    id: `unsplash-${p.id}`,
    source: "unsplash" as const,
    url: p.urls.full,
    previewUrl: p.urls.regular,
    width: p.width,
    height: p.height,
    alt: p.alt_description || query,
    photographer: p.user.name,
    photographerUrl: `${p.user.links.html}?utm_source=solange_hair_braiding&utm_medium=referral`,
    sourceUrl: `${p.links.html}?utm_source=solange_hair_braiding&utm_medium=referral`,
  }));
}

/* ─── Google Custom Search Images ─── */
export async function searchGoogle(query: string, perPage = 10): Promise<ImageResult[]> {
  const key = process.env.GOOGLE_API_KEY;
  const cx  = process.env.GOOGLE_CX_ID;
  if (!key || !cx) {
    console.warn("Google Search: GOOGLE_API_KEY ou GOOGLE_CX_ID manquant");
    return [];
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=${Math.min(perPage, 10)}&imgType=photo&imgSize=large&safe=active`
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Google Search error:", err?.error?.message);
      return [];
    }
    const data = await res.json();
    return (data.items || []).map((item: any, i: number) => ({
      id: `google-${i}-${Date.now()}`,
      source: "google" as const,
      url: item.link,
      previewUrl: item.image?.thumbnailLink || item.link,
      width: item.image?.width || 800,
      height: item.image?.height || 600,
      alt: item.title || query,
      photographer: item.displayLink || "Google Images",
      photographerUrl: item.image?.contextLink || "",
      sourceUrl: item.image?.contextLink || item.link,
    }));
  } catch (e: any) {
    console.error("Google search error:", e.message);
    return [];
  }
}

/* ─── Combined — Pinterest en premier ─── */
export async function searchAllSources(
  query: string,
  perPage = 10
): Promise<ImageResult[]> {
  const [pinterest, pexels, pixabay, unsplash] = await Promise.allSettled([
    searchPinterest(query, perPage),
    searchPexels(query, perPage),
    searchPixabay(query, perPage),
    searchUnsplash(query, perPage),
  ]);

  const results: ImageResult[] = [];
  // Pinterest prioritaire — en premier
  if (pinterest.status === "fulfilled") results.push(...pinterest.value);
  if (pexels.status === "fulfilled") results.push(...pexels.value);
  if (pixabay.status === "fulfilled") results.push(...pixabay.value);
  if (unsplash.status === "fulfilled") results.push(...unsplash.value);
  return results;
}
