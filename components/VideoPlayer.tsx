"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";

interface VideoPlayerProps {
  src: string;
  autoplay?: boolean;
  onEnded?: () => void;
  onTap?: () => void;
  onLoadStart?: () => void;
  onReady?: () => void;
  onError?: (message: string) => void;
}

export default function VideoPlayer({
  src,
  autoplay = true,
  onEnded,
  onTap,
  onLoadStart,
  onReady,
  onError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  const onErrorRef = useRef(onError);
  const onReadyRef = useRef(onReady);
  const onLoadStartRef = useRef(onLoadStart);
  const [retryCount, setRetryCount] = useState(0);

  onEndedRef.current = onEnded;
  onErrorRef.current = onError;
  onReadyRef.current = onReady;
  onLoadStartRef.current = onLoadStart;

  const handleTap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (onTap) {
      onTap();
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [onTap]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    onLoadStartRef.current?.();
    video.src = src;
    video.load();

    const onCanPlay = () => {
      onReadyRef.current?.();
      if (!autoplay) return;
      video.play().catch(() => {});
    };

    const onEnd = () => onEndedRef.current?.();

    const onVideoError = () => {
      const code = video.error?.code;
      const msg = video.error?.message || "Video gagal dimuat";
      if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        onErrorRef.current?.("Format video tidak didukung atau URL tidak valid");
      } else if (code === MediaError.MEDIA_ERR_NETWORK) {
        onErrorRef.current?.("Gagal memuat video — masalah jaringan");
      } else {
        onErrorRef.current?.(msg);
      }
    };

    const onStalled = () => {
      setTimeout(() => {
        if (video.readyState < 3 && !video.paused) {
          onErrorRef.current?.("Video buffering terlalu lama");
        }
      }, 15000);
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("ended", onEnd);
    video.addEventListener("error", onVideoError);
    video.addEventListener("stalled", onStalled);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("ended", onEnd);
      video.removeEventListener("error", onVideoError);
      video.removeEventListener("stalled", onStalled);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, autoplay, retryCount]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-contain bg-black"
      playsInline
      webkit-playsinline=""
      preload="metadata"
      onClick={handleTap}
    />
  );
}

export function retriggerLoad(videoEl: HTMLVideoElement | null) {
  if (!videoEl) return;
  const currentSrc = videoEl.src;
  if (!currentSrc) return;
  videoEl.src = currentSrc;
  videoEl.load();
}
