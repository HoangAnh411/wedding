"use client";

import { useTranslation } from "@/components/i18n-provider";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const dict = useTranslation();
  const pathname = usePathname();
  const lang = pathname.split("/")[1];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{dict.admin.dashboard.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {dict.admin.dashboard.welcome}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={dict.admin.dashboard.guests}
          value={String(stats.totalGuests)}
          subtitle={`${stats.confirmedGuests} ${dict.admin.dashboard.confirmedSuffix}`}
          icon="👥"
        />
        <StatCard
          title={dict.admin.dashboard.confirmed}
          value={String(stats.confirmedGuests)}
          subtitle={stats.totalGuests > 0
            ? `${Math.round((stats.confirmedGuests / stats.totalGuests) * 100)}${dict.admin.dashboard.attendRateSuffix}`
            : dict.admin.dashboard.noData}
          icon="✅"
        />

        <StatCard
          title={dict.admin.dashboard.progress}
          value={`${stats.progress}%`}
          subtitle={dict.admin.dashboard.checklist}
          icon="📊"
        />
      </div>

      {weddings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">💒</div>
          <h3 className="text-lg font-semibold text-gray-900">
            {dict.admin.dashboard.noWeddings}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {dict.admin.dashboard.createFirstWedding}
          </p>
          <Link
            href={`/${lang}/admin/weddings`}
            className="mt-4 inline-block rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
          >
            {dict.admin.dashboard.createWeddingBtn}
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">{dict.admin.dashboard.yourWeddings}</h2>
          <div className="mt-4 divide-y divide-gray-100">
            {weddings.map((w) => (
              <Link
                key={w.id}
                href={`/${lang}/admin/weddings/${w.id}`}
                className="flex items-center justify-between py-4 hover:opacity-80"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {w.groomName} & {w.brideName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {w.weddingDate ? new Date(w.weddingDate).toLocaleDateString("vi-VN") : dict.admin.dashboard.noDate}
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