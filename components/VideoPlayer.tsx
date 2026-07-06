"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface VideoPlayerProps {
  src: string;
  autoplay?: boolean;
  onEnded?: () => void;
  onTap?: () => void;
}

export default function VideoPlayer({
  src,
  autoplay = true,
  onEnded,
  onTap,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

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

    video.src = src;
    video.load();

    const onLoaded = () => {
      if (!autoplay) return;
      video.play().catch(() => {});
    };

    const onEnd = () => {
      onEndedRef.current?.();
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("ended", onEnd);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("ended", onEnd);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, autoplay]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-contain bg-black"
      playsInline
      webkit-playsinline=""
      preload="auto"
      onClick={handleTap}
    />
  );
}
