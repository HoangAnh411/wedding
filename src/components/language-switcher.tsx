"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n";

const FLAG: Record<Locale, string> = {
  vi: "🇻🇳",
  en: "🇬🇧",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname
  const segments = pathname.split("/");
  const currentLocale = (segments[1] as Locale) || "vi";

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    // Replace the locale segment in the URL
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`rounded-md px-2 py-1 text-sm transition ${
            locale === currentLocale
              ? "bg-rose-100 text-rose-700 font-medium"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
          title={locale === "vi" ? "Tiếng Việt" : "English"}
        >
          {FLAG[locale]}
        </button>
      ))}
    </div>
  );
}
