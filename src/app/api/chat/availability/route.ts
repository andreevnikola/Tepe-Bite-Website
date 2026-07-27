import { NextResponse } from "next/server";

import { getChatAvailability } from "@/lib/chat/health/availability";
import type { ChatAvailability } from "@/lib/chat/types";

/**
 * The gate in front of the launcher.
 *
 * The browser is told two booleans and, at most, whether the outage is a daily
 * one. Everything the check actually consulted — which provider answered, which
 * variable was missing, which status code came back, which model was probed —
 * stays on this side of the boundary, and so does every credential.
 *
 * A thrown error is not a 500 here: an unreachable availability check must read
 * as "no chat", never as a broken page, so the failure path returns the same
 * shape any unavailable answer would.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UNAVAILABLE: ChatAvailability = { available: false, emailAutomation: false };

export async function GET(): Promise<NextResponse<ChatAvailability>> {
  let availability: ChatAvailability;
  try {
    availability = await getChatAvailability();
  } catch {
    availability = UNAVAILABLE;
  }

  const res = NextResponse.json(availability);
  // Shared-cache hint only. A healthy answer is safe to reuse for a minute; an
  // unavailable one expires quickly so recovery is visible on the next view.
  res.headers.set(
    "Cache-Control",
    availability.available
      ? "public, s-maxage=60, stale-while-revalidate=30"
      : "public, s-maxage=10",
  );
  return res;
}
