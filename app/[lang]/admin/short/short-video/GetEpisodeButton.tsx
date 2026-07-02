"use client";

import React, { useState } from "react";
import { DownloadCloud } from "lucide-react";
import { getEpisodes } from "./actions";

interface Props {
  id: string; // Internal UUID
  dramaId: string | null; // External API ID
  lang: string;
}

export default function GetEpisodeButton({ id, dramaId, lang }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetEpisodes = async () => {
    if (!dramaId) {
      alert("Drama ID tidak tersedia untuk judul ini.");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin mengambil episode untuk drama ini? Episode sebelumnya mungkin akan diganti.")) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await getEpisodes(id, dramaId, lang);
      alert(result.message);
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGetEpisodes}
      disabled={isLoading || !dramaId}
      className={`p-2 rounded-lg transition-colors ${
        !dramaId 
          ? "text-gray-600 bg-gray-800 cursor-not-allowed" 
          : "text-blue-400 hover:text-white hover:bg-blue-500/20"
      }`}
      title="Get Episodes"
    >
      <DownloadCloud size={16} className={isLoading ? "animate-pulse" : ""} />
    </button>
  );
}
