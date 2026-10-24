import {
  LanguageProvider,
} from "@/components/language-provider";
import { OrderProvider, TrayWidget } from "@/components/order-tray";
import { DishDialogProvider } from "@/components/dish-dialog";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Story } from "@/components/story";
import { SumacShowcase } from "@/components/sumac-showcase";
import { MenuSection } from "@/components/menu-section";
import { Gallery } from "@/components/gallery";
import { Features } from "@/components/features";
import { Reviews } from "@/components/reviews";
import { LocationHours } from "@/components/location-hours";
import { FinalCta } from "@/components/final-cta";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { SectionDivider } from "@/components/section-divider";
import { SITE_CONFIG } from "@/lib/config";
import { IMAGES } from "@/lib/images";

/* ------------------------------------------------------------------ */
/*  Maison Sumac — one-page site.                                      */
/*  Section order:                                                     */
/*  header → hero → story → sumac showcase → menu → gallery → features */
/*  → reviews → location & hours → final CTA → footer (+ floating WA)  */
/*                                                                     */
/*  Root is a flex column so the footer sticks to the bottom on short  */
/*  viewports and is pushed down naturally on long ones.               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  JSON-LD — CafeOrCoffeeShop schema so the concept site indexes      */
/*  cleanly (address, hours, geo, socials). Fictional data.            */
/* ------------------------------------------------------------------ */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Maison Sumac",
  alternateName: "ميزون سماق",
  description:
    "Specialty café & brunch spot in Gemmayzeh, Beirut — wood-oven manakish, cardamom lattes and a sunny terrace.",
  image: IMAGES.ogFallback,
  url: "https://maisonsumac.example",
  telephone: `+${SITE_CONFIG.whatsappNumber}`,
  priceRange: "$",
  servesCuisine: ["Lebanese", "Café", "Brunch"],
  acceptsReservations: "True",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 Rue du Liban, Gemmayzeh",
    addressLocality: "Beirut",
    addressCountry: "LB",
  },
  geo: { "@type": "GeoCoordinates", latitude: 33.8886, longitude: 35.5131 },
  sameAs: [SITE_CONFIG.social.instagram, SITE_CONFIG.social.facebook],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:30",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "08:00",
      closes: "19:00",
    },
  ],
};

export default function Home() {
  return (
    <LanguageProvider>
      <OrderProvider>
        <DishDialogProvider>
          <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="relative z-10 flex min-h-screen flex-col">
          {/* print: the menu section becomes a standalone takeaway menu —
              everything else is silenced via print:hidden wrappers */}
          <div className="print:hidden">
            <SiteHeader />
          </div>
          <main id="main" className="flex-1">
            <div className="print:hidden">
              <Hero />
              <Story />
              <SumacShowcase />
            </div>
            <MenuSection />
            <div className="print:hidden">
              <Gallery />
              <Features />
              <SectionDivider />
              <Reviews />
              <LocationHours />
              <FinalCta />
            </div>
          </main>
          <div className="print:hidden">
            <SiteFooter />
          </div>
          <WhatsAppFloat />
          <TrayWidget />
        </div>
        </DishDialogProvider>
      </OrderProvider>
    </LanguageProvider>
  );
}
