"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StaffMember {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
}

export default function StaffClient({ initialStaff }: { initialStaff: StaffMember[] }) {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      setStaffList([{ ...data, createdAt: new Date(data.createdAt).toISOString() }, ...staffList]);
      setIsAdding(false);
      setName("");
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;

    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      setStaffList(staffList.filter((s) => s.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <div className="flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            + Thêm nhân viên
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Thêm nhân viên mới</h3>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setError("");
                }}
                disabled={loading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tên
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ngày tạo
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {staffList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Chưa có nhân viên nào.
                </td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr key={staff.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">{staff.name || "—"}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {staff.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(staff.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
