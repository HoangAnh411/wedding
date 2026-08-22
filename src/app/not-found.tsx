import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Không tìm thấy trang</h1>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto text-sm md:text-base">
          Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc URL không chính xác.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105 duration-300"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}