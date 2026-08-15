import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { getBusiness } from "@/lib/settings";

export const metadata: Metadata = { title: "Appointment Confirmed" };

function fmt(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; service?: string; date?: string; time?: string }>;
}) {
  const { name, service, date, time } = await searchParams;
  const BUSINESS = await getBusiness();

  const waText = encodeURIComponent(
    `Hello! I just booked online.\nService: ${service}\nDate: ${fmt(date || "")} at ${time}\nName: ${name}`
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4" style={{ backgroundColor: "#FDF8F3" }}>
      <div className="text-center max-w-md bg-white rounded-3xl p-10 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Appointment Confirmed!
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Thank you <strong>{name}</strong>!<br />
          Your appointment for <strong>{service}</strong>
          {date && <> on <strong>{fmt(date)}</strong></>}
          {time && <> at <strong>{time}</strong></>} has been recorded.
          <br /><br />
          We will contact you at the phone number you provided to confirm.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#25D366" }}
          >
            Confirm via WhatsApp
          </a>
          <Link href="/"
            className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
