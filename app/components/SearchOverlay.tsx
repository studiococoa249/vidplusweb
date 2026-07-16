"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Play, Layers } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  banner_url: string | null;
  total_episode: number;
  view_count: number;
}

export default function SearchOverlay({
  lang,
  placeholder,
}: {
  lang: string;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const doSearch = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setResults([]);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Desktop trigger */}
      <button
        onClick={() => setOpen(true)}
        className="relative hidden md:flex items-center w-56 lg:w-72 bg-[#121622] border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-gray-500 hover:border-gray-500 transition cursor-text"
      >
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        {placeholder}
        <kbd className="ml-auto text-[10px] text-gray-600 bg-[#0a0c13] border border-gray-700 px-1.5 py-0.5 rounded">
          Ctrl K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-gray-300 hover:text-[#ffbd59] transition"
      >
        <Search size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[200] flex flex-col">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-lg mx-auto mt-[env(safe-area-inset-top,12px)] md:mt-20 flex flex-col max-h-[85vh]">
            {/* Search input */}
            <div className="mx-4 flex items-center bg-[#121622] border border-gray-700 rounded-2xl px-4 gap-3 focus-within:border-[#ffbd59] transition shadow-2xl">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent py-3.5 text-white text-sm focus:outline-none placeholder-gray-500"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-gray-500 hover:text-white transition shrink-0"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="md:hidden text-gray-400 hover:text-white transition shrink-0 pl-2"
              >
                <span className="text-xs">Batal</span>
              </button>
            </div>

            {/* Results */}
            <div className="mx-4 mt-2 bg-[#121622] border border-gray-800 rounded-2xl overflow-y-auto hide-scrollbar shadow-2xl">
              {loading && (
                <div className="p-6 text-center text-gray-500 text-sm">
                  Mencari...
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">Tidak ditemukan drama untuk &quot;{query}&quot;</p>
                </div>
              )}

              {!loading && query.length < 2 && query.length > 0 && (
                <div className="p-6 text-center text-gray-500 text-sm">
                  Ketik minimal 2 karakter...
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="divide-y divide-gray-800">
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${lang}/play/${item.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-[#1a1f30] transition group"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                        {item.banner_url ? (
                          <img
                            src={item.banner_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <Play size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white group-hover:text-[#ffbd59] transition truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Layers size={10} /> {item.total_episode || 0} Eps
                          </span>
                        </p>
                      </div>
                      <Play
                        size={16}
                        className="text-gray-600 group-hover:text-[#ffbd59] transition shrink-0"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {!loading && query.length === 0 && (
                <div className="p-6 text-center text-gray-600 text-sm">
                  Cari judul drama favoritmu...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
