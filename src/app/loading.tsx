export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center animate-fade-in-up">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="mt-6 font-serif text-lg text-foreground/70 tracking-wide">Đang tải...</p>
      </div>
    </div>
  );
}