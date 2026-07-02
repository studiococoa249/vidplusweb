"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  /** Nilai URL saat ini (controlled) */
  value: string;
  /** Dipanggil saat URL berubah (setelah upload sukses atau clear) */
  onChange: (url: string) => void;
  /** Nama untuk file yang di-upload (opsional) */
  fileNameHint?: string;
}

export default function ImageUploader({ value, onChange, fileNameHint }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Hanya file gambar yang diperbolehkan.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB.");
        return;
      }

      // Tampilkan preview lokal dulu
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setError(null);
      setUploading(true);

      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("fileName", fileNameHint ? `${fileNameHint}-banner` : file.name);

        const res = await fetch("/api/imagekit-upload", {
          method: "POST",
          body: fd,
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Upload gagal.");
        }

        setPreview(data.url);
        onChange(data.url);
      } catch (e: any) {
        setError(e.message || "Upload gagal. Coba lagi.");
        setPreview(value || null);
      } finally {
        setUploading(false);
        // Revoke object URL kalau sudah ada URL dari ImageKit
        URL.revokeObjectURL(objectUrl);
      }
    },
    [fileNameHint, onChange, value]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = () => {
    setPreview(null);
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Drop zone / preview area */}
      <div
        className={`relative rounded-xl border-2 border-dashed transition-colors ${
          uploading
            ? "border-[#ffbd59]/50 bg-[#ffbd59]/5"
            : preview
            ? "border-gray-700 bg-[#0a0c13]"
            : "border-gray-700 hover:border-[#ffbd59]/50 bg-[#0a0c13] cursor-pointer"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !preview && !uploading && inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative p-3 flex items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-xl object-cover border border-gray-700 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {uploading ? "Mengupload..." : "Gambar siap"}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">{preview}</p>
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"
                title="Hapus gambar"
              >
                <X size={16} />
              </button>
            )}
            {uploading && (
              <Loader2 size={20} className="animate-spin text-[#ffbd59] flex-shrink-0" />
            )}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
              <ImageIcon size={22} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                <span className="text-[#ffbd59] font-medium">Klik untuk upload</span> atau drag &amp; drop
              </p>
              <p className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP — maks. 5MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
            >
              <Upload size={14} />
              Pilih File
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <X size={12} />
          {error}
        </p>
      )}

      {/* Ganti gambar (jika sudah ada preview) */}
      {preview && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5"
        >
          <Upload size={12} />
          Ganti gambar
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
