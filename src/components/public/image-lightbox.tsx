"use client";

import { useState, useEffect, useCallback, TouchEvent } from "react";
import Image from "next/image";

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && current !== null && current < images.length - 1) {
      setCurrent(current + 1);
    }
    if (isRightSwipe && current !== null && current > 0) {
      setCurrent(current - 1);
    }
  };

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

  useEffect(() => {
    if (current !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [current]);

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
              <Image
                src={img.imageUrl}
                alt={img.caption || ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
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

          <div 
            className="max-h-[90vh] max-w-[90vw] relative flex flex-col items-center justify-center transition-opacity duration-300" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {images[current].imageUrl ? (
              <div className="relative h-[80vh] w-[90vw] sm:w-[80vw]">
                <Image
                  src={images[current].imageUrl}
                  alt={images[current].caption || ""}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
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