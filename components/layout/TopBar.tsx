"use client";
import { Phone, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="hidden sm:block w-full text-white text-xs py-2 px-4" style={{ backgroundColor: "var(--color-primary)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        {/* Left: phones + address */}
        <div className="flex items-center gap-4 flex-wrap">
          <a href={`tel:${BUSINESS.phone1Raw}`} className="flex items-center gap-1 hover:text-yellow-200 transition-colors">
            <Phone size={11} />
            <span>{BUSINESS.phone1}</span>
          </a>
          <a href={`tel:${BUSINESS.phone2Raw}`} className="flex items-center gap-1 hover:text-yellow-200 transition-colors">
            <Phone size={11} />
            <span>{BUSINESS.phone2}</span>
          </a>
          <span className="hidden sm:flex items-center gap-1 opacity-80">
            <MapPin size={11} />
            <span>{BUSINESS.address}</span>
          </span>
        </div>

        {/* Right: socials + book */}
        <div className="flex items-center gap-3">
          <a href={BUSINESS.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-200 transition-colors text-xs font-bold">IG</a>
          <a href="#" className="hover:text-yellow-200 transition-colors text-xs font-bold">FB</a>
          <a href="#" className="hover:text-yellow-200 transition-colors text-xs font-bold">TK</a>
          <Link
            href="/booking"
            className="text-white text-xs px-3 py-1 rounded font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-gold)" }}
          >
            BOOK APPOINTMENT
          </Link>
        </div>
      </div>
    </div>
  );
}
