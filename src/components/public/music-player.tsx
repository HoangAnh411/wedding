"use client";

import { useState, useRef, useEffect } from "react";

interface MusicTrack {
  id: string;
  title: string;
  artist: string | null;
  url: string;
}

export function MusicPlayer({ tracks }: { tracks: MusicTrack[] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    if (tracks.length > 0) {
      audio.src = tracks[currentTrack].url;
      audio.loop = true;
    }
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [tracks, currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current || tracks.length === 0) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  if (tracks.length === 0) return null;

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-2xl text-white shadow-lg transition hover:bg-rose-700"
      aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
    >
      <span className={`${isPlaying ? "animate-spin" : ""}`}>💿</span>
    </button>
  );
}