"use client";

import Script from "next/script";

// Loads the (untouched) scroll-craft engine and mounts it against the page's
// data-sc-* markup once it's ready. The engine itself is never edited here.
export function ScrollCraftMount() {
  return (
    <Script
      src="/scrollcraft/scrollcraft.js"
      strategy="afterInteractive"
      onReady={() => {
        (window as unknown as { ScrollCraft?: { mount: (root: HTMLElement) => void } }).ScrollCraft?.mount(
          document.body
        );
      }}
      onLoad={() => {
        (window as unknown as { ScrollCraft?: { mount: (root: HTMLElement) => void } }).ScrollCraft?.mount(
          document.body
        );
      }}
    />
  );
}
