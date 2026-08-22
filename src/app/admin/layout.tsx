"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Providers from "@/components/providers";

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

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const weddingMatch = pathname.match(/^\/admin\/weddings\/([^/]+)/);
  const isWeddingContext = weddingMatch && weddingMatch[1] !== 'new';
  const weddingId = isWeddingContext ? weddingMatch[1] : null;

  let navItems = [];
  if (isWeddingContext) {
    navItems = [
      { label: "Tổng quan", href: `/admin/weddings/${weddingId}`, icon: "📊" },
      { label: "Khách mời", href: `/admin/weddings/${weddingId}/guests`, icon: "👥" },
      { label: "Bàn tiệc", href: `/admin/weddings/${weddingId}/tables`, icon: "🪑" },
      { label: "Ngân sách", href: `/admin/weddings/${weddingId}/budget`, icon: "💰" },
      { label: "Công việc", href: `/admin/weddings/${weddingId}/checklist`, icon: "📋" },
      { label: "Thư viện ảnh", href: `/admin/weddings/${weddingId}/gallery`, icon: "🖼️" },
      { label: "Nhạc nền", href: `/admin/weddings/${weddingId}/music`, icon: "🎵" },
      { label: "Lời chúc", href: `/admin/weddings/${weddingId}/wishes`, icon: "💌" },
      { label: "Mừng cưới", href: `/admin/weddings/${weddingId}/money-gifts`, icon: "🎁" },
      { label: "Check-in", href: `/admin/weddings/${weddingId}/checkin`, icon: "📷" },
      { label: "Cài đặt", href: `/admin/weddings/${weddingId}/settings`, icon: "⚙️" },
    ];
  } else {
    navItems = [
      { label: "Đám cưới của tôi", href: "/admin", icon: "💒" },
      { label: "Tài chính", href: "/admin/payments", icon: "💳" },
      { label: "Nhà cung cấp", href: "/admin/vendors", icon: "🤝" },
      { label: "Cài đặt", href: "/admin/settings", icon: "⚙️" },
    ];
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
          <Link href="/admin" className="font-serif text-lg font-bold text-rose-600">
            Wedding Admin
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
            const isActive = pathname === item.href || (item.href !== "/admin" && item.href !== `/admin/weddings/${weddingId}` && pathname.startsWith(item.href + "/"));
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
            <span className="text-sm text-gray-500">{session?.user?.name || "Admin"}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Đăng xuất
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-sm font-medium text-rose-600">
              {session?.user?.name?.[0] || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}