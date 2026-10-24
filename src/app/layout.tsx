import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans, Cairo } from "next/font/google";
import "./globals.css";

/* ------------------------------------------------------------------ */
/*  Type system                                                        */
/*  · Fraunces — display serif (headings, EN)                          */
/*  · DM Sans  — body / UI (EN)                                        */
/*  · Cairo    — every piece of Arabic text (also used for headings    */
/*               when the site is switched to AR)                      */
/* ------------------------------------------------------------------ */

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"], // editorial optical sizing + soft terminals
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

/* ------------------------------------------------------------------ */
/*  SEO — one-page concept site for a fictional Beirut café            */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Maison Sumac — Specialty Café & Brunch in Gemmayzeh, Beirut",
  description:
    "Slow mornings, fresh manakish, specialty coffee and a sunny terrace in the heart of Gemmayzeh, Beirut. ميزون سماق — قهوة مختصة وتراس شمسي بالجميزة. Reserve your table on WhatsApp.",
  keywords: [
    "café Beirut",
    "brunch Gemmayzeh",
    "specialty coffee Lebanon",
    "manakish",
    "ميزون سماق",
    "كافي بيروت",
  ],
  authors: [{ name: "Maison Sumac" }],
  openGraph: {
    title: "Maison Sumac — Specialty Café & Brunch in Beirut | ميزون سماق",
    description:
      "Slow mornings, fresh manakish and a sunny terrace in Gemmayzeh. Reserve your table on WhatsApp.",
    url: "https://maisonsumac.example",
    siteName: "Maison Sumac",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_LB",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Warm café interior at Maison Sumac",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Sumac — Specialty Café & Brunch in Beirut",
    description:
      "Slow mornings, fresh manakish and a sunny terrace in Gemmayzeh. Reserve on WhatsApp.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6EFE3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html> (not <body>) so the :root-level
    // --ms-font-* custom properties in globals.css can resolve them.
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${fraunces.variable} ${dmSans.variable} ${cairo.variable}`}
    >
      <body className="grain antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
