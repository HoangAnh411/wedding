"use client";

import { useTranslation } from "@/components/i18n-provider";

import { useState } from "react";

interface UserInfo {
  id: string;
  name: string | null;
  email: string;
}

export default function SettingsClient({
  user: initialUser,
}: {
  user: UserInfo;
}) {
  const dict = useTranslation();
  const [user, setUser] = useState(initialUser);
  const [name, setName] = useState(initialUser.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || dict.admin.settings.updateError);
      setUser(json.data);
      setMessage({ type: "success", text: dict.admin.settings.updateSuccess });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : dict.admin.settings.updateError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{dict.admin.settings.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Cấu hình thông tin tài khoản
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
        <h2 className="text-lg font-semibold text-gray-900">
          Thông tin tài khoản
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              className="mt-1 block w-full max-w-md rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              disabled
            />
            <p className="mt-1 text-xs text-gray-400">
              Email không thể thay đổi
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder={dict.admin.settings.namePlaceholder}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? dict.admin.settings.saving : dict.admin.settings.saveChanges}
          </button>
        </form>
      </div>
    </div>
  );
}
