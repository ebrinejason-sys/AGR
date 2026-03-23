import { NextResponse } from "next/server";

type TelemetryPayload = {
  source?: string;
  event?: "boot" | "runtime_error";
  iosVersion?: string | null;
  deviceFamily?: "iphone" | "ipad" | "ipod" | "ios" | null;
  runtimeSafe?: boolean;
  pathname?: string;
  errorCount?: number;
  reducedMotion?: boolean;
  hasLowMemory?: boolean;
  isLegacyWebView?: boolean;
  timestamp?: number;
};

function sanitizePathname(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) return "/";
  if (!value.startsWith("/")) return "/";
  return value.slice(0, 160);
}

function sanitizeIOSVersion(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!/^\d{1,2}\.\d{1,2}(\.\d{1,2})?$/.test(value)) return null;
  return value;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TelemetryPayload;

    if (!body || (body.event !== "boot" && body.event !== "runtime_error")) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const safePayload = {
      source: body.source === "runtime_stability_guard" ? body.source : "unknown",
      event: body.event,
      iosVersion: sanitizeIOSVersion(body.iosVersion),
      deviceFamily: body.deviceFamily ?? null,
      runtimeSafe: Boolean(body.runtimeSafe),
      pathname: sanitizePathname(body.pathname),
      errorCount: typeof body.errorCount === "number" ? Math.max(0, Math.min(body.errorCount, 1000)) : 0,
      reducedMotion: Boolean(body.reducedMotion),
      hasLowMemory: Boolean(body.hasLowMemory),
      isLegacyWebView: Boolean(body.isLegacyWebView),
      timestamp: typeof body.timestamp === "number" ? body.timestamp : Date.now(),
      serverTimestamp: Date.now(),
    };

    // Privacy-safe telemetry: no IP, email, user IDs, or full user-agent persisted.
    console.info("[telemetry][ios]", JSON.stringify(safePayload));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid telemetry payload" }, { status: 400 });
  }
}
