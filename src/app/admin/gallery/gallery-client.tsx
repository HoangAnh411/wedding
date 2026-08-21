"use client";

import { useState } from "react";

interface GalleryImage {
  id: string;
  weddingId: string;
  imageUrl: string;
  caption: string | null;
  thumbnailUrl: string | null;
  isVideo: boolean;
  videoUrl: string | null;
  orderIndex: number;
  createdAt: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
  weddings: { id: string; groomName: string; brideName: string }[];
}

export default function GalleryClient({
  images: initialImages,
  weddings,
}: GalleryClientProps) {
  const [images, setImages] = useState(initialImages);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [weddingId, setWeddingId] = useState(weddings[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingId) return;
    if (uploadMode === "url" && !imageUrl.trim()) return;
    if (uploadMode === "file" && !uploadFile) return;

    setLoading(true);
    setError(null);
    try {
      let finalUrl = imageUrl.trim();

      if (uploadMode === "file" && uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || "Upload failed");
        finalUrl = uploadJson.data.url;
      }

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId,
          imageUrl: finalUrl,
          caption: caption.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add image");
      setImages((prev) => [...prev, json.data]);
      setImageUrl("");
      setCaption("");
      setUploadFile(null);
      setShowModal(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add image",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete image");
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete image",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hình ảnh</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý album ảnh cưới
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          + Thêm ảnh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">📸</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Chưa có hình ảnh nào
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Thêm ảnh cưới để hiển thị trên thiệp mời
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                {img.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt={img.caption || "Gallery image"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">📸</span>
                )}
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 p-4 opacity-0 transition group-hover:opacity-100">
                <p className="text-sm text-white">
                  {img.caption || "No caption"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(img.id)}
                disabled={deletingId === img.id}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === img.id ? "..." : "✕"}
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Thêm hình ảnh
            </h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Đám cưới
                </label>
                <select
                  value={weddingId}
                  onChange={(e) => setWeddingId(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  {weddings.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.groomName} & {w.brideName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
                <div className="mt-1 flex gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      uploadMode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      uploadMode === "file" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Upload
                  </button>
                </div>
                {uploadMode === "url" ? (
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-rose-700 hover:file:bg-rose-100"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chú thích
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Chú thích cho ảnh"
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