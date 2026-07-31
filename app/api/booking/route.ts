import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceSlug, serviceName, date, time, name, phone, email, stylist, notes } = body;

    if (!serviceSlug || !date || !time || !name || !phone || !email) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    await query(
      `INSERT INTO bookings
        (service_slug, service_name, date, time, client_name, client_phone, client_email, stylist, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [serviceSlug, serviceName || null, date, time, name, phone, email, stylist || null, notes || null]
    );

    const booking = await queryOne<{ id: number }>("SELECT LAST_INSERT_ID() as id");
    return NextResponse.json({ success: true, booking });
  } catch (e: unknown) {
    console.error("Booking error:", e);
    const msg = e instanceof Error ? e.message : "Booking failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  const denied = await requireApiAuth();
  if (denied) return denied;

  try {
    const bookings = await query(
      "SELECT * FROM bookings ORDER BY date ASC, time ASC"
    );
    return NextResponse.json({ bookings });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Query failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
