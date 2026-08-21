"use client";

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
        throw new Error(json.error || "Failed to update profile");
      setUser(json.data);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
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
              placeholder="Your name"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Cấu hình gửi thiệp
        </h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-800">
              Zalo OA
            </h3>
            <p className="mt-1 text-sm text-blue-600">
              Cấu hình Zalo OA Access Token trong file .env với biến{" "}
              <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-mono">
                ZALO_OA_TOKEN
              </code>
            </p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="text-sm font-medium text-blue-800">
              Email (Resend)
            </h3>
            <p className="mt-1 text-sm text-blue-600">
              Cấu hình Resend API Key trong file .env với biến{" "}
              <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-mono">
                RESEND_API_KEY
              </code>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Cấu hình nhận tiền mừng
        </h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <h3 className="text-sm font-medium text-amber-800">
              Thông tin tài khoản ngân hàng
            </h3>
            <p className="mt-1 text-sm text-amber-600">
              Cấu hình thông tin tài khoản ngân hàng trong phần quản lý
              đám cưới &gt; chi tiết đám cưới &gt; Cấu hình nhận tiền
              mừng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}