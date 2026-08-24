"use client";

import { useState, useEffect } from "react";

interface Staff {
  id: string;
  name: string | null;
  email: string;
}

interface Assignment {
  id: string;
  staffId: string;
  permissions: string[];
  staff: Staff;
}

const PERMISSIONS = [
  { id: "guests", label: "Khách mời" },
  { id: "budget", label: "Ngân sách" },
  { id: "gallery", label: "Album ảnh" },
  { id: "music", label: "Nhạc nền" },
  { id: "wishes", label: "Lời chúc" },
];

export default function StaffAssignment({ weddingId }: { weddingId: string }) {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/staff").then((res) => res.json()),
      fetch(`/api/weddings/${weddingId}/assignments`).then((res) => res.json()),
    ])
      .then(([staffData, assignmentData]) => {
        if (!staffData.error) setStaffList(staffData);
        if (!assignmentData.error) setAssignments(assignmentData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [weddingId]);

  const handleAssign = async () => {
    if (!selectedStaff || selectedPermissions.length === 0) return;
    setAssigning(true);
    setError(null);

    try {
      const res = await fetch(`/api/weddings/${weddingId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: selectedStaff,
          permissions: selectedPermissions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi khi phân quyền");

      const staffInfo = staffList.find((s) => s.id === selectedStaff);
      if (staffInfo) {
        setAssignments((prev) => {
          const filtered = prev.filter((a) => a.staffId !== selectedStaff);
          return [...filtered, { ...data, staff: staffInfo }];
        });
      }
      setSelectedStaff("");
      setSelectedPermissions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (staffId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phân quyền này?")) return;
    try {
      const res = await fetch(
        `/api/weddings/${weddingId}/assignments?staffId=${staffId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Lỗi khi xóa phân quyền");
      setAssignments((prev) => prev.filter((a) => a.staffId !== staffId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  if (loading) return <div>Đang tải thông tin nhân sự...</div>;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Phân quyền Nhân sự
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chọn nhân sự
          </label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2 border"
          >
            <option value="">-- Chọn nhân viên --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name || staff.email} ({staff.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quyền truy cập
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PERMISSIONS.map((perm) => (
              <label key={perm.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  checked={selectedPermissions.includes(perm.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPermissions((prev) => [...prev, perm.id]);
                    } else {
                      setSelectedPermissions((prev) =>
                        prev.filter((id) => id !== perm.id)
                      );
                    }
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {perm.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleAssign}
          disabled={assigning || !selectedStaff || selectedPermissions.length === 0}
          className="inline-flex justify-center rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {assigning ? "Đang lưu..." : "Phân quyền"}
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-md font-medium text-gray-900 mb-3">
          Danh sách đã phân quyền
        </h3>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có nhân sự nào được phân quyền.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border rounded-md">
            {assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {assignment.staff.name || assignment.staff.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quyền: {assignment.permissions.map(p => PERMISSIONS.find(perm => perm.id === p)?.label || p).join(", ")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(assignment.staffId)}
                  className="text-sm text-red-600 hover:text-red-900"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
