import Link from "next/link";
import { LayoutDashboard, Images, FolderOpen, Scissors, LogOut, CalendarDays, Inbox, ArrowLeft } from "lucide-react";
import { logoutAdmin } from "./login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/bookings", label: "Réservations", icon: <CalendarDays size={16} /> },
  { href: "/admin/messages", label: "Messages", icon: <Inbox size={16} /> },
  { href: "/admin/images", label: "Image Search", icon: <Images size={16} /> },
  { href: "/admin/catalog", label: "Catalog", icon: <FolderOpen size={16} /> },
  { href: "/admin/services", label: "Services", icon: <Scissors size={16} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Sidebar */}
      <aside className="w-60 min-h-screen text-white flex flex-col shrink-0" style={{ backgroundColor: "#1A1A1A" }}>
        <div className="p-5 border-b border-white/10">
          <div className="text-sm font-bold text-white/60 uppercase tracking-wider mb-1">Solange's</div>
          <div className="text-lg font-bold" style={{ color: "var(--color-gold)" }}>Admin Panel</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft size={13} /> Back to Website
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-red-400/70 hover:text-red-300 transition-colors w-full"
            >
              <LogOut size={13} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
