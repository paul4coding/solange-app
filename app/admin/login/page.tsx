import { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { loginAdmin } from "./actions";

export const metadata: Metadata = { title: "Admin Login — Solange's" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#1A1A1A" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logos/logo.png"
            alt="Solange's Hair Braiding"
            width={180}
            height={68}
            style={{ maxWidth: "180px", height: "auto", backgroundColor: "#FBF0E3", borderRadius: 8 }}
          />
        </div>

        <h1 className="text-center text-lg font-bold text-gray-900 mb-1">
          Espace Admin
        </h1>
        <p className="text-center text-xs text-gray-400 mb-6">
          Connectez-vous pour gérer le salon
        </p>

        {error === "1" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
            Identifiants incorrects. Réessayez.
          </div>
        )}

        <form action={loginAdmin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              placeholder="admin"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#8B1A1A" }}
          >
            Se connecter <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
