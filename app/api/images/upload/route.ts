import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { query, queryOne } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const denied = await requireApiAuth();
  if (denied) return denied;

  try {
    const formData    = await request.formData();
    const file        = formData.get("file") as File | null;
    const serviceSlug = formData.get("serviceSlug") as string;
    const altText     = formData.get("altText") as string;
    const isFeatured  = formData.get("isFeatured") === "true";

    if (!file || !serviceSlug) {
      return NextResponse.json({ error: "file and serviceSlug are required" }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder:    `solange-hair-braiding/${serviceSlug}`,
      public_id: `${serviceSlug}-owner-${Date.now()}`,
      tags:      [serviceSlug, "owner-upload", "solange"],
      transformation: [
        { quality: "auto:good", fetch_format: "auto", width: 1200, crop: "limit" },
      ],
    });

    const tags = JSON.stringify([serviceSlug, "owner-upload"]);
    const alt  = altText || `${serviceSlug.replace(/-/g, " ")} style`;

    await query(
      `INSERT INTO images
        (service_slug, source, original_url, cloudinary_url, cloudinary_public_id,
         width, height, alt_text, tags, is_featured, is_active)
       VALUES (?, 'owner', ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [serviceSlug, result.secure_url, result.secure_url, result.public_id,
       result.width, result.height, alt, tags, isFeatured ? 1 : 0]
    );

    const image = await queryOne("SELECT * FROM images ORDER BY created_at DESC LIMIT 1");
    return NextResponse.json({ success: true, image });
  } catch (e: unknown) {
    console.error("Upload error:", e);
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
