import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const services = await query(
      "SELECT * FROM services WHERE is_active = 1 ORDER BY created_at DESC"
    );
    return NextResponse.json({ services });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Query failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, description, startingPrice, duration, featured } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "name and category are required" }, { status: 400 });
    }

    const slug = toSlug(name);
    await query(
      `INSERT INTO services (slug, name, category, description, starting_price, duration, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [slug, name, category, description || "", parseInt(startingPrice) || 100, duration || "3-5 hours", featured ? 1 : 0]
    );

    const service = await queryOne("SELECT * FROM services WHERE slug = ?", [slug]);
    return NextResponse.json({ success: true, service });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Insert failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await query("UPDATE services SET is_active = 0 WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
