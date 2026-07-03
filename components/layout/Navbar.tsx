import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import NavCloseOnNavigate from "./NavCloseOnNavigate";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", dropdown: true },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const FEATURED_SERVICES = SERVICES.filter((s) => s.featured).slice(0, 6);

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      <NavCloseOnNavigate />
      <nav className="shadow-sm" style={{ backgroundColor: "#FBF0E3" }}>
        <input
          type="checkbox"
          id="mobile-nav-toggle"
          className="sr-only peer"
        />

        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logos/logo.png"
              alt="Solange's Hair Braiding"
              width={310}
              height={116}
              className="h-16 w-auto lg:h-16"
              style={{ maxWidth: "220px" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#8B1A1A] transition-colors py-2"
                  >
                    {item.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-white shadow-xl rounded-xl border border-gray-100 p-4 opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                    <div className="grid grid-cols-2 gap-2">
                      {FEATURED_SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="text-xs text-gray-600 hover:text-[#8B1A1A] hover:bg-red-50 px-2 py-1.5 rounded-md transition-colors"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link href="/services" className="text-xs font-semibold text-[#8B1A1A] hover:underline">
                        View All Services →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#8B1A1A] transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/booking"
              className="text-sm font-semibold text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              BOOK NOW
            </Link>
          </div>

          {/* Burger — label connected to checkbox via htmlFor, no JS required */}
          <label
            htmlFor="mobile-nav-toggle"
            className="lg:hidden flex items-center justify-center rounded-lg text-gray-800 bg-gray-50 border border-gray-200 cursor-pointer select-none"
            style={{ width: 44, height: 44, flexShrink: 0, touchAction: "manipulation" }}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} strokeWidth={2.5} />
          </label>
        </div>

        {/* Mobile menu — pure CSS toggle via peer-checked */}
        <div
          className="lg:hidden hidden peer-checked:block border-t-4 shadow-2xl"
          style={{ borderColor: "var(--color-primary)", backgroundColor: "#FBF0E3" }}
        >
          <div className="px-4 py-3 divide-y divide-gray-100">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center py-4 text-[17px] font-semibold text-gray-800 hover:text-[#8B1A1A] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-5 pt-2 space-y-3">
            <Link
              href="/booking"
              className="block text-center text-sm font-bold text-white py-4 rounded-xl"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              BOOK APPOINTMENT
            </Link>
            <div className="flex justify-center gap-6 text-sm text-gray-500 pb-2">
              <a href="tel:4433201312" className="hover:text-[#8B1A1A] font-medium">443.320.1312</a>
              <span className="text-gray-300">|</span>
              <a href="tel:2024458152" className="hover:text-[#8B1A1A] font-medium">202.445.8152</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
