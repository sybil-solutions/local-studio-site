import type { NextResponse } from "next/server";
import { redirectToVerifiedDownload } from "../release-download";

export const dynamic = "force-dynamic";

export function GET(): Promise<NextResponse> {
  return redirectToVerifiedDownload("macos");
}
