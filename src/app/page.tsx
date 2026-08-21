import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <main className="text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-rose-200">
            <span className="text-4xl">💍</span>
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-rose-800 sm:text-5xl">
            Wedding Invitation
          </h1>
          <p className="mt-3 text-lg text-rose-600">
            Gửi thiệp cưới online và quản lý đám cưới dễ dàng
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/admin/login"
            className="rounded-full bg-rose-600 px-8 py-3 text-sm font-medium text-white shadow-md transition hover:bg-rose-700"
          >
            Quản lý đám cưới
          </Link>
          <Link
            href="/minh-linh"
            className="rounded-full border border-rose-300 bg-white px-8 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            Xem thiệp mẫu
          </Link>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-rose-400">
        <p>Made with love for your special day</p>
      </footer>
    </div>
  );
}