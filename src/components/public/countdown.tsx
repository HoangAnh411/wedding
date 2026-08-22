"use client";

import { useState, useEffect, useCallback } from "react";

export function Countdown({ targetDate }: { targetDate: string }) {
  const calcTimeLeft = useCallback(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isPast: false,
    };
  }, [targetDate]);

  // Initialize with null to avoid SSR mismatch, calculate on client only
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calcTimeLeft> | null>(null);
  
  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calcTimeLeft]);

  // Show loading placeholder during SSR/hydration
  if (!timeLeft) {
    return (
      <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center">
        {['Ngày', 'Giờ', 'Phút', 'Giây'].map((label) => (
          <div key={label} className="flex flex-col items-center justify-center rounded-2xl bg-white/30 border border-white/50 p-4 sm:p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] backdrop-blur-sm animate-pulse">
            <p className="font-serif text-3xl font-medium tracking-tight text-primary/50 sm:text-5xl">--</p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-400 sm:text-sm">{label}</p>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="text-center">
        <p className="text-lg font-medium text-rose-600">💕</p>
        <p className="mt-2 font-serif text-xl text-gray-700">
          Hôn lễ đã diễn ra tràn đầy hạnh phúc
        </p>
      </div>
    );
  }

  // Pad numbers with leading zero
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center">
      {[
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds },
      ].map((item, i) => (
        <div 
          key={item.label} 
          className="group relative flex flex-col items-center justify-center rounded-2xl bg-white/40 border border-white/60 p-4 sm:p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.12)]"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Subtle pulse ring on hover */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20 scale-105 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
          
          <div className="relative overflow-hidden">
            <p className="font-serif text-3xl font-medium tracking-tight text-primary sm:text-5xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
              {pad(item.value)}
            </p>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}