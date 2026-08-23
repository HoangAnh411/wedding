"use client";

import { useState, useEffect } from "react";

interface PasswordGateProps {
  weddingSlug: string;
  onUnlocked: () => void;
}

export function PasswordGate({ weddingSlug, onUnlocked }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`wedding_pass_${weddingSlug}`);
    if (saved === "unlocked") {
      onUnlocked();
    } else {
      setIsChecking(false);
    }
  }, [weddingSlug, onUnlocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: weddingSlug, password }),
      });

      if (res.ok) {
        localStorage.setItem(`wedding_pass_${weddingSlug}`, "unlocked");
        onUnlocked();
      } else {
        const json = await res.json();
        setError(json.error || "Mật khẩu không đúng");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse">Đang tải...</div></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-pattern.png')] bg-cover bg-center opacity-[0.03]" />
      
      <div className="z-10 w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-primary/10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <span className="text-3xl">🔒</span>
        </div>
        
        <h2 className="text-2xl font-serif font-medium text-foreground mb-2">Thiệp cưới riêng tư</h2>
        <p className="text-sm text-foreground/60 mb-8 font-light">Vui lòng nhập mật khẩu để xem thiệp mời</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center tracking-widest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3 text-white font-medium shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? "Đang kiểm tra..." : "Mở thiệp"}
          </button>
        </form>
      </div>
    </div>
  );
}
