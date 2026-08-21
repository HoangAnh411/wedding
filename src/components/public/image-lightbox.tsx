"use client";

import { useState, useEffect, useCallback } from "react";

interface LightboxImage {
  id: string;
  imageUrl: string;
  caption: string | null;
}

export function ImageLightbox({
  images,
}: {
  images: LightboxImage[];
}) {
  const [current, setCurrent] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (current === null) return;
      if (e.key === "Escape") setCurrent(null);
      if (e.key === "ArrowRight") setCurrent((prev) => prev !== null ? Math.min(prev + 1, images.length - 1) : null);
      if (e.key === "ArrowLeft") setCurrent((prev) => prev !== null ? Math.max(prev - 1, 0) : null);
    },
    [current, images.length],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setCurrent(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-rose-100 to-pink-100"
          >
            {img.imageUrl ? (
              <img
                src={img.imageUrl}
                alt={img.caption || ""}
                className="h-full w-full object-cover transition group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
            )}
            {img.caption && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 p-3 opacity-0 transition group-hover:opacity-100">
                <p className="text-sm text-white">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {current !== null && images[current] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setCurrent(null)}
        >
          <button
            onClick={() => setCurrent(null)}
            className="absolute right-4 top-4 text-2xl text-white hover:text-gray-300"
            aria-label="Đóng"
          >
            ✕
          </button>

          {current > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(current - 1); }}
              className="absolute left-4 text-3xl text-white hover:text-gray-300"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
          )}

          <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {images[current].imageUrl ? (
              <img
                src={images[current].imageUrl}
                alt={images[current].caption || ""}
                className="max-h-[85vh] rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-white/10">
                <span className="text-6xl">📸</span>
              </div>
            )}
            <p className="mt-2 text-center text-sm text-white">
              {images[current].caption} <span className="text-gray-400">({current + 1}/{images.length})</span>
            </p>
          </div>

          {current < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(current + 1); }}
              className="absolute right-4 text-3xl text-white hover:text-gray-300"
              aria-label="Ảnh sau"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}