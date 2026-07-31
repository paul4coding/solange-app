import { CalendarDays, Phone, Mail, User, StickyNote, DollarSign } from "lucide-react";
import { query } from "@/lib/db";
import { updateBookingStatus, toggleDepositPaid } from "./actions";

export const dynamic = "force-dynamic";

type Booking = {
  id: number;
  service_slug: string;
  service_name: string | null;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  stylist: string | null;
  notes: string | null;
  deposit_paid: number;
  deposit_amount: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
};

const STATUS_STYLE: Record<Booking["status"], { label: string; bg: string; fg: string }> = {
  pending:   { label: "En attente", bg: "#FEF3C7", fg: "#92400E" },
  confirmed: { label: "Confirmée",  bg: "#D1FAE5", fg: "#065F46" },
  completed: { label: "Terminée",   bg: "#E0E7FF", fg: "#3730A3" },
  cancelled: { label: "Annulée",    bg: "#FEE2E2", fg: "#991B1B" },
};

const FILTERS = [
  { key: "all",       label: "Toutes" },
  { key: "pending",   label: "En attente" },
  { key: "confirmed", label: "Confirmées" },
  { key: "completed", label: "Terminées" },
  { key: "cancelled", label: "Annulées" },
];

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter = "all" } = await searchParams;

  let bookings: Booking[] = [];
  let dbError: string | null = null;

  try {
    bookings = FILTERS.some((f) => f.key === statusFilter) && statusFilter !== "all"
      ? await query<Booking>(
          "SELECT * FROM bookings WHERE status = ? ORDER BY date DESC, time DESC",
          [statusFilter]
        )
      : await query<Booking>("SELECT * FROM bookings ORDER BY date DESC, time DESC");
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Connexion à la base impossible";
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Toutes les demandes reçues via le formulaire de réservation du site.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const active = f.key === statusFilter;
          return (
            <a
              key={f.key}
              href={`/admin/bookings?status=${f.key}`}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              style={
                active
                  ? { backgroundColor: "var(--color-primary)", color: "white" }
                  : { backgroundColor: "white", color: "#6B7280" }
              }
            >
              {f.label}
            </a>
          );
        })}
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6">
          Base de données inaccessible : {dbError}
        </div>
      )}

      {!dbError && bookings.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <CalendarDays size={28} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-700">Aucune réservation</p>
          <p className="text-xs text-gray-400 mt-1">
            Les réservations envoyées depuis le site apparaîtront ici automatiquement.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((b) => {
          const st = STATUS_STYLE[b.status] ?? STATUS_STYLE.pending;
          return (
            <div key={b.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{b.service_name || b.service_slug}</span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: st.bg, color: st.fg }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <CalendarDays size={13} />
                    {formatDate(b.date)} · {b.time}
                    {b.stylist && <span className="text-gray-400">· avec {b.stylist}</span>}
                  </div>
                </div>

                <form action={toggleDepositPaid}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5"
                    style={
                      b.deposit_paid
                        ? { backgroundColor: "#D1FAE5", color: "#065F46", borderColor: "#A7F3D0" }
                        : { backgroundColor: "white", color: "#9CA3AF", borderColor: "#E5E7EB" }
                    }
                  >
                    <DollarSign size={12} />
                    Acompte {b.deposit_paid ? "payé" : "non payé"}
                  </button>
                </form>
              </div>

              {/* Coordonnées client */}
              <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={13} className="text-gray-400 shrink-0" />
                  {b.client_name}
                </div>
                <a href={`tel:${b.client_phone}`} className="flex items-center gap-2 text-gray-700 hover:underline">
                  <Phone size={13} className="text-gray-400 shrink-0" />
                  {b.client_phone}
                </a>
                <a href={`mailto:${b.client_email}`} className="flex items-center gap-2 text-gray-700 hover:underline truncate">
                  <Mail size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{b.client_email}</span>
                </a>
              </div>

              {b.notes && (
                <div className="flex gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mb-4">
                  <StickyNote size={13} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{b.notes}</p>
                </div>
              )}

              {/* Changement de statut */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                {(Object.keys(STATUS_STYLE) as Booking["status"][])
                  .filter((s) => s !== b.status)
                  .map((s) => (
                    <form key={s} action={updateBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value={s} />
                      <button
                        type="submit"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Marquer « {STATUS_STYLE[s].label} »
                      </button>
                    </form>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
