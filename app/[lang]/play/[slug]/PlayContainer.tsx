"use client";

import React, { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { ListVideo, X } from "lucide-react";

interface Episode {
  id: string;
  url: string;
  episode: number;
  duration: number;
}

interface Props {
  episodes: Episode[];
  dramaName: string;
}

export default function PlayContainer({ episodes, dramaName }: Props) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  const currentEpisode = episodes[currentEpisodeIndex] || null;

  // Recreate options when url changes so the player can update
  const videoJsOptions = currentEpisode ? {
    autoplay: true,
    controls: true,
    responsive: true,
    fill: true,
    sources: [{
      src: currentEpisode.url,
      type: "application/x-mpegURL"
    }]
  } : null;

  return (
    <div className="w-full h-full relative group flex items-center justify-center bg-black">
      {videoJsOptions ? (
        <VideoPlayer options={videoJsOptions} />
      ) : (
        <div className="text-gray-500 text-sm p-4 text-center">
          Belum ada episode tersedia untuk drama ini.
        </div>
      )}
      
      {/* Overlay UI when episode list is not open */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-4">
        <button 
          onClick={() => setShowEpisodeList(true)}
          className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex flex-col items-center justify-center text-white hover:bg-black/70 transition"
        >
          <ListVideo size={20} />
          <span className="text-[10px] mt-0.5">Eps</span>
        </button>
      </div>

      {/* Episode List Bottom Sheet */}
      <div 
        className={`absolute bottom-0 left-0 w-full bg-[#121622]/95 backdrop-blur-xl border-t border-gray-800 rounded-t-3xl z-30 transition-transform duration-300 ease-in-out ${showEpisodeList ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: '60%' }}
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white">Daftar Episode</h3>
            <p className="text-xs text-gray-400">{dramaName} • {episodes.length} Episode</p>
          </div>
          <button 
            onClick={() => setShowEpisodeList(false)}
            className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-70px)]">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {episodes.map((ep, index) => {
              const isActive = index === currentEpisodeIndex;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setCurrentEpisodeIndex(index);
                    setShowEpisodeList(false);
                  }}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-[#ffbd59] text-black shadow-[0_0_15px_rgba(255,189,89,0.3)] border-2 border-[#ffbd59]" 
                      : "bg-[#0a0c13] border border-gray-700 text-gray-300 hover:border-[#ffbd59]/50 hover:text-white"
                  }`}
                >
                  {ep.episode}
                </button>
              );
            })}
          </div>
          {episodes.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              Belum ada episode tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
