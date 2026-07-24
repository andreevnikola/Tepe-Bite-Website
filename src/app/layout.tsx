import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import { SITE_URL } from "@/lib/config/site-info";
import { getRequestLang, ogLocale } from "@/lib/i18n/metadata";
import type { Metadata } from "next";
import { Caveat, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Brush-script face echoing the "Impact" wordmark in the ТЕПЕ bite Impact logo.
const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const en = lang === "en";

  const title = en
    ? "ТЕПЕ bite — A snack bar with character from Plovdiv"
    : "ТЕПЕ bite — Барче с характер от Пловдив";
  const description = en
    ? "ТЕПЕ bite is a salted-caramel snack bar created in Plovdiv — low in net carbs, high in fibre, with a mission behind every purchase."
    : "ТЕПЕ bite е барче със солен карамел, създадено в Пловдив — с ниско съдържание на нетни въглехидрати, високо съдържание на фибри и мисия зад всяка покупка.";
  const ogDescription = en
    ? "Delicious for you. Meaningful for the community."
    : "Вкусно за теб. Смислено за общността.";
  const keywords = en
    ? ["ТЕПЕ bite", "protein snack", "salted caramel", "Plovdiv", "low carb"]
    : [
        "ТЕПЕ bite",
        "протеинова закуска",
        "солен карамел",
        "Пловдив",
        "low carb",
      ];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description: ogDescription,
      type: "website",
      url: SITE_URL,
      locale: ogLocale(lang),
      alternateLocale: ogLocale(en ? "bg" : "en"),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLang = await getRequestLang();

  return (
    <html
      lang={initialLang}
      className={`${playfair.variable} ${dmSans.variable} ${caveat.variable}`}
      style={
        {
          "--font-head": "var(--font-playfair), Georgia, serif",
          "--font-body": "var(--font-dm-sans), system-ui, sans-serif",
          "--font-brush": "var(--font-caveat), cursive",
        } as React.CSSProperties
      }
    >
      <body>
        <Providers initialLang={initialLang}>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
