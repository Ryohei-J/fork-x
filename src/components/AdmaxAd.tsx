"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_AD_SRC = "https://adm.shinobi.jp/s/38abc2627eb36433645f53c4db1af1e2";
const MOBILE_AD_SRC = "https://adm.shinobi.jp/s/e56959f75aa56f1e6e000c02a36007eb";

// Tailwindの sm ブレークポイント（640px）と揃えている
const DESKTOP_MEDIA_QUERY = "(min-width: 640px)";

export default function AdmaxAd() {
  const [adSrc, setAdSrc] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateAdSrc = () => setAdSrc(mql.matches ? DESKTOP_AD_SRC : MOBILE_AD_SRC);
    updateAdSrc();
    mql.addEventListener("change", updateAdSrc);
    return () => mql.removeEventListener("change", updateAdSrc);
  }, []);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !adSrc) return;
    doc.open();
    doc.write(
      `<style>html,body{margin:0;padding:0;width:100%;}body{display:flex;justify-content:center;}</style>` +
        `<script src="${adSrc}"></script>`,
    );
    doc.close();
  }, [adSrc]);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    const height = iframe?.contentDocument?.body?.scrollHeight;
    if (iframe && height) {
      iframe.style.height = `${height}px`;
    }
  };

  if (!adSrc) return null;

  return (
    <iframe
      key={adSrc}
      ref={iframeRef}
      title="広告"
      onLoad={handleLoad}
      className="w-full border-0"
      style={{ height: 0 }}
    />
  );
}
