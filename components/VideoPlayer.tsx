"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Hls from "hls.js";
import type Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  options: any;
  onReady?: (player: Player) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered", "vjs-fill");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // If source is HLS and native HLS is not supported (Android usually), use Hls.js
      const src = options.sources?.[0]?.src;
      if (src && src.includes(".m3u8")) {
        const videoNative = player.el().querySelector("video") as HTMLVideoElement;
        
        if (Hls.isSupported() && !videoNative.canPlayType("application/vnd.apple.mpegurl")) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(videoNative);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              const playPromise = player.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // handle autoplay block
                });
              }
            });
        }
      }

    } else {
      const player = playerRef.current;
      if (player) {
        player.autoplay(options.autoplay);
        player.src(options.sources);
      }
    }
  }, [options, videoRef, onReady]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full relative" ref={videoRef} />
  );
};

export default VideoPlayer;
