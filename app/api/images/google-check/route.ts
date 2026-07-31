import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";

export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;

  const key = process.env.GOOGLE_API_KEY?.trim();
  const cx  = process.env.GOOGLE_CX_ID?.trim();

  if (!key || !cx) {
    return NextResponse.json({ configured: false, reason: "missing_keys" });
  }

  // Vérification rapide avec 1 résultat pour s'assurer que la clé + le CX sont valides
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=hair+braiding&searchType=image&num=1&safe=active`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();

    if (!res.ok) {
      const msg: string = data?.error?.message || "unknown";
      const code: number = data?.error?.code || res.status;

      if (msg.toLowerCase().includes("image")) {
        return NextResponse.json({ configured: false, reason: "image_search_disabled", detail: msg });
      }
      return NextResponse.json({ configured: false, reason: "api_error", code, detail: msg });
    }

    return NextResponse.json({ configured: true, quota: data.searchInformation?.totalResults });
  } catch (e: any) {
    return NextResponse.json({ configured: false, reason: "network_error", detail: e.message });
  }
}
