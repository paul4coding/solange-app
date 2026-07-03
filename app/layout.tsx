import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/layout/SplashScreen";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Solange's Hair Braiding LLC | Glen Burnie, MD",
    template: "%s | Solange's Hair Braiding LLC",
  },
  description:
    "Professional hair braiding salon in Glen Burnie, MD. Specializing in knotless braids, box braids, boho braids, twists, locs & more. Walk-ins welcome. Book online 24/7.",
  keywords: [
    "hair braiding glen burnie",
    "knotless braids maryland",
    "box braids md",
    "african hair braiding",
    "solange hair braiding",
    "braids near me",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Solange's Hair Braiding LLC",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <SplashScreen />
        <TopBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
