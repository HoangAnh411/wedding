"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Providers from "@/components/providers";
import { useTranslation } from "@/components/i18n-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Providers>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dict = useTranslation();
  const lang = pathname.split('/')[1];

  if (pathname === `/${lang}/admin/login` || pathname === "/admin/login") {
    return <>{children}</>;
  }

  const weddingMatch = pathname.match(/^\/[^/]+\/admin\/weddings\/([^/]+)/) || pathname.match(/^\/admin\/weddings\/([^/]+)/);
  const isWeddingContext = weddingMatch && weddingMatch[1] !== 'new';
  const weddingId = isWeddingContext ? weddingMatch[1] : null;

  let navItems = [];
  if (isWeddingContext) {
    navItems = [
      { label: dict.admin.sidebar.overview, href: `/${lang}/admin/weddings/${weddingId}`, icon: "📊" },
      { label: dict.admin.sidebar.guests, href: `/${lang}/admin/weddings/${weddingId}/guests`, icon: "👥" },
      { label: dict.admin.sidebar.tables, href: `/${lang}/admin/weddings/${weddingId}/tables`, icon: "🪑" },
      { label: dict.admin.sidebar.budget, href: `/${lang}/admin/weddings/${weddingId}/budget`, icon: "💰" },
      { label: dict.admin.sidebar.checklist, href: `/${lang}/admin/weddings/${weddingId}/checklist`, icon: "📋" },
      { label: dict.admin.sidebar.gallery, href: `/${lang}/admin/weddings/${weddingId}/gallery`, icon: "🖼️" },
      { label: dict.admin.sidebar.music, href: `/${lang}/admin/weddings/${weddingId}/music`, icon: "🎵" },
      { label: dict.admin.sidebar.wishes, href: `/${lang}/admin/weddings/${weddingId}/wishes`, icon: "💌" },
      { label: dict.admin.sidebar.moneyGifts, href: `/${lang}/admin/weddings/${weddingId}/money-gifts`, icon: "🎁" },
      { label: dict.admin.sidebar.builder, href: `/${lang}/admin/weddings/${weddingId}/builder`, icon: "🎨" },
      { label: dict.admin.sidebar.checkin, href: `/${lang}/admin/weddings/${weddingId}/checkin`, icon: "📷" },
      { label: dict.admin.sidebar.settings, href: `/${lang}/admin/weddings/${weddingId}/settings`, icon: "⚙️" },
    ];
  } else {
    navItems = [
      { label: dict.admin.sidebar.myWeddings, href: `/${lang}/admin`, icon: "💒" },
    ];
    if (session?.user?.role === "SUPERADMIN") {
      navItems.push(
        { label: dict.admin.sidebar.finance, href: `/${lang}/admin/payments`, icon: "💳" },
        { label: dict.admin.sidebar.vendors, href: `/${lang}/admin/vendors`, icon: "🤝" },
        { label: dict.admin.sidebar.staff, href: `/${lang}/admin/staff`, icon: "👔" },
        { label: dict.admin.sidebar.feedback, href: `/${lang}/admin/feedback`, icon: "📝" },
        { label: dict.admin.sidebar.settings, href: `/${lang}/admin/settings`, icon: "⚙️" }
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link href={`/${lang}/admin`} className="font-serif text-lg font-bold text-rose-600">
            {dict.admin.sidebar.brandName}
          </Link>
          <button
            className="text-gray-400 hover:text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${lang}/admin` && item.href !== `/${lang}/admin/weddings/${weddingId}` && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-rose-50 text-rose-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            className="text-gray-500 hover:text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <LanguageSwitcher />
            <span className="text-sm text-gray-500">{session?.user?.name || "Admin"}</span>
            <Link
              href={`/${lang}/admin/profile`}
              className="text-sm text-gray-400 hover:text-gray-600 font-medium"
            >
              Hồ sơ
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: `/${lang}/admin/login` })}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              {dict.common.logout}
            </button>
            <Link href={`/${lang}/admin/profile`}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-sm font-medium text-rose-600 hover:bg-rose-200 cursor-pointer">
                {session?.user?.name?.[0] || "A"}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}