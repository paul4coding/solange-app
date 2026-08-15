import { Inbox, Phone, Mail, Scissors, Trash2, MailOpen } from "lucide-react";
import { query } from "@/lib/db";
import { toggleMessageRead, deleteMessage } from "./actions";

export const dynamic = "force-dynamic";

type Message = {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  service: string | null;
  message: string;
  is_read: number;
  created_at: string;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function AdminMessagesPage() {
  let messages: Message[] = [];
  let dbError: string | null = null;

  try {
    messages = await query<Message>(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
  } catch (e) {
    dbError = e instanceof Error ? e.message : "Connexion à la base impossible";
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Messages reçus via le formulaire de contact
          {unread > 0 && <span className="font-semibold text-gray-700"> — {unread} non lu{unread > 1 ? "s" : ""}</span>}
        </p>
      </div>

      {dbError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6">
          Base de données inaccessible : {dbError}
        </div>
      )}

      {!dbError && messages.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <Inbox size={28} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold text-gray-700">Aucun message</p>
          <p className="text-xs text-gray-400 mt-1">
            Les messages envoyés depuis la page Contact apparaîtront ici.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow-sm p-5"
            style={m.is_read ? undefined : { borderLeft: "3px solid var(--color-primary)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{m.name}</span>
                  {!m.is_read && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Nouveau
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{formatDateTime(m.created_at)}</p>
              </div>

              <div className="flex gap-2">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <MailOpen size={12} />
                    {m.is_read ? "Marquer non lu" : "Marquer lu"}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                </form>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-3 text-sm">
              <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-gray-700 hover:underline truncate">
                <Mail size={13} className="text-gray-400 shrink-0" />
                <span className="truncate">{m.email}</span>
              </a>
              {m.phone && (
                <a href={`tel:${m.phone}`} className="flex items-center gap-2 text-gray-700 hover:underline">
                  <Phone size={13} className="text-gray-400 shrink-0" />
                  {m.phone}
                </a>
              )}
              {m.service && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Scissors size={13} className="text-gray-400 shrink-0" />
                  {m.service}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
              {m.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
