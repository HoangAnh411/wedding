import Link from "next/link";
import { FeedbackForm } from "./feedback-form";
import { getDictionary, type Locale } from "../dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.guide.metadata.title,
    description: dict.guide.metadata.description,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-serif text-xl font-bold text-rose-800">WeddingApp</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href={`/${lang}/admin/login`} className="text-sm font-medium text-gray-600 hover:text-rose-600 transition">
              {dict.common.login}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">{dict.guide.header.title}</h1>
            <p className="text-lg text-gray-600">{dict.guide.header.subtitle}</p>
          </div>

          <div className="space-y-8 mb-16">
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-rose-600 mb-4">{dict.guide.sections.account.title}</h2>
              <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.guide.sections.account.content }}>
              </p>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-rose-600 mb-4">{dict.guide.sections.createWedding.title}</h2>
              <p className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: dict.guide.sections.createWedding.intro }}>
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {dict.guide.sections.createWedding.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-rose-600 mb-4">{dict.guide.sections.guests.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {dict.guide.sections.guests.content}
              </p>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-rose-600 mb-4">{dict.guide.sections.design.title}</h2>
              <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.guide.sections.design.content }}>
              </p>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-rose-600 mb-4">{dict.guide.sections.moneyGift.title}</h2>
              <p className="text-gray-700 leading-relaxed">
                {dict.guide.sections.moneyGift.content}
              </p>
            </section>
          </div>

          <div id="feedback-section">
            <FeedbackForm dict={dict.feedback} />
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} WeddingApp. Made with love.
        </div>
      </footer>
    </div>
  );
}
