"use server";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;
type Status = (typeof STATUSES)[number];

export async function updateBookingStatus(formData: FormData) {
  await requireAuth();

  const id     = Number(formData.get("id"));
  const status = String(formData.get("status")) as Status;

  if (!id || !STATUSES.includes(status)) return;

  await query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function toggleDepositPaid(formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));
  if (!id) return;

  await query("UPDATE bookings SET deposit_paid = 1 - deposit_paid WHERE id = ?", [id]);
  revalidatePath("/admin/bookings");
}
