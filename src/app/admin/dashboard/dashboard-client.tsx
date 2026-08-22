"use client";

import Link from "next/link";

interface WeddingSummary {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  venueName: string | null;
  guestCount: number;
}

interface DashboardProps {
  weddings: WeddingSummary[];
  stats: {
    totalGuests: number;
    confirmedGuests: number;
    progress: number;
  };
}

export default function DashboardClient({ weddings, stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chào mừng bạn đến với Wedding Admin
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Khách mời"
          value={String(stats.totalGuests)}
          subtitle={`${stats.confirmedGuests} đã xác nhận`}
          icon="👥"
        />
        <StatCard
          title="Đã xác nhận"
          value={String(stats.confirmedGuests)}
          subtitle={stats.totalGuests > 0
            ? `${Math.round((stats.confirmedGuests / stats.totalGuests) * 100)}% tham dự`
            : "Chưa có dữ liệu"}
          icon="✅"
        />

        <StatCard
          title="Tiến độ"
          value={`${stats.progress}%`}
          subtitle="Checklist"
          icon="📊"
        />
      </div>

      {weddings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">💒</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Chưa có đám cưới nào
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Tạo đám cưới đầu tiên để bắt đầu quản lý
          </p>
          <Link
            href="/admin/weddings"
            className="mt-4 inline-block rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
          >
            Tạo đám cưới mới
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Đám cưới của bạn</h2>
          <div className="mt-4 divide-y divide-gray-100">
            {weddings.map((w) => (
              <Link
                key={w.id}
                href={`/admin/weddings/${w.id}`}
                className="flex items-center justify-between py-4 hover:opacity-80"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {w.groomName} & {w.brideName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {w.weddingDate ? new Date(w.weddingDate).toLocaleDateString("vi-VN") : "Chưa có ngày"}
                    {w.venueName && ` - ${w.venueName}`}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>👥 {w.guestCount}</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}