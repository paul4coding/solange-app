import { Check, AlertCircle, Save, Info } from "lucide-react";
import { EDITABLE_FIELDS, getSettings } from "@/lib/settings";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const values = await getSettings();

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coordonnées du salon</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ces informations s&apos;affichent sur tout le site : bandeau du haut, page Contact,
          pied de page et emails de réservation.
        </p>
      </div>

      {saved === "1" && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm mb-6">
          <Check size={16} className="shrink-0" />
          Modifications enregistrées. Elles sont déjà visibles sur le site.
        </div>
      )}
      {error === "1" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6">
          <AlertCircle size={16} className="shrink-0" />
          L&apos;enregistrement a échoué. Vérifie la connexion à la base de données.
        </div>
      )}

      <form action={saveSettings} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        {EDITABLE_FIELDS.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">
              {f.label}
            </label>
            <input
              id={f.key}
              name={f.key}
              type={"type" in f ? f.type : "text"}
              defaultValue={values[f.key]}
              placeholder={f.placeholder}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A] transition-colors"
            />
          </div>
        ))}

        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <Info size={14} className="shrink-0 mt-0.5 text-gray-400" />
          <p className="leading-relaxed">
            Les liens « appeler » et WhatsApp sont générés automatiquement à partir du
            téléphone principal : écris-le comme tu veux l&apos;afficher, les points et
            espaces sont ignorés.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Save size={15} /> Enregistrer
        </button>
      </form>
    </div>
  );
}
