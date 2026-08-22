import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StaffClient from "./staff-client";
import { prisma } from "@/lib/prisma";

export default async function StaffPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const staffList = await prisma.user.findMany({
    where: { role: "STAFF" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const staffData = staffList.map(staff => ({
    ...staff,
    createdAt: staff.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhân viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý tài khoản nhân viên.
          </p>
        </div>
      </div>

      <StaffClient initialStaff={staffData} />
    </div>
  );
}
