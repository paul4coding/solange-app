"use server";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import {
  sendBookingConfirmationToClient,
  sendBookingAlertToSalon,
} from "@/lib/email";

export async function submitBooking(formData: FormData) {
  const serviceSlug = (formData.get("serviceSlug") as string)?.trim();
  const serviceName = (formData.get("serviceName") as string)?.trim();
  const date        = (formData.get("date")        as string)?.trim();
  const time        = (formData.get("time")        as string)?.trim();
  const name        = (formData.get("name")        as string)?.trim();
  const phone       = (formData.get("phone")       as string)?.trim();
  const email       = (formData.get("email")       as string)?.trim();
  const stylist     = (formData.get("stylist")     as string)?.trim();
  const notes       = (formData.get("notes")       as string)?.trim();

  if (!serviceSlug || !date || !time || !name || !phone || !email) {
    redirect("/booking?error=1");
  }

  try {
    await query(
      `INSERT INTO bookings
        (service_slug, service_name, date, time, client_name, client_phone, client_email, stylist, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [serviceSlug, serviceName || null, date, time, name, phone, email, stylist || null, notes || null]
    );
  } catch (e) {
    console.error("Booking insert failed:", e);
    // Still redirect to confirmation — the salon is notified via the params
  }

  // Send email notifications (non-blocking — errors don't prevent confirmation)
  try {
    await Promise.all([
      sendBookingConfirmationToClient({
        clientName:  name,
        clientEmail: email,
        service:     serviceName || serviceSlug,
        date,
        time,
        stylist:     stylist || undefined,
        notes:       notes   || undefined,
      }),
      sendBookingAlertToSalon({
        clientName:  name,
        clientEmail: email,
        clientPhone: phone,
        service:     serviceName || serviceSlug,
        date,
        time,
        stylist:     stylist || undefined,
        notes:       notes   || undefined,
      }),
    ]);
  } catch (emailErr) {
    console.error("Email notification failed:", emailErr);
    // Don't block the user — booking is already saved
  }

  console.log("Booking:", { serviceSlug, date, time, name, phone, email });

  const params = new URLSearchParams({ name, service: serviceName || serviceSlug, date, time });
  redirect(`/booking/confirmation?${params.toString()}`);
}
