import Link from "next/link";
import { getDictionary, type Locale } from "./dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-serif text-xl font-bold text-rose-800">WeddingApp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/huong-dan`} className="text-sm font-medium text-gray-600 hover:text-rose-600 transition">
              {dict.home.nav.guide}
            </Link>
            <LanguageSwitcher />
            <Link href={`/${lang}/admin/login`} className="text-sm font-medium text-gray-600 hover:text-rose-600 transition">
              {dict.home.nav.login}
            </Link>
            <Link href={`/${lang}/admin/login`} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700">
              {dict.home.nav.createFree}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-rose-50 pt-20 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              {dict.home.hero.title} <span className="text-rose-600">{dict.home.hero.titleHighlight}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              {dict.home.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${lang}/admin/login`} className="w-full sm:w-auto rounded-full bg-rose-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-rose-700 hover:scale-105">
                {dict.home.hero.ctaStart}
              </Link>
              <Link href={`/${lang}/minh-linh`} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {dict.home.hero.ctaDemo}
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{dict.home.features.title}</h2>
              <p className="mt-4 text-lg text-gray-600">{dict.home.features.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{dict.home.features.builder.title}</h3>
                <p className="text-gray-600">{dict.home.features.builder.desc}</p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{dict.home.features.guestRsvp.title}</h3>
                <p className="text-gray-600">{dict.home.features.guestRsvp.desc}</p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center transition hover:shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{dict.home.features.payment.title}</h3>
                <p className="text-gray-600">{dict.home.features.payment.desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cta Section */}
        <section className="bg-rose-600 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {dict.home.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-rose-100">
              {dict.home.cta.subtitle}
            </p>
            <div className="mt-10">
              <Link href={`/${lang}/admin/login`} className="rounded-full bg-white px-8 py-4 text-base font-bold text-rose-600 shadow-lg transition-all hover:bg-gray-50 hover:scale-105 inline-block">
                {dict.home.cta.button}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-xl">💍</span>
            <span className="font-serif text-lg font-bold text-gray-900">WeddingApp</span>
          </div>
          <div className="flex gap-4 mb-4 md:mb-0">
            <Link href={`/${lang}/huong-dan`} className="text-sm text-gray-500 hover:text-rose-600 transition">{dict.home.footer.guideFeedback}</Link>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} WeddingApp. Made with love for your special day.
          </p>
        </div>
      </footer>
    </div>
  );
}