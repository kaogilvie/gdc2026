"use client";

import { useCallback, useEffect, useState } from "react";

export const SITE_URL = "gdc.andko.dev";

export function SiteUrlToggle() {
  const [showUrl, setShowUrl] = useState(false);

  const close = useCallback(() => setShowUrl(false), []);

  useEffect(() => {
    if (!showUrl) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showUrl, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowUrl(true)}
        className="rounded-lg bg-ko-light-muted px-4 py-2 text-left transition-colors hover:bg-ko-light"
      >
        <span className="block text-sm font-semibold text-ko-dark">Site URL</span>
        <span className="block text-xs text-ko-muted">Show on screen</span>
      </button>

      {showUrl ? (
        <div
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-white"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Site URL: ${SITE_URL}`}
        >
          <p className="select-all px-6 text-center text-5xl font-bold tracking-tight text-ko-accent sm:text-7xl md:text-8xl lg:text-9xl">
            {SITE_URL}
          </p>
        </div>
      ) : null}
    </>
  );
}
