"use client";

import { useEffect, useLayoutEffect } from "react";

const ERROR_THRESHOLD = 3;

type TelemetryEvent = "boot" | "runtime_error";

function getIOSVersion(userAgent: string): string | null {
  const match = userAgent.match(/OS (\d+)[._](\d+)(?:[._](\d+))?/i);
  if (!match) return null;
  const major = match[1];
  const minor = match[2] || "0";
  const patch = match[3] || "0";
  return `${major}.${minor}.${patch}`;
}

function getIOSMajorVersion(userAgent: string): number | null {
  const version = getIOSVersion(userAgent);
  if (!version) return null;

  const major = Number(version.split(".")[0]);
  return Number.isFinite(major) ? major : null;
}

function getIOSDeviceFamily(userAgent: string): "iphone" | "ipad" | "ipod" | "ios" {
  if (/iPad/i.test(userAgent)) return "ipad";
  if (/iPhone/i.test(userAgent)) return "iphone";
  if (/iPod/i.test(userAgent)) return "ipod";
  return "ios";
}

function sendTelemetry(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/public/telemetry", blob);
    return;
  }

  void fetch("/api/public/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

function isIOSDevice(userAgent: string, platform: string, maxTouchPoints: number): boolean {
  return /iPad|iPhone|iPod/i.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
}

export default function RuntimeStabilityGuard() {
  // ── Phase 1: set data-ios / data-runtime-safe BEFORE the first paint ──────
  // useLayoutEffect fires synchronously after DOM mutations but before the
  // browser paints. This ensures that high-risk visual properties (like
  // backdrop-filter or mask-image) are disabled before they can cause a
  // GPU-level crash on initial render.
  useLayoutEffect(() => {
    try {
      const html = document.documentElement;
      const ua = navigator.userAgent;
      const nav = navigator as Navigator & { deviceMemory?: number };
      const isIOS = isIOSDevice(ua, navigator.platform, navigator.maxTouchPoints || 0);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Low memory devices (<= 2GB) are highly susceptible to GPU crashes
      const hasLowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;

      // Legacy WebViews and older iOS versions have buggy implementations of modern CSS
      const isLegacyWebView = /OS 1[2-6]_\d|Version\/1[0-6]\./i.test(ua);
      const iosMajorVersion = isIOS ? getIOSMajorVersion(ua) : null;

      // iOS 16 and below are the primary targets for safe-mode due to known
      // rendering stability issues with complex layer compositing.
      const isOlderIOS = typeof iosMajorVersion === "number" && iosMajorVersion <= 16;
      const serverSafeMode = html.getAttribute("data-runtime-safe") === "1";

      // If we've already recorded errors in this session, stay in safe mode.
      let hasExistingErrors = false;
      try {
        hasExistingErrors = Number(window.sessionStorage.getItem("agr-runtime-errors") || "0") >= 1;
      } catch {
        // Ignore storage errors
      }

      const shouldUseSafeMode =
        serverSafeMode ||
        isIOS ||
        reducedMotion ||
        hasLowMemory ||
        isLegacyWebView ||
        isOlderIOS ||
        hasExistingErrors;

      if (isIOS) {
        html.setAttribute("data-ios", "1");
      }

      if (shouldUseSafeMode) {
        html.setAttribute("data-runtime-safe", "1");
      } else {
        html.removeAttribute("data-runtime-safe");
      }
    } catch (e) {
      // If the guard itself fails, force safe mode as a fallback.
      document.documentElement.setAttribute("data-runtime-safe", "1");
    }
  }, []);

  // ── Phase 2: telemetry + runtime error tracking (non-visual, after paint) ─
  useEffect(() => {
    const html = document.documentElement;
    const ua = navigator.userAgent;
    const isIOS = isIOSDevice(ua, navigator.platform, navigator.maxTouchPoints || 0);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const hasLowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const iosVersion = isIOS ? getIOSVersion(ua) : null;
    const iosMajorVersion = isIOS ? getIOSMajorVersion(ua) : null;
    const deviceFamily = isIOS ? getIOSDeviceFamily(ua) : null;
    const isOlderIOS = typeof iosMajorVersion === "number" && iosMajorVersion <= 16;

    let errorCount = 0;
    try {
      errorCount = Number(window.sessionStorage.getItem("agr-runtime-errors") || "0");
    } catch {
      errorCount = 0;
    }

    const markRuntimeError = (error: ErrorEvent | PromiseRejectionEvent) => {
      // Don't track benign errors that don't cause crashes
      if (error instanceof ErrorEvent && error.message?.includes('ResizeObserver')) return;

      errorCount += 1;

      try {
        window.sessionStorage.setItem("agr-runtime-errors", String(errorCount));
      } catch {
        // Ignore storage failures on restricted/private browsing contexts.
      }

      // Immediately trigger safe mode if we hit the threshold
      if (errorCount >= ERROR_THRESHOLD) {
        html.setAttribute("data-runtime-safe", "1");
      }

      if (isIOS) {
        sendTelemetry({
          source: "runtime_stability_guard",
          event: "runtime_error" satisfies TelemetryEvent,
          iosVersion,
          deviceFamily,
          runtimeSafe: html.getAttribute("data-runtime-safe") === "1",
          pathname: window.location.pathname,
          errorCount,
          errorMessage: error instanceof ErrorEvent ? error.message : 'unhandled_rejection',
          timestamp: Date.now(),
        });
      }
    };

    if (isIOS) {
      sendTelemetry({
        source: "runtime_stability_guard",
        event: "boot" satisfies TelemetryEvent,
        iosVersion,
        deviceFamily,
        runtimeSafe: html.getAttribute("data-runtime-safe") === "1",
        pathname: window.location.pathname,
        reducedMotion,
        hasLowMemory,
        isOlderIOS,
        timestamp: Date.now(),
      });
    }

    window.addEventListener("error", markRuntimeError);
    window.addEventListener("unhandledrejection", markRuntimeError);

    return () => {
      window.removeEventListener("error", markRuntimeError);
      window.removeEventListener("unhandledrejection", markRuntimeError);
    };
  }, []);

  return null;
}
