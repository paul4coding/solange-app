"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { EDITABLE_FIELDS, type SettingKey } from "@/lib/settings";

const ALLOWED = new Set<string>(EDITABLE_FIELDS.map((f) => f.key));

export async function saveSettings(formData: FormData) {
  await requireAuth();

  const entries: [SettingKey, string][] = [];
  for (const [key, raw] of formData.entries()) {
    // Liste blanche : une clé inattendue est ignorée, jamais écrite en base.
    if (!ALLOWED.has(key)) continue;
    entries.push([key as SettingKey, String(raw).trim()]);
  }

  if (entries.length === 0) redirect("/admin/settings?error=1");

  try {
    for (const [key, value] of entries) {
      await query(
        "INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
        [key, value]
      );
    }
  } catch (e) {
    console.error("Settings save failed:", e);
    redirect("/admin/settings?error=1");
  }

  // Les coordonnées apparaissent sur tout le site : on rafraîchit l'ensemble.
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
