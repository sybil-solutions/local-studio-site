import type { NextResponse } from "next/server";
import { redirectToVerifiedDownload } from "../release-download";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ platform: string }> },
): Promise<NextResponse> {
  const { platform } = await context.params;
  return redirectToVerifiedDownload(platform);
}
