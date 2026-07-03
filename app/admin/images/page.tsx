"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Search, Download, Check, Eye, Star, Loader2,
  Upload, ImagePlus, X, ChevronDown, Globe, Info,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";

interface ImageResult {
  id: string;
  source: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photographerUrl: string;
  sourceUrl?: string;
}

interface UploadFile {
  file: File;
  preview: string;
  altText: string;
  featured: boolean;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

interface CustomService { slug: string; name: string; }

const SOURCES = [
  { value: "all",      label: "Toutes les sources" },
  { value: "google",   label: "🔍 Google Images", badge: "Recommandé" },
  { value: "pexels",   label: "Pexels" },
  { value: "unsplash", label: "Unsplash" },
  { value: "pixabay",  label: "Pixabay" },
];

export default function AdminImagesPage() {
  const [tab, setTab]               = useState<"search" | "upload">("search");
  const [serviceSlug, setServiceSlug] = useState<string>(SERVICES[0].slug);
  const [query, setQuery]           = useState("");
  const [source, setSource]         = useState("all");
  const [results, setResults]       = useState<ImageResult[]>([]);
  const [loading, setLoading]       = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [featured, setFeatured]     = useState<Set<string>>(new Set());
  const [error, setError]           = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploadingAll, setUploadingAll] = useState(false);
  const [customServices, setCustomServices] = useState<CustomService[]>([]);
  const [googleReady, setGoogleReady]   = useState<boolean | null>(null);
  const [googleError, setGoogleError]   = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("service");
    if (s) setServiceSlug(s);
    const t = params.get("tab");
    if (t === "upload") setTab("upload");

    fetch("/api/admin/services")
      .then(r => r.json())
      .then(d => setCustomServices((d.services || []).map((s: any) => ({ slug: s.slug, name: s.name }))));

    // Vérification réelle des clés Google
    fetch("/api/images/google-check")
      .then(r => r.json())
      .then(d => {
        setGoogleReady(d.configured === true);
        if (!d.configured) {
          if (d.reason === "missing_keys") setGoogleError("Clés GOOGLE_API_KEY / GOOGLE_CX_ID manquantes dans .env.local");
          else if (d.reason === "image_search_disabled") setGoogleError("Active «Image Search» dans ton moteur Programmable Search");
          else if (d.reason === "api_error") setGoogleError(`Erreur API Google : ${d.detail}`);
          else setGoogleError("Google non disponible");
        }
      })
      .catch(() => { setGoogleReady(false); setGoogleError("Impossible de joindre Google"); });
  }, []);

  const allServices = [
    ...SERVICES.map(s => ({ slug: s.slug, name: s.name })),
    ...customServices,
  ];
  const currentService = allServices.find(s => s.slug === serviceSlug);

  // ── Recherche ──
  const search = useCallback(async (overrideQuery?: string) => {
    const q = (overrideQuery ?? query).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(q)}&source=${source}&per_page=24`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
      if ((data.results || []).length === 0) {
        if (source === "google" && googleReady === false) {
          setError(`Google n'est pas configuré : ${googleError || "clés manquantes"}. Choisis Pexels ou Unsplash à la place.`);
        } else {
          setError("Aucune image trouvée. Essaie des mots-clés plus simples en anglais, ex : \"butterfly locs black woman\".");
        }
      }
    } catch (err: any) {
      setError(err.message || "Recherche échouée");
    } finally {
      setLoading(false);
    }
  }, [query, source]);

  const downloadImage = async (img: ImageResult) => {
    if (downloading) return;
    setDownloading(img.id);
    try {
      const res = await fetch("/api/images/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: img.url,
          serviceSlug,
          title: img.alt,
          source: img.source,
          sourceId: img.id,
          altText: `${img.alt} - ${serviceSlug.replace(/-/g, " ")}`,
          photographer: img.photographer,
          photographerUrl: img.photographerUrl,
          tags: [serviceSlug, "hair braiding", img.source],
          isFeatured: featured.has(img.id),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDownloaded(prev => new Set([...prev, img.id]));
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    for (const img of results) {
      if (!downloaded.has(img.id)) await downloadImage(img);
    }
  };

  // ── Upload fichiers ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(prev => [
      ...prev,
      ...files.map(file => ({
        file, preview: URL.createObjectURL(file),
        altText: "", featured: false, status: "pending" as const,
      })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadFile = async (index: number) => {
    const item = uploadFiles[index];
    if (item.status !== "pending") return;
    setUploadFiles(prev => { const n = [...prev]; n[index] = { ...n[index], status: "uploading" }; return n; });
    try {
      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("serviceSlug", serviceSlug);
      fd.append("altText", item.altText || item.file.name.replace(/\.[^.]+$/, ""));
      fd.append("isFeatured", String(item.featured));
      const res = await fetch("/api/images/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUploadFiles(prev => { const n = [...prev]; n[index] = { ...n[index], status: "done" }; return n; });
    } catch (e: any) {
      setUploadFiles(prev => { const n = [...prev]; n[index] = { ...n[index], status: "error", error: e.message }; return n; });
    }
  };

  const uploadAll = async () => {
    setUploadingAll(true);
    for (let i = 0; i < uploadFiles.length; i++) {
      if (uploadFiles[i].status === "pending") await uploadFile(i);
    }
    setUploadingAll(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des images</h1>
        <p className="text-sm text-gray-500 mt-1">Recherche et importe des photos pour chaque style de tresses</p>
      </div>

      {/* ── SÉLECTEUR DE SERVICE — bien visible ── */}
      <div className="bg-gradient-to-r from-[#8B1A1A] to-[#C9A96E] rounded-2xl p-5 mb-6 text-white">
        <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">
          Étape 1 — Choisis le service cible
        </p>
        <p className="text-sm opacity-90 mb-3">
          Toutes les images que tu télécharges ou importes seront ajoutées à ce service.
        </p>
        <div className="relative">
          <select
            value={serviceSlug}
            onChange={e => { setServiceSlug(e.target.value); setResults([]); setDownloaded(new Set()); }}
            className="w-full appearance-none bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl px-4 py-3 pr-10 text-sm font-bold focus:outline-none focus:bg-white/30"
          >
            <optgroup label="Services de base">
              {SERVICES.map(s => (
                <option key={s.slug} value={s.slug} className="text-gray-900 bg-white">
                  {s.name} — ${s.startingPrice}+
                </option>
              ))}
            </optgroup>
            {customServices.length > 0 && (
              <optgroup label="Mes services personnalisés">
                {customServices.map(s => (
                  <option key={s.slug} value={s.slug} className="text-gray-900 bg-white">{s.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none" />
        </div>
        <p className="text-xs opacity-60 mt-2">
          ✓ Service sélectionné : <strong className="opacity-100">{currentService?.name}</strong>
        </p>
      </div>

      {/* ── ONGLETS ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button onClick={() => setTab("search")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "search" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
          <Search size={15} /> Rechercher en ligne
        </button>
        <button onClick={() => setTab("upload")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "upload" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
          <Upload size={15} /> Mes photos
          {uploadFiles.length > 0 && (
            <span className="text-xs font-bold text-white w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#8B1A1A" }}>
              {uploadFiles.length}
            </span>
          )}
        </button>
      </div>

      {/* ── ONGLET RECHERCHE ── */}
      {tab === "search" && (
        <>
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Étape 2 — Recherche des images</p>

            <div className="grid sm:grid-cols-4 gap-3 mb-4">
              {/* Source */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Source</label>
                <select value={source} onChange={e => setSource(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A]">
                  {SOURCES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {source === "google" && googleReady === null && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" /> Vérification...
                  </p>
                )}
                {source === "google" && googleReady === false && (
                  <p className="text-xs text-orange-500 mt-1 flex items-center gap-1 leading-tight">
                    <Info size={11} className="shrink-0" /> {googleError || "Non configuré"}
                  </p>
                )}
                {source === "google" && googleReady === true && (
                  <p className="text-xs text-green-600 mt-1 font-semibold">✓ Google opérationnel</p>
                )}
              </div>

              {/* Recherche */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Mots-clés</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && search()}
                    placeholder={`Ex: ${currentService?.name} black woman portrait...`}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B1A1A]"
                  />
                  <button onClick={() => search()} disabled={loading || !query.trim()}
                    className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
                    style={{ backgroundColor: "#8B1A1A" }}>
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                    {loading ? "..." : "Chercher"}
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestions rapides */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 font-semibold">Suggestions :</span>
              {[
                `${currentService?.name} black woman`,
                `${currentService?.name} african woman portrait`,
                `${currentService?.name} natural hair`,
                "protective hairstyle black woman",
                "african braids melanin",
              ].map(q => (
                <button key={q} onClick={() => { setQuery(q); search(q); }}
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Notice Google non configuré */}
          {source === "google" && googleReady === false && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Globe size={16} /> Configurer Google Images (gratuit — 100 recherches/jour)
              </h3>
              <ol className="text-sm text-blue-800 space-y-1.5 list-decimal ml-4">
                <li>Va sur <strong>console.cloud.google.com</strong> → crée un projet → active <strong>Custom Search API</strong> → crée une clé API</li>
                <li>Va sur <strong>programmablesearch.google.com</strong> → crée un moteur de recherche → coche "Recherche d'images" → copie l'ID (cx)</li>
                <li>Ajoute dans <code className="bg-blue-100 px-1 rounded">.env.local</code> :</li>
              </ol>
              <pre className="mt-3 bg-blue-900 text-blue-100 rounded-xl p-3 text-xs overflow-auto">
{`GOOGLE_API_KEY=ta_clé_api_google
GOOGLE_CX_ID=ton_identifiant_cx`}
              </pre>
              <p className="text-xs text-blue-600 mt-2">Redémarre le serveur après avoir ajouté les clés.</p>
            </div>
          )}

          {error && results.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">{error}</div>
          )}

          {/* Résultats */}
          {results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{results.length} images trouvées</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Elles seront ajoutées à : <strong className="text-[#8B1A1A]">{currentService?.name}</strong>
                  </p>
                </div>
                <button onClick={downloadAll}
                  className="text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: "#C9A96E" }}>
                  <Download size={13} /> Tout sauvegarder ({results.filter(r => !downloaded.has(r.id)).length})
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {results.map(img => (
                  <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img src={img.previewUrl} alt={img.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <a href={img.sourceUrl || img.url} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                            <Eye size={14} className="text-gray-700" />
                          </a>
                          <button onClick={() => setFeatured(prev => { const n = new Set(prev); n.has(img.id) ? n.delete(img.id) : n.add(img.id); return n; })}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${featured.has(img.id) ? "bg-yellow-400" : "bg-white hover:bg-gray-100"}`}>
                            <Star size={14} className={featured.has(img.id) ? "text-white" : "text-gray-700"} fill={featured.has(img.id) ? "white" : "none"} />
                          </button>
                          <button onClick={() => downloadImage(img)} disabled={!!downloading || downloaded.has(img.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${downloaded.has(img.id) ? "bg-green-500" : "bg-[#8B1A1A] hover:bg-[#6B1414]"}`}>
                            {downloading === img.id ? <Loader2 size={14} className="text-white animate-spin" />
                              : downloaded.has(img.id) ? <Check size={14} className="text-white" />
                              : <Download size={14} className="text-white" />}
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-black/60 text-white capitalize">{img.source}</span>
                      </div>
                      {downloaded.has(img.id) && (
                        <div className="absolute top-2 right-2">
                          <span className="text-xs px-1.5 py-0.5 rounded-md bg-green-500 text-white flex items-center gap-1">
                            <Check size={10} /> Sauvé
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-400 truncate">{img.photographer}</p>
                      <button onClick={() => downloadImage(img)} disabled={!!downloading || downloaded.has(img.id)}
                        className={`mt-1.5 w-full text-xs py-1.5 rounded-lg font-semibold transition-all ${downloaded.has(img.id) ? "bg-green-100 text-green-700" : "text-white hover:opacity-90"}`}
                        style={{ backgroundColor: downloaded.has(img.id) ? undefined : "#8B1A1A" }}>
                        {downloaded.has(img.id) ? "✓ Sauvé" : downloading === img.id ? "..." : "Sauvegarder"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div className="text-center py-16 text-gray-400">
              <Search size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Entre des mots-clés pour trouver des images</p>
              <p className="text-xs mt-1 opacity-70">Les images téléchargées iront dans <strong>{currentService?.name}</strong></p>
            </div>
          )}
        </>
      )}

      {/* ── ONGLET MES PHOTOS ── */}
      {tab === "upload" && (
        <div>
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Étape 2 — Importe tes photos</p>
            <p className="text-sm text-gray-500">
              Sélectionne des photos depuis ton ordinateur. Elles seront ajoutées à <strong className="text-[#8B1A1A]">{currentService?.name}</strong>.
            </p>
          </div>

          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-[#8B1A1A] hover:bg-red-50/20 transition-all mb-5 group">
            <ImagePlus size={36} className="mx-auto mb-3 text-gray-300 group-hover:text-[#8B1A1A] transition-colors" />
            <p className="text-sm font-semibold text-gray-600 group-hover:text-[#8B1A1A]">Cliquer pour sélectionner des photos</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Plusieurs photos à la fois</p>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
          </div>

          {uploadFiles.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">{uploadFiles.length} photo{uploadFiles.length > 1 ? "s" : ""} sélectionnée{uploadFiles.length > 1 ? "s" : ""}</p>
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 flex items-center gap-1.5">
                    <ImagePlus size={13} /> Ajouter
                  </button>
                  <button onClick={uploadAll} disabled={uploadingAll || uploadFiles.every(f => f.status !== "pending")}
                    className="text-xs font-semibold text-white px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                    style={{ backgroundColor: "#8B1A1A" }}>
                    {uploadingAll ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    {uploadingAll ? "Envoi..." : "Tout envoyer"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {uploadFiles.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="relative aspect-[3/4]">
                      <img src={item.preview} alt="" className="w-full h-full object-cover" />
                      {item.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 size={28} className="text-white animate-spin" />
                        </div>
                      )}
                      {item.status === "done" && (
                        <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                          <Check size={32} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                      {item.status === "pending" && (
                        <>
                          <button onClick={() => { URL.revokeObjectURL(item.preview); setUploadFiles(prev => prev.filter((_, j) => j !== i)); }}
                            className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
                            <X size={12} />
                          </button>
                          <button onClick={() => setUploadFiles(prev => { const n = [...prev]; n[i] = { ...n[i], featured: !n[i].featured }; return n; })}
                            className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center ${item.featured ? "bg-yellow-400" : "bg-black/40"}`}>
                            <Star size={12} className="text-white" fill={item.featured ? "white" : "none"} />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="p-2.5 space-y-2">
                      <p className="text-xs text-gray-400 truncate">{item.file.name}</p>
                      {item.status === "pending" && (
                        <>
                          <input type="text" value={item.altText}
                            onChange={e => setUploadFiles(prev => { const n = [...prev]; n[i] = { ...n[i], altText: e.target.value }; return n; })}
                            placeholder="Description (optionnel)"
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#8B1A1A]"
                          />
                          <button onClick={() => uploadFile(i)}
                            className="w-full text-xs font-semibold text-white py-1.5 rounded-lg hover:opacity-90"
                            style={{ backgroundColor: "#8B1A1A" }}>
                            Envoyer
                          </button>
                        </>
                      )}
                      {item.status === "done" && <p className="text-xs text-green-600 font-semibold text-center">✓ Ajoutée !</p>}
                      {item.status === "error" && <p className="text-xs text-red-500 text-center">{item.error}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {uploadFiles.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Upload size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Sélectionne tes photos ci-dessus</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
