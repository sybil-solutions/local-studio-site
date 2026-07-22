import { NextResponse } from "next/server";

export const revalidate = 300;

const DMG_ASSET = "Local-Studio-arm64.dmg";
const RELEASES_API = "https://api.github.com/repos/sybil-solutions/local-studio/releases?per_page=20";
const FALLBACK_DMG =
  "https://github.com/sybil-solutions/local-studio/releases/download/v2.1.0/Local-Studio-arm64.dmg";

type ReleaseAsset = { name?: string; browser_download_url?: string };
type Release = { draft?: boolean; prerelease?: boolean; assets?: ReleaseAsset[] };

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch(RELEASES_API, {
      next: { revalidate: 300 },
      headers: { accept: "application/vnd.github+json" },
    });
    if (response.ok) {
      const releases = (await response.json()) as Release[];
      for (const release of releases) {
        if (release.draft || release.prerelease) continue;
        const asset = release.assets?.find((entry) => entry.name === DMG_ASSET);
        if (asset?.browser_download_url) {
          return NextResponse.redirect(asset.browser_download_url, 302);
        }
      }
    }
  } catch {
    return NextResponse.redirect(FALLBACK_DMG, 302);
  }
  return NextResponse.redirect(FALLBACK_DMG, 302);
}
