"use server";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";

export async function loginAdmin(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "solange2024";

  if (!username || !password || username !== validUser || password !== validPass) {
    redirect("/admin/login?error=1");
  }

  await createSession(username);
  redirect("/admin");
}

export async function logoutAdmin() {
  await destroySession();
  redirect("/admin/login");
}
