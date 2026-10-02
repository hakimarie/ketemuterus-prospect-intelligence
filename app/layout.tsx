import "./globals.css";
import type { Metadata } from "next";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "KetemuTerus Prospect Intelligence",
  description: "Local ecosystem and partnership intelligence for local businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}<MobileNav /></body></html>;
}
