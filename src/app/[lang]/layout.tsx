import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { I18nProvider } from "@/components/i18n-provider";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thiệp Cưới Online - Wedding Invitation",
  description: "Gửi thiệp cưới online và quản lý đám cưới dễ dàng",
};

export async function generateStaticParams() {
  return [{ lang: "vi" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${outfit.variable} ${cormorantGaramond.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <I18nProvider dict={dict}>{children}</I18nProvider>
      </body>
    </html>
  );
}
