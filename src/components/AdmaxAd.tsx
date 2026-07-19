"use client";

import { useEffect, useRef } from "react";

const AD_SCRIPT_SRC = "https://adm.shinobi.jp/s/38abc2627eb36433645f53c4db1af1e2";

export default function AdmaxAd() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<script src="${AD_SCRIPT_SRC}"></script>`);
    doc.close();
  }, []);

  const handleLoad = () => {
    const iframe = iframeRef.current;
    const height = iframe?.contentDocument?.body?.scrollHeight;
    if (iframe && height) {
      iframe.style.height = `${height}px`;
    }
  };

  return (
    <iframe
      ref={iframeRef}
      title="広告"
      onLoad={handleLoad}
      className="w-full border-0"
      style={{ height: 0 }}
    />
  );
}
