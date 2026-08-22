"use client";

import { useState, useRef, useEffect } from "react";

interface MusicTrack {
  id: string;
  title: string;
  artist: string | null;
  url: string;
}

export function MusicPlayer({ tracks, autoPlay }: { tracks: MusicTrack[], autoPlay?: boolean }) {
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

  useEffect(() => {
    if (autoPlay && audioRef.current && tracks.length > 0 && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [autoPlay, tracks.length, isPlaying]);

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
      className="group fixed bottom-6 right-6 z-50 flex h-14 items-center gap-3 rounded-full bg-white/40 border border-white/50 pl-2 pr-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] backdrop-blur-md transition-all duration-300 hover:bg-white/60 hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
      aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-black shadow-inner">
        {/* Vinyl grooves */}
        <div className="absolute inset-1 rounded-full border border-gray-700/50"></div>
        <div className="absolute inset-2 rounded-full border border-gray-600/30"></div>
        {/* Center label */}
        <div className="z-10 h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_rgba(197,168,128,0.8)]"></div>
        
        {/* Rotate animation */}
        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isPlaying ? "animate-spin [animation-duration:3s]" : ""}`}>
          {/* Highlight effect */}
          <div className="absolute top-0 right-0 h-4 w-4 rounded-full bg-white/20 blur-[2px]"></div>
        </div>
      </div>
      
      <div className="flex flex-col items-start justify-center gap-0.5 overflow-hidden">
        <p className="max-w-[120px] truncate font-sans text-xs font-semibold text-gray-800">
          {tracks[currentTrack].title}
        </p>
        <div className="flex h-2 items-center gap-[2px]">
          {isPlaying ? (
            <>
              <div className="h-1.5 w-0.5 animate-[pulse_1s_ease-in-out_infinite] bg-primary"></div>
              <div className="h-2 w-0.5 animate-[pulse_1s_ease-in-out_0.2s_infinite] bg-primary"></div>
              <div className="h-1.5 w-0.5 animate-[pulse_1s_ease-in-out_0.4s_infinite] bg-primary"></div>
              <div className="h-2 w-0.5 animate-[pulse_1s_ease-in-out_0.6s_infinite] bg-primary"></div>
              <div className="h-1 w-0.5 animate-[pulse_1s_ease-in-out_0.8s_infinite] bg-primary"></div>
            </>
          ) : (
            <p className="text-[10px] text-gray-500 font-medium tracking-wide">PAUSED</p>
          )}
        </div>
      </div>
    </button>
  );
}