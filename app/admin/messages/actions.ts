"use server";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function toggleMessageRead(formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));
  if (!id) return;

  await query("UPDATE contact_messages SET is_read = 1 - is_read WHERE id = ?", [id]);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData) {
  await requireAuth();

  const id = Number(formData.get("id"));
  if (!id) return;

  await query("DELETE FROM contact_messages WHERE id = ?", [id]);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
