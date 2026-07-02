"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createActor } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useParams } from "next/navigation";
import ImageUploader from "../ImageUploader";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function CreateActorPage() {
  const [state, formAction, isPending] = useActionState(createActor, null);
  const params = useParams();
  const lang = (params.lang as string) || "id";
  const formRef = useRef<HTMLFormElement>(null);
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setSlug("");
      setSlugManual(false);
      setBannerUrl("");
    }
  }, [state]);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/admin/actor`}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah Actor</h1>
          <p className="text-gray-400 text-sm">Isi data actor baru</p>
        </div>
      </div>

      <div className="bg-[#121622] rounded-xl border border-gray-800 p-6 shadow-xl">
        <form ref={formRef} action={formAction} className="space-y-5">
          <input type="hidden" name="lang" value={lang} />

          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Nama Actor <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: Kim Go-eun"
              className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all"
              onChange={(e) => {
                if (!slugManual) setSlug(toSlug(e.target.value));
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Slug <span className="text-red-400">*</span>
              </label>
              {!slugManual ? (
                <span className="text-xs px-2 py-0.5 bg-[#ffbd59]/10 text-[#ffbd59] rounded-full">Auto</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setSlugManual(false)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Reset ke auto
                </button>
              )}
            </div>
            <input
              type="text"
              name="slug"
              required
              value={slug}
              placeholder="contoh-slug-actor"
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              className="w-full bg-[#0a0c13] border border-gray-700 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ffbd59] focus:ring-1 focus:ring-[#ffbd59]/50 transition-all font-mono text-sm"
            />
            <p className="text-xs text-gray-600">Otomatis dari nama · bisa diedit manual</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Banner Actor</label>
            <ImageUploader
              value={bannerUrl}
              onChange={setBannerUrl}
              fileNameHint={slug || "actor"}
            />
            {/* Hidden input agar nilai terkirim ke server action */}
            <input type="hidden" name="actor_banner_imagekit_url" value={bannerUrl} />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              href={`/${lang}/admin/actor`}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#ffbd59] hover:bg-[#e5a94f] text-black px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              <span>{isPending ? "Menyimpan..." : "Simpan Actor"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
