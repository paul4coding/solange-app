import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: "var(--color-primary)" }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/images/logos/logo.png"
              alt="Solange's Hair Braiding"
              width={160}
              height={60}
              className="h-14 w-auto object-contain brightness-0 invert mb-3"
            />
            <p className="text-sm opacity-80 leading-relaxed mb-4">
              Confidence starts with your hair.<br />
              Beauty. Faith. Confidence.
            </p>
            <div className="flex items-center gap-3">
              <a href={BUSINESS.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-xs font-bold">
                IG
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-xs font-bold">
                FB
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-xs font-bold">
                TK
              </a>
              <a href={`https://wa.me/${BUSINESS.whatsapp}`} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-xs font-bold">
                WA
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider opacity-60">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Gallery", href: "/gallery" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
                { label: "Book Appointment", href: "/booking" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-yellow-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our work */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider opacity-60">Our Work</h4>
            <p className="text-sm opacity-80 leading-relaxed mb-3">
              Braids, twists, locs and weaves — every style crafted with care.
              Tell us what you have in mind and we will make it happen.
            </p>
            <Link href="/gallery" className="text-sm font-semibold hover:text-yellow-200 transition-colors">
              See our gallery
            </Link>
          </div>

          {/* Contact + Hours */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider opacity-60">Contact Us</h4>
            <ul className="space-y-2.5 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{BUSINESS.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                <a href={`tel:${BUSINESS.phone1Raw}`} className="hover:text-yellow-200">{BUSINESS.phone1}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                <a href={`tel:${BUSINESS.phone2Raw}`} className="hover:text-yellow-200">{BUSINESS.phone2}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-yellow-200 break-all">{BUSINESS.email}</a>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={13} className="opacity-60" />
                <span className="text-xs font-semibold opacity-60 uppercase">Hours</span>
              </div>
              <p className="text-sm opacity-80">{BUSINESS.hours.weekdays}</p>
              <p className="text-sm opacity-80">{BUSINESS.hours.sunday}</p>
              <p className="text-xs opacity-60 mt-1">Walk-ins welcome<br />Appointments recommended</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-60">
          <p>© {new Date().getFullYear()} Solange's Hair Braiding LLC. All Rights Reserved.</p>
          <p className="font-script text-base opacity-80" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Where Beauty Meets Confidence.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
