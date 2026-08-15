import Link from "next/link";
import {
  Images, FolderOpen, Upload, CalendarDays, Inbox,
  ChevronRight, Phone, Mail,
} from "lucide-react";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type CountRow = { total: number };
type RecentBooking = {
  id: number;
  service_name: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

const STATUS_LABEL: Record<RecentBooking["status"], { label: string; bg: string; fg: string }> = {
  pending:   { label: "En attente", bg: "#FEF3C7", fg: "#92400E" },
  confirmed: { label: "Confirmée",  bg: "#D1FAE5", fg: "#065F46" },
  completed: { label: "Terminée",   bg: "#E0E7FF", fg: "#3730A3" },
  cancelled: { label: "Annulée",    bg: "#FEE2E2", fg: "#991B1B" },
};

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminDashboard() {
  let totalImages = 0;
  let featuredImages = 0;
  let pendingBookings = 0;
  let unreadMessages = 0;
  let recent: RecentBooking[] = [];

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
    recent = await query<RecentBooking>(
      `SELECT id, service_name, date, time, client_name, client_phone, client_email, status
       FROM bookings ORDER BY created_at DESC LIMIT 8`
    );
    totalImages     = totRow?.total  ?? 0;
    featuredImages  = featRow?.total ?? 0;
    pendingBookings = bookRow?.total ?? 0;
    unreadMessages  = msgRow?.total  ?? 0;
  } catch {
    // Base non configurée — les compteurs restent à zéro
  }

  const STATS = [
    { label: "Réservations en attente", value: pendingBookings, icon: <CalendarDays size={18} />, color: "#8B1A1A", href: "/admin/bookings?status=pending" },
    { label: "Messages non lus",        value: unreadMessages,  icon: <Inbox size={18} />,        color: "#1A3A6B", href: "/admin/messages" },
    { label: "Photos en ligne",         value: totalImages,     icon: <Images size={18} />,       color: "#C9A96E", href: "/admin/catalog" },
    { label: "Photos en vedette",       value: featuredImages,  icon: <FolderOpen size={18} />,   color: "#1A6B3A", href: "/admin/catalog" },
  ];

  const ACTIONS = [
    { title: "Voir les réservations", desc: "Confirmer, annuler, suivre les acomptes",           href: "/admin/bookings",         icon: <CalendarDays size={20} />, color: "#8B1A1A" },
    { title: "Lire les messages",     desc: "Demandes reçues via le formulaire de contact",      href: "/admin/messages",         icon: <Inbox size={20} />,        color: "#1A3A6B" },
    { title: "Mes photos",            desc: "Importe tes propres photos depuis ton ordinateur",  href: "/admin/images?tab=upload", icon: <Upload size={20} />,       color: "#C9A96E" },
    { title: "Gérer la galerie",      desc: "Voir, mettre en avant et supprimer les photos",     href: "/admin/catalog",          icon: <FolderOpen size={20} />,   color: "#1A1A1A" },
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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

      {/* Dernières réservations */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Dernières réservations</h2>
        <Link href="/admin/bookings" className="text-xs font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
          Tout voir
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {recent.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <CalendarDays size={26} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Aucune réservation pour le moment</p>
            <p className="text-xs text-gray-400 mt-1">
              Les demandes envoyées depuis le site apparaîtront ici.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Style demandé</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => {
                const st = STATUS_LABEL[b.status] ?? STATUS_LABEL.pending;
                return (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{b.client_name}</div>
                      <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1"><Phone size={10} /> {b.client_phone}</span>
                        <span className="inline-flex items-center gap-1 truncate"><Mail size={10} /> {b.client_email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs max-w-xs">
                      <span className="line-clamp-2">{b.service_name}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs hidden md:table-cell whitespace-nowrap">
                      {formatDate(b.date)} · {b.time}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: st.bg, color: st.fg }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
