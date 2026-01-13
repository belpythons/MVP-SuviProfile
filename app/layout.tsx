import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Suvi Training - Lembaga Pelatihan Kerja Terakreditasi",
    template: "%s | Suvi Training",
  },
  description:
    "Tingkatkan skill Anda dengan pelatihan berkualitas dari instruktur bersertifikasi BNSP. Program MS Office, Desain Grafis, Digital Marketing, dan lainnya.",
  keywords: [
    "LPK",
    "Lembaga Pelatihan Kerja",
    "Kursus",
    "Pelatihan",
    "BNSP",
    "Prakerja",
    "Bontang",
  ],
  openGraph: {
    title: "Suvi Training - Upgrade Skill, Raih Karir Impian",
    description:
      "Lembaga Pelatihan Kerja terakreditasi dengan instruktur bersertifikasi BNSP.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

