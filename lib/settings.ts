import { cache } from "react";
import { query } from "@/lib/db";
import { BUSINESS } from "@/lib/constants";

/**
 * Coordonnées du salon affichées sur le site.
 *
 * Les valeurs vivent en base (table `settings`) et sont modifiables depuis
 * l'espace admin. Celles qui n'y sont pas encore retombent sur les valeurs
 * par défaut de lib/constants.ts, ce qui garantit un site fonctionnel dès
 * la première installation, avant toute modification.
 */

/** Champs éditables depuis l'admin, dans l'ordre d'affichage du formulaire. */
export const EDITABLE_FIELDS = [
  { key: "phone1",       label: "Téléphone principal",   placeholder: "443.320.1312" },
  { key: "phone2",       label: "Téléphone secondaire",  placeholder: "202.445.8152" },
  { key: "email",        label: "Adresse email",         placeholder: "salon@exemple.com", type: "email" },
  { key: "address",      label: "Adresse",               placeholder: "550 Crain Highway N, Glen Burnie, MD 21061" },
  { key: "addressLine2", label: "Complément d'adresse",  placeholder: "Inside Crain Plaza" },
  { key: "hoursWeekday", label: "Horaires en semaine",   placeholder: "Mon – Sat: 8:00 AM – 7:00 PM" },
  { key: "hoursSunday",  label: "Horaires du dimanche",  placeholder: "Sunday: Closed" },
  { key: "instagram",    label: "Compte Instagram",      placeholder: "@solangehairbraiding" },
  { key: "instagramUrl", label: "Lien Instagram",        placeholder: "https://www.instagram.com/..." },
] as const;

export type SettingKey = (typeof EDITABLE_FIELDS)[number]["key"];

export type BusinessInfo = {
  phone1: string;
  phone2: string;
  phone1Raw: string;
  phone2Raw: string;
  email: string;
  address: string;
  addressLine2: string;
  hours: { weekdays: string; sunday: string };
  instagram: string;
  instagramUrl: string;
  whatsapp: string;
};

/** Ne garde que les chiffres : sert aux liens tel: et WhatsApp. */
function digits(v: string) {
  return v.replace(/\D/g, "");
}

const DEFAULTS: Record<SettingKey, string> = {
  phone1:       BUSINESS.phone1,
  phone2:       BUSINESS.phone2,
  email:        BUSINESS.email,
  address:      BUSINESS.address,
  addressLine2: BUSINESS.addressLine2,
  hoursWeekday: BUSINESS.hours.weekdays,
  hoursSunday:  BUSINESS.hours.sunday,
  instagram:    BUSINESS.instagram,
  instagramUrl: BUSINESS.instagramUrl,
};

/** Valeurs brutes telles qu'enregistrées, pour pré-remplir le formulaire admin. */
export const getSettings = cache(async (): Promise<Record<SettingKey, string>> => {
  const values = { ...DEFAULTS };
  try {
    const rows = await query<{ key: SettingKey; value: string | null }>(
      "SELECT `key`, `value` FROM settings"
    );
    for (const row of rows) {
      if (row.key in values && row.value !== null && row.value !== "") {
        values[row.key] = row.value;
      }
    }
  } catch {
    // Base indisponible : on sert les valeurs par défaut plutôt qu'une page vide.
  }
  return values;
});

/** Coordonnées prêtes à l'affichage, champs dérivés compris. */
export const getBusiness = cache(async (): Promise<BusinessInfo> => {
  const s = await getSettings();
  return {
    phone1:       s.phone1,
    phone2:       s.phone2,
    phone1Raw:    digits(s.phone1),
    phone2Raw:    digits(s.phone2),
    email:        s.email,
    address:      s.address,
    addressLine2: s.addressLine2,
    hours:        { weekdays: s.hoursWeekday, sunday: s.hoursSunday },
    instagram:    s.instagram,
    instagramUrl: s.instagramUrl,
    whatsapp:     digits(s.phone1),
  };
});
