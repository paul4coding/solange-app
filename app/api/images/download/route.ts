import { NextRequest, NextResponse } from "next/server";
import { uploadImageFromUrl } from "@/lib/cloudinary";
import { query, queryOne } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  try {
    const body = await request.json();
    const { imageUrl, serviceSlug, title, source, sourceId, altText, photographer, photographerUrl, tags, isFeatured } = body;

    if (!imageUrl || !serviceSlug) {
      return NextResponse.json({ error: "imageUrl and serviceSlug are required" }, { status: 400 });
    }

    const cloudinaryResult = await uploadImageFromUrl(imageUrl, {
      folder: `solange-hair-braiding/${serviceSlug}`,
      tags: [serviceSlug, source, ...(tags || [])],
    });

    await query(
      `INSERT INTO images
        (service_slug, title, source, source_id, original_url, cloudinary_url, cloudinary_public_id,
         width, height, alt_text, tags, photographer, photographer_url, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        serviceSlug,
        title || altText || serviceSlug,
        source,
        sourceId || null,
        imageUrl,
        cloudinaryResult.url,
        cloudinaryResult.publicId,
        cloudinaryResult.width,
        cloudinaryResult.height,
        altText || title || serviceSlug,
        JSON.stringify(tags || []),
        photographer || null,
        photographerUrl || null,
        isFeatured ? 1 : 0,
      ]
    );

    const image = await queryOne("SELECT * FROM images ORDER BY created_at DESC LIMIT 1");
    return NextResponse.json({ success: true, image });
  } catch (error: unknown) {
    console.error("Image download error:", error);
    const msg = error instanceof Error ? error.message : "Failed to download image";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  try {
    const { imageId, cloudinaryPublicId } = await request.json();

    if (cloudinaryPublicId) {
      const { deleteImage } = await import("@/lib/cloudinary");
      await deleteImage(cloudinaryPublicId);
    }

    await query("DELETE FROM images WHERE id = ?", [imageId]);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const serviceSlug = searchParams.get("service");
  const featured = searchParams.get("featured");

  try {
    let sql = "SELECT * FROM images WHERE is_active = 1";
    const params: unknown[] = [];

    if (serviceSlug) { sql += " AND service_slug = ?"; params.push(serviceSlug); }
    if (featured === "true") { sql += " AND is_featured = 1"; }
    sql += " ORDER BY created_at DESC";

    const images = await query(sql, params);
    return NextResponse.json({ images });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Query failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Colonnes modifiables depuis le catalogue admin — tout le reste est ignoré,
// pour que les clés reçues ne puissent pas être injectées dans le SQL.
const EDITABLE_COLUMNS = [
  "title", "alt_text", "service_slug", "photographer",
  "is_featured", "is_active",
] as const;

export async function PATCH(request: NextRequest) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  try {
    const { imageId, updates } = await request.json();

    const keys = Object.keys(updates ?? {}).filter(
      (k) => (EDITABLE_COLUMNS as readonly string[]).includes(k)
    );
    if (!imageId || keys.length === 0) {
      return NextResponse.json({ error: "Aucun champ modifiable fourni" }, { status: 400 });
    }

    const fields = keys.map((k) => `\`${k}\` = ?`).join(", ");
    const values = [...keys.map((k) => updates[k]), imageId];
    await query(`UPDATE images SET ${fields} WHERE id = ?`, values);
    const image = await queryOne("SELECT * FROM images WHERE id = ?", [imageId]);
    return NextResponse.json({ success: true, image });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
