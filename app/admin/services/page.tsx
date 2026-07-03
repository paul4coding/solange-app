"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Images, Plus, X, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/constants";

const CATEGORIES = ["braids", "twists", "cornrows", "kids", "locs", "weaves"];

interface CustomService {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  starting_price: number;
  duration: string;
  featured: boolean;
}

const EMPTY_FORM = {
  name: "",
  category: "braids",
  description: "",
  startingPrice: "100",
  duration: "3-5 hours",
  featured: false,
};

export default function AdminServicesPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [customServices, setCustomServices] = useState<CustomService[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((d) => setCustomServices(d.services || []))
      .finally(() => setLoadingCustom(false));
  }, []);

  const filtered = SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCustom = customServices.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCustomServices((prev) => [data.service, ...prev]);
      setSaveOk(true);
      setTimeout(() => {
        setSaveOk(false);
        setShowForm(false);
        setForm(EMPTY_FORM);
      }, 1500);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce service ?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCustomServices((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            {SERVICES.length} services de base · {customServices.length} service{customServices.length !== 1 ? "s" : ""} personnalisé{customServices.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#8B1A1A" }}
        >
          <Plus size={16} />
          Nouveau service
        </button>
      </div>

      {/* Modal nouveau service */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">Nouveau service</h2>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setSaveError(null); }}
                className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Nom du service *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ex: Butterfly Locs, Goddess Braids..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A]"
                />
                {form.name && (
                  <p className="text-xs text-gray-400 mt-1">
                    Slug : <code className="bg-gray-100 px-1 rounded">{form.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}</code>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Prix de départ ($)</label>
                  <input
                    type="number"
                    value={form.startingPrice}
                    onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A]"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Durée estimée</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="ex: 4-6 hours"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Décris le style en 1-2 phrases..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A] resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#8B1A1A]"
                />
                <span className="text-sm text-gray-700">Mettre en avant sur la page d'accueil</span>
              </label>

              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {saveError}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setSaveError(null); }}
                className="flex-1 text-sm font-semibold text-gray-600 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="flex-1 text-sm font-semibold text-white py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#8B1A1A" }}
              >
                {saveOk ? (
                  <><CheckCircle2 size={16} /> Créé !</>
                ) : saving ? (
                  <><Loader2 size={16} className="animate-spin" /> Création...</>
                ) : (
                  <><Plus size={16} /> Créer le service</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtre recherche */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un service..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1A1A]"
        />
      </div>

      {/* Services personnalisés (MySQL) */}
      {!loadingCustom && filteredCustom.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-gold)" }}>
            Mes services personnalisés
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustom.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm border-2 border-[#C9A96E33]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm text-gray-900">{s.name}</h3>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                        Nouveau
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{s.category} · {s.duration}</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>
                    ${s.starting_price}+
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{s.description}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/images?service=${s.slug}`}
                    className="flex-1 text-xs text-center font-semibold text-white py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                    style={{ backgroundColor: "#8B1A1A" }}
                  >
                    <Images size={12} /> Gérer les images
                  </Link>
                  <Link
                    href={`/services/${s.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-gray-600 border border-gray-200 py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="text-xs text-red-400 border border-red-100 py-2 px-3 rounded-lg hover:bg-red-50 flex items-center"
                  >
                    {deleting === s.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services de base (constants) */}
      {CATEGORIES.map((cat) => {
        const catServices = filtered.filter((s) => s.category === cat);
        if (catServices.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 capitalize text-gray-400">
              {cat}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catServices.map((s) => (
                <div key={s.slug} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 mb-0.5">{s.name}</h3>
                      <span className="text-xs text-gray-400 capitalize">{s.category} · {s.duration}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>
                      ${s.startingPrice}+
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{s.description}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/images?service=${s.slug}`}
                      className="flex-1 text-xs text-center font-semibold text-white py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                      style={{ backgroundColor: "#8B1A1A" }}
                    >
                      <Images size={12} /> Gérer les images
                    </Link>
                    <Link
                      href={`/services/${s.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-gray-600 border border-gray-200 py-2 px-3 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> Voir
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
