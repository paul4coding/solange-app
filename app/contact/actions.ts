"use server";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

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

  console.log("Contact form:", { name, phone, email, service, message });

  redirect("/contact?sent=1");
}
