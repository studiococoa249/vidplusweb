"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { ListVideo, X, Play, SkipForward, ChevronRight, Loader2, RefreshCw, AlertTriangle } from "lucide-react";

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

type PlayerState = "loading" | "ready" | "error";

export default function PlayContainer({ episodes, dramaName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [playerKey, setPlayerKey] = useState(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval>>(null);

  const currentEpisode = episodes[currentIndex] || null;
  const hasNext = currentIndex < episodes.length - 1;

  const goToNext = useCallback(() => {
    if (!hasNext) return;
    setShowNextOverlay(false);
    setProgress(0);
    setIsPaused(false);
    setPlayerState("loading");
    setCurrentIndex((i) => i + 1);
  }, [hasNext]);

  const goToEpisode = useCallback((index: number) => {
    setShowNextOverlay(false);
    setProgress(0);
    setIsPaused(false);
    setPlayerState("loading");
    setCurrentIndex(index);
    setShowEpisodeList(false);
  }, []);

  const retryLoad = useCallback(() => {
    setPlayerState("loading");
    setErrorMsg("");
    setPlayerKey((k) => k + 1);
  }, []);

  const onEnded = useCallback(() => {
    if (hasNext) {
      setShowNextOverlay(true);
      const timer = setTimeout(goToNext, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasNext, goToNext]);

  const onLoadStart = useCallback(() => setPlayerState("loading"), []);

  const onReady = useCallback(() => setPlayerState("ready"), []);

  const onError = useCallback((msg: string) => {
    setPlayerState("error");
    setErrorMsg(msg);
  }, []);

  const flashControls = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const handleTap = useCallback(() => {
    if (showNextOverlay || playerState !== "ready") return;

    const video = videoContainerRef.current?.querySelector("video");
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
    flashControls();
  }, [showNextOverlay, flashControls, playerState]);

  useEffect(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);

    progressTimer.current = setInterval(() => {
      const video = videoContainerRef.current?.querySelector("video");
      if (video && video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    }, 250);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [currentIndex]);

  useEffect(() => {
    flashControls();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [currentIndex, flashControls]);

  if (!currentEpisode) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        Belum ada episode tersedia.
      </div>
    );
  }

  return (
    <div ref={videoContainerRef} className="w-full h-full relative bg-black select-none">
      <VideoPlayer
        key={`${currentEpisode.id}-${playerKey}`}
        src={currentEpisode.url}
        autoplay
        onEnded={onEnded}
        onTap={handleTap}
        onLoadStart={onLoadStart}
        onReady={onReady}
        onError={onError}
      />

      {/* Loading spinner overlay */}
      {playerState === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none bg-black/40">
          <Loader2 size={40} className="text-[#ffbd59] animate-spin" />
          <p className="text-white/60 text-xs mt-3">Memuat video...</p>
        </div>
      )}

      {/* Error overlay with retry */}
      {playerState === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/70 backdrop-blur-sm gap-3">
          <AlertTriangle size={36} className="text-red-400" />
          <p className="text-white/70 text-sm text-center px-8 max-w-xs">{errorMsg || "Gagal memuat video"}</p>
          <button
            onClick={retryLoad}
            className="flex items-center gap-2 bg-[#ffbd59] text-black font-semibold px-5 py-2.5 rounded-xl text-sm active:scale-95 transition-transform mt-2"
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>
          {hasNext && (
            <button
              onClick={goToNext}
              className="text-white/50 text-xs mt-1 hover:text-white/80 transition"
            >
              Lewati ke episode berikutnya →
            </button>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-20">
        <div
          className="h-full bg-[#ffbd59] transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Episode info badge */}
      <div
        className={`absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <span className="text-[#ffbd59] text-xs font-bold">EP {currentEpisode.episode}</span>
        <span className="text-white/40 text-xs">/ {episodes.length}</span>
      </div>

      {/* Center pause/play icon */}
      {isPaused && showControls && playerState === "ready" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center animate-fade-in">
            <Play size={28} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Side buttons */}
      <div
        className={`absolute right-3 bottom-16 z-20 flex flex-col items-center gap-4 transition-opacity duration-300 ${showControls && !showNextOverlay && playerState === "ready" ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <SkipForward size={20} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setShowEpisodeList(true); }}
          className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex flex-col items-center justify-center text-white active:scale-90 transition-transform"
        >
          <ListVideo size={18} />
          <span className="text-[9px] mt-0.5 opacity-70">Eps</span>
        </button>
      </div>

      {/* Auto next episode overlay */}
      {showNextOverlay && hasNext && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4 animate-fade-in">
          <p className="text-white/60 text-sm">Episode selanjutnya</p>
          <button
            onClick={goToNext}
            className="flex items-center gap-2 bg-[#ffbd59] text-black font-bold px-6 py-3 rounded-2xl text-sm active:scale-95 transition-transform shadow-lg shadow-[#ffbd59]/20"
          >
            Episode {episodes[currentIndex + 1]?.episode}
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setShowNextOverlay(false)}
            className="text-white/40 text-xs mt-2 hover:text-white/70 transition"
          >
            Batal
          </button>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[#ffbd59] animate-shrink-bar" />
          </div>
        </div>
      )}

      {/* Episode list bottom sheet */}
      {showEpisodeList && (
        <div className="absolute inset-0 z-40" onClick={() => setShowEpisodeList(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-0 left-0 w-full bg-[#121622]/98 backdrop-blur-xl border-t border-gray-800 rounded-t-3xl animate-slide-up"
            style={{ maxHeight: "65%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-700 rounded-full" />
            </div>
            <div className="px-4 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-sm">{dramaName}</h3>
                <p className="text-xs text-gray-500">{episodes.length} Episode</p>
              </div>
              <button
                onClick={() => setShowEpisodeList(false)}
                className="p-2 bg-gray-800 rounded-full text-gray-400 active:scale-90 transition-transform"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-4 pb-6 overflow-y-auto hide-scrollbar" style={{ maxHeight: "calc(65vh - 80px)" }}>
              <div className="grid grid-cols-5 gap-2">
                {episodes.map((ep, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => goToEpisode(index)}
                      className={`aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all active:scale-90 ${
                        isActive
                          ? "bg-[#ffbd59] text-black shadow-[0_0_12px_rgba(255,189,89,0.4)]"
                          : "bg-[#0a0c13] border border-gray-700/50 text-gray-400 active:border-[#ffbd59]/50"
                      }`}
                    >
                      {ep.episode}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
