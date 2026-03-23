"use client";

import { useEffect } from "react";

const ERROR_THRESHOLD = 3;

function isIOSDevice(userAgent: string, platform: string, maxTouchPoints: number): boolean {
  return /iPad|iPhone|iPod/i.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
}

export default function RuntimeStabilityGuard() {
  useEffect(() => {
    const html = document.documentElement;
    const ua = navigator.userAgent;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const isIOS = isIOSDevice(ua, navigator.platform, navigator.maxTouchPoints || 0);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasLowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const isLegacyWebView = /OS 1[2-5]_\d|Version\/1[0-5]\./i.test(ua);

    const shouldUseSafeMode = isIOS || reducedMotion || hasLowMemory || isLegacyWebView;

    if (isIOS) {
      html.setAttribute("data-ios", "1");
    }

    if (shouldUseSafeMode) {
      html.setAttribute("data-runtime-safe", "1");
    }

    let errorCount = Number(sessionStorage.getItem("agr-runtime-errors") || "0");

    const markRuntimeError = () => {
      errorCount += 1;
      sessionStorage.setItem("agr-runtime-errors", String(errorCount));

      if (errorCount >= ERROR_THRESHOLD) {
        html.setAttribute("data-runtime-safe", "1");
      }
    };

    window.addEventListener("error", markRuntimeError);
    window.addEventListener("unhandledrejection", markRuntimeError);

    return () => {
      window.removeEventListener("error", markRuntimeError);
      window.removeEventListener("unhandledrejection", markRuntimeError);
    };
  }, []);

  return null;
}
