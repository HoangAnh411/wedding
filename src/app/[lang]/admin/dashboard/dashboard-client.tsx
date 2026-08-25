"use client";

import { useTranslation } from "@/components/i18n-provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import { Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
const PieChart = dynamic(() => import("recharts").then(mod => mod.PieChart), { ssr: false });

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
  userRole?: string;
}

export default function DashboardClient({ weddings, stats, userRole }: DashboardProps) {
  const dict = useTranslation();
  const pathname = usePathname();
  const lang = pathname.split("/")[1];

  const calculateDaysLeft = (dateString: string | null) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const copyToClipboard = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/${lang}/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Đã copy link thiệp cưới!');
  };

  const pieData = [
    { name: 'Xác nhận', value: stats.confirmedGuests },
    { name: 'Chưa xác nhận/Từ chối', value: Math.max(0, stats.totalGuests - stats.confirmedGuests) },
  ];
  const COLORS = ['#e11d48', '#f3f4f6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{dict.admin.dashboard.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {dict.admin.dashboard.welcome}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
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
        
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tỷ lệ RSVP</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-600"></div>
              <span>Xác nhận</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div>
              <span>Chưa rõ</span>
            </div>
          </div>
        </div>
      </div>

      {weddings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">💒</div>
          <h3 className="text-lg font-semibold text-gray-900">
            {dict.admin.dashboard.noWeddings}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {userRole === "CLIENT" 
              ? "Bạn chưa được gán quản lý đám cưới nào. Vui lòng liên hệ Admin." 
              : dict.admin.dashboard.createFirstWedding}
          </p>
          {userRole !== "CLIENT" && (
            <Link
              href={`/${lang}/admin/weddings`}
              className="mt-4 inline-block rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
            >
              {dict.admin.dashboard.createWeddingBtn}
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{dict.admin.dashboard.yourWeddings}</h2>
          <div className="mt-4 divide-y divide-gray-100">
            {weddings.map((w) => {
              const daysLeft = calculateDaysLeft(w.weddingDate);
              return (
                <Link
                  key={w.id}
                  href={`/${lang}/admin/weddings/${w.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-5 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-lg text-rose-700">
                      {w.groomName} & {w.brideName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {w.weddingDate ? new Date(w.weddingDate).toLocaleDateString("vi-VN") : dict.admin.dashboard.noDate}
                      {w.venueName && ` - ${w.venueName}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    {daysLeft !== null && (
                      <div className="text-sm font-medium px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
                        {daysLeft > 0 ? `Còn ${daysLeft} ngày` : daysLeft === 0 ? "Hôm nay!" : "Đã qua"}
                      </div>
                    )}
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      {w.guestCount}
                    </span>
                    <button
                      onClick={(e) => copyToClipboard(e, w.slug)}
                      className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      Copy Link
                    </button>
                    <span className="text-gray-400">→</span>
                  </div>
                </Link>
              );
            })}
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