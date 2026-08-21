export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
        <p className="mt-4 text-sm text-gray-500">Đang tải...</p>
      </div>
    </div>
  );
}