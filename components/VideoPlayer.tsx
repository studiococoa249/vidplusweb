"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";
import Hls from "hls.js";
import "video.js/dist/video-js.css";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const onEndedRef = useRef(onEnded);
  const onLoadStartRef = useRef(onLoadStart);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const onTapRef = useRef(onTap);

  onEndedRef.current = onEnded;
  onLoadStartRef.current = onLoadStart;
  onReadyRef.current = onReady;
  onErrorRef.current = onError;
  onTapRef.current = onTap;

  useEffect(() => {
    if (!containerRef.current) return;

    onLoadStartRef.current?.();

    // Create video element dynamically to prevent React rendering conflicts
    const videoElement = document.createElement("video");
    videoElement.className = "video-js vjs-fill vjs-big-play-centered object-cover w-full h-full";
    videoElement.style.objectFit = "cover";
    videoElement.setAttribute("playsinline", "true");
    videoElement.setAttribute("webkit-playsinline", "true");
    // Mute the video to guarantee that autoplay works on all browsers/devices
    videoElement.muted = true;
    videoElement.setAttribute("muted", "true");
    containerRef.current.appendChild(videoElement);

    const isHls = src.includes(".m3u8");
    let player: Player | null = null;
    let hls: Hls | null = null;

    if (isHls) {
      const proxiedSrc = `/api/hls-proxy?url=${encodeURIComponent(src)}`;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;

        hls.loadSource(proxiedSrc);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          onReadyRef.current?.();
          if (autoplay) {
            videoElement.play().catch(() => {});
          }
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            onErrorRef.current?.(`HLS Error: ${data.details}`);
          }
        });
      } else if (videoElement.canPlayType("application/x-mpegURL")) {
        videoElement.src = proxiedSrc;
        videoElement.load();
        
        const onCanPlay = () => {
          onReadyRef.current?.();
          if (autoplay) {
            videoElement.play().catch(() => {});
          }
        };

        const onVideoErr = () => {
          onErrorRef.current?.("Gagal memuat video");
        };

        videoElement.addEventListener("canplay", onCanPlay);
        videoElement.addEventListener("error", onVideoErr);
      }
    } else {
      player = videojs(videoElement, {
        autoplay: autoplay,
        muted: true, // Muted for autoplay
        controls: false,
        responsive: true,
        fill: true,
        sources: [
          {
            src: src,
            type: "video/mp4",
          },
        ],
      });
      playerRef.current = player;

      player.on("loadstart", () => {
        onLoadStartRef.current?.();
      });

      player.on("canplay", () => {
        onReadyRef.current?.();
        if (autoplay && playerRef.current) {
          const playPromise = playerRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }
      });

      player.on("ended", () => {
        onEndedRef.current?.();
      });

      player.on("error", () => {
        const error = playerRef.current?.error();
        onErrorRef.current?.(error ? error.message : "Gagal memuat video");
      });
    }

    const onEndedNative = () => {
      onEndedRef.current?.();
    };
    videoElement.addEventListener("ended", onEndedNative);

    const handleTapClick = () => {
      onTapRef.current?.();
    };
    videoElement.addEventListener("click", handleTapClick);

    return () => {
      videoElement.removeEventListener("ended", onEndedNative);
      videoElement.removeEventListener("click", handleTapClick);

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [src, autoplay]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center" 
    />
  );
}
