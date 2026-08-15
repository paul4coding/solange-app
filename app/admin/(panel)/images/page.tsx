"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, ImagePlus, X, Loader2, Check, Star } from "lucide-react";

type UploadItem = {
  file: File;
  preview: string;
  altText: string;
  featured: boolean;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export default function AdminImagesPage() {
  const [uploadFiles, setUploadFiles]   = useState<UploadItem[]>([]);
  const [uploadingAll, setUploadingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(prev => [
      ...prev,
      ...files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        altText: "",
        featured: false,
        status: "pending" as const,
      })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateItem = (index: number, patch: Partial<UploadItem>) =>
    setUploadFiles(prev => { const n = [...prev]; n[index] = { ...n[index], ...patch }; return n; });

  const uploadFile = async (index: number) => {
    const item = uploadFiles[index];
    if (item.status !== "pending") return;
    updateItem(index, { status: "uploading" });
    try {
      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("altText", item.altText || item.file.name.replace(/\.[^.]+$/, ""));
      fd.append("isFeatured", String(item.featured));
      const res  = await fetch("/api/images/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      updateItem(index, { status: "done" });
    } catch (e) {
      updateItem(index, { status: "error", error: e instanceof Error ? e.message : "Échec de l'envoi" });
    }
  };

  const uploadAll = async () => {
    setUploadingAll(true);
    for (let i = 0; i < uploadFiles.length; i++) {
      if (uploadFiles[i].status === "pending") await uploadFile(i);
    }
    setUploadingAll(false);
  };

  const removeItem = (index: number) =>
    setUploadFiles(prev => prev.filter((_, i) => i !== index));

  const pending = uploadFiles.filter(f => f.status === "pending").length;
  const done    = uploadFiles.filter(f => f.status === "done").length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ajouter des photos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Importe tes propres photos depuis ton ordinateur. Elles apparaîtront dans la galerie du site.
        </p>
      </div>

      {/* Zone de sélection */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="photo-input"
        />
        <label
          htmlFor="photo-input"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl py-12 cursor-pointer hover:border-[#8B1A1A] hover:bg-red-50/30 transition-colors"
        >
          <ImagePlus size={34} className="text-gray-300" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Choisir des photos</p>
            <p className="text-xs text-gray-400 mt-1">
              JPG ou PNG · plusieurs photos à la fois · redimensionnées automatiquement
            </p>
          </div>
        </label>

        {uploadFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={uploadAll}
              disabled={uploadingAll || pending === 0}
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {uploadingAll ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              Envoyer {pending > 0 ? `(${pending})` : ""}
            </button>
            <button
              onClick={() => setUploadFiles([])}
              disabled={uploadingAll}
              className="text-sm font-semibold text-gray-500 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              Tout effacer
            </button>
            {done > 0 && (
              <span className="text-xs font-semibold text-green-600 inline-flex items-center gap-1.5">
                <Check size={13} /> {done} photo{done > 1 ? "s" : ""} ajoutée{done > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Liste des photos sélectionnées */}
      {uploadFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadFiles.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative aspect-[3/4] bg-gray-50">
                <Image src={item.preview} alt="" fill className="object-cover" unoptimized />
                {item.status === "pending" && (
                  <button
                    onClick={() => removeItem(i)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    aria-label="Retirer"
                  >
                    <X size={13} />
                  </button>
                )}
                {item.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 size={22} className="animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="p-3 space-y-2">
                <input
                  type="text"
                  value={item.altText}
                  onChange={e => updateItem(i, { altText: e.target.value })}
                  disabled={item.status !== "pending"}
                  placeholder="Description (optionnel)"
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#8B1A1A] disabled:bg-gray-50"
                />
                <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.featured}
                    onChange={e => updateItem(i, { featured: e.target.checked })}
                    disabled={item.status !== "pending"}
                    className="accent-[#8B1A1A]"
                  />
                  <Star size={11} /> Mettre en avant
                </label>

                {item.status === "done" && (
                  <p className="text-xs text-green-600 font-semibold flex items-center justify-center gap-1">
                    <Check size={12} /> Ajoutée !
                  </p>
                )}
                {item.status === "error" && (
                  <p className="text-xs text-red-500 text-center">{item.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadFiles.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">Aucune photo sélectionnée pour le moment.</p>
        </div>
      )}
    </div>
  );
}
