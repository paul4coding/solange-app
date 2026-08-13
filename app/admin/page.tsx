import Link from "next/link";
import {
  Images, FolderOpen, Scissors, Plus,
  Layers, Star, ExternalLink,
  ChevronRight, Upload, CalendarDays, Inbox,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { query } from "@/lib/db";

const ICON_MAP: Record<string, React.ReactNode> = {
  scissors: <Scissors size={14} />,
  flower:   <Layers size={14} />,
  sparkles: <Star size={14} />,
  crown:    <Layers size={14} />,
  users:    <Layers size={14} />,
  star:     <Star size={14} />,
};

export const dynamic = "force-dynamic";

type CountRow = { total: number };

export default async function AdminDashboard() {
  let totalImages = 0;
  let featuredImages = 0;
  let pendingBookings = 0;
  let unreadMessages = 0;

  try {
    const [totRow] = await query<CountRow>(
      "SELECT COUNT(*) as total FROM images WHERE is_active = 1"
    );
    const [featRow] = await query<CountRow>(
      "SELECT COUNT(*) as total FROM images WHERE is_active = 1 AND is_featured = 1"
    );
    const [bookRow] = await query<CountRow>(
      "SELECT COUNT(*) as total FROM bookings WHERE status = 'pending'"
    );
    const [msgRow] = await query<CountRow>(
      "SELECT COUNT(*) as total FROM contact_messages WHERE is_read = 0"
    );
    totalImages     = totRow?.total  ?? 0;
    featuredImages  = featRow?.total ?? 0;
    pendingBookings = bookRow?.total ?? 0;
    unreadMessages  = msgRow?.total  ?? 0;
  } catch {
    // DB not configured yet — show dashes
  }

  const STATS = [
    { label: "Réservations en attente", value: pendingBookings, icon: <CalendarDays size={18} />, color: "#8B1A1A", href: "/admin/bookings?status=pending" },
    { label: "Messages non lus",        value: unreadMessages,  icon: <Inbox size={18} />,        color: "#1A3A6B", href: "/admin/messages" },
    { label: "Images en catalogue",     value: totalImages,     icon: <Images size={18} />,       color: "#C9A96E", href: "/admin/catalog" },
    { label: "Services actifs",         value: SERVICES.length, icon: <Scissors size={18} />,     color: "#1A6B3A", href: "/admin/services" },
  ];

  const ACTIONS = [
    { title: "Voir les réservations",  desc: "Confirmer, annuler, suivre les acomptes",                href: "/admin/bookings",        icon: <CalendarDays size={20} />, color: "#8B1A1A" },
    { title: "Lire les messages",      desc: "Demandes reçues via le formulaire de contact",           href: "/admin/messages",        icon: <Inbox size={20} />,     color: "#1A3A6B" },
    { title: "Rechercher des images",  desc: "Pexels, Unsplash — télécharger vers le catalogue",       href: "/admin/images",          icon: <Images size={20} />,    color: "#8B1A1A" },
    { title: "Mes photos",             desc: "Importe tes propres photos depuis ton ordinateur",        href: "/admin/images?tab=upload", icon: <Upload size={20} />,   color: "#C9A96E" },
    { title: "Gérer le catalogue",     desc: "Voir, modifier, supprimer et mettre en avant les images", href: "/admin/catalog",          icon: <FolderOpen size={20} />, color: "#1A1A1A" },
    { title: "Nouveau service",        desc: "Ajoute un service personnalisé (Butterfly Locs, etc.)",  href: "/admin/services",         icon: <Plus size={20} />,      color: "#1A6B3A" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue dans l&apos;espace admin de Solange&apos;s Hair Braiding</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => (
          <Link key={i} href={s.href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: s.color }}>
                {s.icon}
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Actions rapides</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {ACTIONS.map((a) => (
          <Link key={a.href} href={a.href}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform"
              style={{ backgroundColor: a.color }}>
              {a.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-0.5">{a.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tableau services */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tous les services</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Catégorie</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Prix</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s) => (
              <tr key={s.slug} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #8B1A1A, #C9A96E)" }}>
                      {ICON_MAP[s.icon] ?? <Scissors size={14} />}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-400 capitalize text-xs hidden sm:table-cell">{s.category}</td>
                <td className="px-5 py-3 font-semibold text-sm hidden md:table-cell" style={{ color: "var(--color-primary)" }}>
                  ${s.startingPrice}+
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/images?service=${s.slug}`}
                      className="text-xs px-3 py-1.5 rounded-lg text-white hover:opacity-80 transition-opacity font-semibold flex items-center gap-1"
                      style={{ backgroundColor: "var(--color-primary)" }}>
                      <Images size={11} /> Images
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
