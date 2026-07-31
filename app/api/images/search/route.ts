import { NextRequest, NextResponse } from "next/server";
import { searchAllSources, searchPinterest, searchPexels, searchPixabay, searchUnsplash, searchGoogle } from "@/lib/imageApis";
import { requireApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const source = searchParams.get("source") || "all";
  const perPage = parseInt(searchParams.get("per_page") || "12");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    let results;
    switch (source) {
      case "pinterest":
        results = await searchPinterest(query, perPage);
        break;
      case "pexels":
        results = await searchPexels(query, perPage);
        break;
      case "pixabay":
        results = await searchPixabay(query, perPage);
        break;
      case "unsplash":
        results = await searchUnsplash(query, perPage);
        break;
      case "google":
        results = await searchGoogle(query, perPage);
        break;
      default:
        results = await searchAllSources(query, Math.ceil(perPage / 4));
    }

    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error("Image search error:", error);
    return NextResponse.json({ error: "Failed to search images" }, { status: 500 });
  }
}
