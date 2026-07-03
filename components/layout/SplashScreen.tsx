"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  // false = invisible côté serveur → pas de mismatch d'hydratation
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // S'affiche immédiatement après hydratation
    setVisible(true);

    const t1 = setTimeout(() => setLeaving(true), 2000);   // début du fadeout à 2s
    const t2 = setTimeout(() => setVisible(false), 2700);  // disparition à 2.7s
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#FBF0E3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.7s ease",
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? "none" : "all",
      }}
    >
      {/* Logo */}
      <div style={{ animation: "splashLogoIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        <Image
          src="/images/logos/logo.png"
          alt="Solange's Hair Braiding"
          width={300}
          height={112}
          priority
          style={{ maxWidth: "min(300px, 75vw)", height: "auto" }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: 16,
          fontFamily: "'Great Vibes', cursive",
          color: "var(--color-primary)",
          fontSize: "1.25rem",
          opacity: 0,
          animation: "splashTaglineIn 0.7s 0.5s ease forwards",
        }}
      >
        Braids · Beauty · Confidence
      </p>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 32,
          width: 160,
          height: 2,
          backgroundColor: "rgba(139,26,26,0.15)",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "var(--color-primary)",
            borderRadius: 1,
            animation: "splashBarGrow 2s ease forwards",
          }}
        />
      </div>
    </div>
  );
}
