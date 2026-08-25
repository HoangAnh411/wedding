"use client";

import { useState, useCallback } from "react";
import { UploadCloud, X, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

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
  weddingId: string;
}

export default function GalleryClient({
  images: initialImages,
  weddingId,
}: GalleryClientProps) {
  const [images, setImages] = useState(initialImages);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<{file: File, progress: number, status: 'pending'|'uploading'|'success'|'error', error?: string}[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async (pageToFetch: number) => {
    setFetching(true);
    try {
      const res = await fetch(`/api/gallery?weddingId=${weddingId}&page=${pageToFetch}&limit=50`);
      const json = await res.json();
      if (res.ok) {
        setImages(json.data);
        if (json.meta) {
          setTotalPages(json.meta.totalPages);
          setPage(json.meta.page);
        }
      }
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete image");
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles = files.filter(file => file.type.startsWith('image/')).map(file => ({
      file, progress: 0, status: 'pending' as const
    }));
    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startUpload = async () => {
    setUploading(true);
    
    for (let i = 0; i < uploadFiles.length; i++) {
      if (uploadFiles[i].status === 'success') continue;

      setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading', progress: 10 } : f));
      
      try {
        const formData = new FormData();
        formData.append("file", uploadFiles[i].file);
        
        // Mock progress updates since native fetch doesn't support progress events easily
        let progressInterval = setInterval(() => {
           setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: Math.min(f.progress + 15, 90) } : f));
        }, 300);

        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadJson = await uploadRes.json();
        
        clearInterval(progressInterval);

        if (!uploadRes.ok) throw new Error(uploadJson.error || "Upload failed");
        
        const finalUrl = uploadJson.data.url;
        
        // Now save to gallery
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 95 } : f));
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weddingId, imageUrl: finalUrl, caption: uploadFiles[i].file.name }),
        });
        const json = await res.json();
        
        if (!res.ok) throw new Error(json.error || "Failed to add image");
        
        setImages((prev) => [json.data, ...prev]);
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'success', progress: 100 } : f));

      } catch (err) {
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error', error: err instanceof Error ? err.message : "Error" } : f));
      }
    }
    
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hình ảnh</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý album ảnh cưới</p>
        </div>
        <button onClick={() => setShowModal(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
          + Thêm ảnh
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {images.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 text-4xl">📸</div>
          <h3 className="text-lg font-semibold text-gray-900">Chưa có hình ảnh nào</h3>
          <p className="mt-2 text-sm text-gray-500">Thêm ảnh cưới để hiển thị trên thiệp mời</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                {img.imageUrl ? (
                  <img src={img.imageUrl} alt={img.caption || "Gallery"} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">📸</span>
                )}
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 p-4 opacity-0 transition group-hover:opacity-100">
                <p className="text-sm text-white line-clamp-2">{img.caption || "No caption"}</p>
              </div>
              <button onClick={() => handleDelete(img.id)} disabled={deletingId === img.id} className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100 disabled:opacity-50">
                {deletingId === img.id ? "..." : <X className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button disabled={page === 1 || fetching} onClick={() => fetchImages(page - 1)} className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50">Trước</button>
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <button disabled={page === totalPages || fetching} onClick={() => fetchImages(page + 1)} className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50">Sau</button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Thêm hình ảnh</h2>
              <button onClick={() => { if (!uploading) setShowModal(false) }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div 
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors ${dragActive ? 'border-rose-500 bg-rose-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <input type="file" multiple accept="image/*" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-rose-500' : 'text-gray-400'}`} />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-rose-600">Click để chọn</span> hoặc Kéo thả ảnh vào đây</p>
                <p className="text-xs text-gray-400">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB/ảnh)</p>
              </div>

              {uploadFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Danh sách chờ tải lên ({uploadFiles.length})</h4>
                  <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                    {uploadFiles.map((fileObj, index) => (
                      <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{fileObj.file.name}</p>
                            <p className="text-xs text-gray-500">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <div>
                            {fileObj.status === 'pending' && <button onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                            {fileObj.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {fileObj.status === 'error' && <span title={fileObj.error}><AlertCircle className="w-5 h-5 text-red-500" /></span>}
                          </div>
                        </div>
                        {fileObj.status === 'uploading' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-rose-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${fileObj.progress}%` }}></div>
                          </div>
                        )}
                        {fileObj.error && <p className="text-xs text-red-500">{fileObj.error}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => { if (!uploading) setShowModal(false) }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled={uploading}>
                Đóng
              </button>
              <button type="button" onClick={startUpload} disabled={uploading || uploadFiles.length === 0 || uploadFiles.every(f => f.status === 'success')} className="rounded-lg bg-rose-600 px-6 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
                {uploading ? "Đang tải lên..." : "Tải lên tất cả"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}