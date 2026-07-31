"use server";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { sendContactAlertToSalon } from "@/lib/email";

export async function submitContactForm(formData: FormData) {
  const name    = (formData.get("name")    as string)?.trim();
  const phone   = (formData.get("phone")   as string)?.trim();
  const email   = (formData.get("email")   as string)?.trim();
  const service = (formData.get("service") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const consent = formData.get("consent");

  if (!name || !phone || !email || !message || !consent) {
    redirect("/contact?error=1");
  }

  try {
    await query(
      "INSERT INTO contact_messages (name, phone, email, service, message) VALUES (?, ?, ?, ?, ?)",
      [name, phone || null, email, service || null, message]
    );
  } catch (e) {
    console.error("Contact insert failed:", e);
  }

  // Alerte au salon — un échec d'envoi ne doit pas bloquer la visiteuse,
  // le message est déjà enregistré et consultable dans l'admin.
  try {
    await sendContactAlertToSalon({ name, email, phone, service, message });
  } catch (emailErr) {
    console.error("Contact email notification failed:", emailErr);
  }

  redirect("/contact?sent=1");
}
