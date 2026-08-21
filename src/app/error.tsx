"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <span className="text-4xl">😅</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Có lỗi xảy ra</h1>
        <p className="mt-2 text-sm text-gray-500">
          {error.message || "Đã có lỗi không mong muốn. Vui lòng thử lại."}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}