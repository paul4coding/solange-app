"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NavCloseOnNavigate() {
  const pathname = usePathname();
  useEffect(() => {
    const cb = document.getElementById("mobile-nav-toggle") as HTMLInputElement | null;
    if (cb) cb.checked = false;
  }, [pathname]);
  return null;
}
