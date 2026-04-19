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
  // browser paints.  This means iPadOS 13+ devices (which spoof as "MacIntel"
  // and are missed by the server-side UA check) get the safe-mode attributes
  // applied before any animated content is ever visible.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const ua = navigator.userAgent;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const isIOS = isIOSDevice(ua, navigator.platform, navigator.maxTouchPoints || 0);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasLowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const isLegacyWebView = /OS 1[2-5]_\d|Version\/1[0-5]\./i.test(ua);
    const iosMajorVersion = isIOS ? getIOSMajorVersion(ua) : null;
    const isOlderIOS = typeof iosMajorVersion === "number" && iosMajorVersion <= 15;
    const serverSafeMode = html.getAttribute("data-runtime-safe") === "1";

    const shouldUseSafeMode = serverSafeMode || isIOS || reducedMotion || hasLowMemory || isLegacyWebView || isOlderIOS;

    if (isIOS) {
      html.setAttribute("data-ios", "1");
    }

    if (shouldUseSafeMode) {
      html.setAttribute("data-runtime-safe", "1");
    } else {
      html.removeAttribute("data-runtime-safe");
    }
  }, []);

  // ── Phase 2: telemetry + runtime error tracking (non-visual, after paint) ─
  useEffect(() => {
    const html = document.documentElement;
    const ua = navigator.userAgent;
    const isIOS = isIOSDevice(ua, navigator.platform, navigator.maxTouchPoints || 0);
    const nav = navigator as Navigator & { deviceMemory?: number };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasLowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const isLegacyWebView = /OS 1[2-5]_\d|Version\/1[0-5]\./i.test(ua);
    const iosVersion = isIOS ? getIOSVersion(ua) : null;
    const iosMajorVersion = isIOS ? getIOSMajorVersion(ua) : null;
    const deviceFamily = isIOS ? getIOSDeviceFamily(ua) : null;
    const isOlderIOS = typeof iosMajorVersion === "number" && iosMajorVersion <= 15;

    let errorCount = 0;
    try {
      errorCount = Number(window.sessionStorage.getItem("agr-runtime-errors") || "0");
    } catch {
      errorCount = 0;
    }

    const markRuntimeError = () => {
      errorCount += 1;

      try {
        window.sessionStorage.setItem("agr-runtime-errors", String(errorCount));
      } catch {
        // Ignore storage failures on restricted/private browsing contexts.
      }

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
        isLegacyWebView,
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
