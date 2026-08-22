"use client";

import { useState } from "react";

interface MusicTrack {
  id: string;
  weddingId: string;
  title: string;
  artist: string | null;
  url: string;
  coverUrl: string | null;
  isDefault: boolean;
  createdAt: string;
}

interface MusicClientProps {
  tracks: MusicTrack[];
  weddingId: string;
}

export default function MusicClient({
  tracks: initialTracks,
  weddingId,
}: MusicClientProps) {
  const [tracks, setTracks] = useState(initialTracks);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !weddingId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId,
          title: title.trim(),
          artist: artist.trim() || undefined,
          url: url.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add track");
      setTracks((prev) => [...prev, json.data]);
      setTitle("");
      setArtist("");
      setUrl("");
      setShowModal(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add track",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài hát này?")) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/music/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete track");
      setTracks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete track",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhạc nền</h1>
          <p className="mt-1 text-sm text-gray-500">
            Chọn nhạc cho thiệp cưới
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          + Thêm nhạc
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {tracks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">🎵</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Chưa có bài hát nào
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Thêm nhạc nền cho thiệp cưới của bạn
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-lg">
                  🎵
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {track.title}
                    </p>
                    {track.isDefault && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {track.artist || "Không có nghệ sĩ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Nghe
                </a>
                <button
                  onClick={() => handleDelete(track.id)}
                  disabled={deletingId === track.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === track.id ? "..." : "Xóa"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Thêm nhạc nền
            </h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên bài hát
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Tên bài hát"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nghệ sĩ
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Tên nghệ sĩ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL nhạc
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="https://example.com/song.mp3"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {loading ? "Đang thêm..." : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}