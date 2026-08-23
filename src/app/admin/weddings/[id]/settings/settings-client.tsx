"use client";

import { useState } from "react";

interface WeddingSettings {
  id: string;
  isTemplate: boolean;
  galleryEnabled: boolean;
  musicEnabled: boolean;
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
  password?: string | null;
}

import StaffAssignment from "./staff-assignment";

export default function SettingsClient({
  wedding: initialWedding,
  userRole,
}: {
  wedding: WeddingSettings;
  userRole?: string;
}) {
  const [wedding, setWedding] = useState(initialWedding);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const toggleSetting = async (field: keyof WeddingSettings, value: boolean | string | null) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/weddings/${wedding.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi lưu cấu hình");
      
      setWedding(prev => ({ ...prev, [field]: value }));
      setMessage({ type: "success", text: "Lưu cấu hình thành công" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const Switch = ({ checked, onChange, label, description }: { checked: boolean, onChange: (c: boolean) => void, label: string, description: string }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={loading}
        className={`${
          checked ? 'bg-rose-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 disabled:opacity-50`}
      >
        <span
          aria-hidden="true"
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cấu hình đám cưới</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bật/tắt các tính năng trên trang thiệp cưới của bạn
        </p>
      </div>

      {message && (
        <div
          className={`rounded-lg border p-4 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-600"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tính năng hiển thị
        </h2>
        <div className="space-y-4">
          <Switch
            checked={wedding.rsvpEnabled}
            onChange={(val) => toggleSetting("rsvpEnabled", val)}
            label="Xác nhận tham dự (RSVP)"
            description="Cho phép khách mời xác nhận tham dự trên thiệp"
          />
          <Switch
            checked={wedding.wishesEnabled}
            onChange={(val) => toggleSetting("wishesEnabled", val)}
            label="Gửi lời chúc"
            description="Cho phép khách mời gửi lời chúc trực tuyến"
          />
          <Switch
            checked={wedding.galleryEnabled}
            onChange={(val) => toggleSetting("galleryEnabled", val)}
            label="Album ảnh"
            description="Hiển thị album ảnh cưới trên trang thiệp"
          />
          <Switch
            checked={wedding.musicEnabled}
            onChange={(val) => toggleSetting("musicEnabled", val)}
            label="Nhạc nền"
            description="Tự động phát nhạc nền khi khách xem thiệp"
          />
          <Switch
            checked={wedding.isTemplate}
            onChange={(val) => toggleSetting("isTemplate", val)}
            label="Làm Template"
            description="Lưu đám cưới này thành giao diện mẫu"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Bảo vệ thiệp bằng mật khẩu
        </h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu (để trống nếu không muốn cài mật khẩu)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mật khẩu..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              value={wedding.password || ""}
              onChange={(e) => setWedding({ ...wedding, password: e.target.value })}
            />
            <button
              onClick={() => toggleSetting("password", wedding.password || null)}
              disabled={loading}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-50"
            >
              Lưu mật khẩu
            </button>
          </div>
        </div>
      </div>

      {userRole === "SUPERADMIN" && (
        <StaffAssignment weddingId={wedding.id} />
      )}
    </div>
  );
}