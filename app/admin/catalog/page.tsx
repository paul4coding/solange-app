"use client";
import { useState, useEffect } from "react";
import { Trash2, Star, StarOff, Eye, RefreshCw, Filter } from "lucide-react";
import { SERVICES } from "@/lib/constants";

interface CatalogImage {
  id: string;
  service_slug: string;
  title: string;
  source: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  alt_text: string;
  photographer: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export default function AdminCatalogPage() {
  const [images, setImages] = useState<CatalogImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchImages = async (serviceSlug?: string) => {
    setLoading(true);
    try {
      const url = serviceSlug && serviceSlug !== "all"
        ? `/api/images/download?service=${serviceSlug}`
        : "/api/images/download";
      const res = await fetch(url);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Failed to fetch images", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFilterChange = (slug: string) => {
    setFilter(slug);
    fetchImages(slug === "all" ? undefined : slug);
  };

  const toggleFeatured = async (img: CatalogImage) => {
    try {
      await fetch("/api/images/download", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: img.id, updates: { is_featured: !img.is_featured } }),
      });
      setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, is_featured: !i.is_featured } : i));
    } catch (err) {
      console.error("Failed to toggle featured", err);
    }
  };

  const deleteImage = async (img: CatalogImage) => {
    if (!confirm(`Delete "${img.title}"? This cannot be undone.`)) return;
    setDeleting(img.id);
    try {
      await fetch("/api/images/download", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: img.id, cloudinaryPublicId: img.cloudinary_public_id }),
      });
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (err) {
      alert("Failed to delete image");
    } finally {
      setDeleting(null);
    }
  };

  const featured = images.filter((i) => i.is_featured);
  const all = images;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Image Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">{images.length} images • {featured.length} featured</p>
        </div>
        <button onClick={() => fetchImages(filter === "all" ? undefined : filter)}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          <button onClick={() => handleFilterChange("all")}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === "all" ? "text-white" : "text-gray-500 border border-gray-200"}`}
            style={{ backgroundColor: filter === "all" ? "#8B1A1A" : undefined }}>
            All ({images.length})
          </button>
          {SERVICES.map((s) => {
            const count = images.filter((i) => i.service_slug === s.slug).length;
            return (
              <button key={s.slug} onClick={() => handleFilterChange(s.slug)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === s.slug ? "text-white" : "text-gray-500 border border-gray-200"}`}
                style={{ backgroundColor: filter === s.slug ? "#8B1A1A" : undefined }}>
                {s.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <RefreshCw size={32} className="mx-auto mb-3 opacity-30 animate-spin" />
          <p className="text-sm">Loading catalog...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && images.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow-sm">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-sm font-medium">No images in catalog yet</p>
          <p className="text-xs mt-1">Go to Image Search to download images</p>
          <a href="/admin/images" className="mt-4 inline-block text-xs font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90"
            style={{ backgroundColor: "#8B1A1A" }}>
            Search & Download Images →
          </a>
        </div>
      )}

      {/* Grid */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-[3/4] relative overflow-hidden">
                {img.cloudinary_url ? (
                  <img src={img.cloudinary_url} alt={img.alt_text} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">No image</div>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center gap-2">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <a href={img.cloudinary_url} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <Eye size={14} className="text-gray-700" />
                    </a>
                    <button onClick={() => toggleFeatured(img)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${img.is_featured ? "bg-yellow-400" : "bg-white hover:bg-gray-100"}`}>
                      {img.is_featured ? <Star size={14} className="text-white" /> : <StarOff size={14} className="text-gray-700" />}
                    </button>
                    <button onClick={() => deleteImage(img)} disabled={deleting === img.id}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-black/60 text-white capitalize">{img.source}</span>
                  {img.is_featured && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-400 text-white flex items-center gap-0.5">
                      <Star size={9} className="fill-white" /> Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2">
                <p className="text-xs font-medium text-gray-800 truncate">{img.title}</p>
                <p className="text-xs text-gray-400 capitalize">{img.service_slug?.replace(/-/g, " ")}</p>
                <p className="text-xs text-gray-400 truncate">📷 {img.photographer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
