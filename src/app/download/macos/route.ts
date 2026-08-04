import { NextResponse } from "next/server";
import {
  comparisonContainsRelease,
  type ReleaseComparison,
} from "./release-provenance";
import {
  selectLatestValidRelease,
  type ListedRelease,
} from "./release-selection";

export const dynamic = "force-dynamic";

const DMG_ASSET = "Local-Studio-arm64.dmg";
const MANIFEST_ASSET = "Local-Studio-release.json";
const RELEASES_API =
  "https://api.github.com/repos/sybil-solutions/local-studio/releases?per_page=100";
const MAIN_COMMIT_API =
  "https://api.github.com/repos/sybil-solutions/local-studio/commits/main";
const COMPARE_API =
  "https://api.github.com/repos/sybil-solutions/local-studio/compare";

type ReleaseAsset = { name?: string; browser_download_url?: string };
type Release = ListedRelease & {
  assets?: ReleaseAsset[];
};
type Commit = { sha?: string };
type ReleaseManifest = {
  schemaVersion?: number;
  version?: string;
  commit?: string;
  assets?: Record<string, { sha256?: string }>;
};
type VerifiedRelease = {
  commit: string;
  digest: string;
  downloadUrl: string;
  version: string;
};

function unavailable(reason: string): NextResponse {
  return NextResponse.json(
    { error: "The latest verified macOS build is temporarily unavailable.", reason },
    {
      status: 503,
      headers: {
        "cache-control": "no-store",
        "retry-after": "300",
      },
    },
  );
}

async function githubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { accept: "application/vnd.github+json" },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return (await response.json()) as T;
}

async function releaseMatchesMain(releaseCommit: string, mainCommit: string): Promise<boolean> {
  if (releaseCommit === mainCommit) return true;
  if (!/^[0-9a-f]{40}$/.test(releaseCommit) || !/^[0-9a-f]{40}$/.test(mainCommit)) {
    return false;
  }

  const comparison = await githubJson<ReleaseComparison>(
    `${COMPARE_API}/${releaseCommit}...${mainCommit}`,
  );
  return comparisonContainsRelease(comparison);
}

export async function GET(): Promise<NextResponse> {
  try {
    const [releases, main] = await Promise.all([
      githubJson<Release[]>(RELEASES_API),
      githubJson<Commit>(MAIN_COMMIT_API),
    ]);
    if (!main.sha) return unavailable("main commit is unavailable");
    const mainCommit = main.sha;

    const verified = await selectLatestValidRelease<Release, VerifiedRelease>(
      releases,
      async (release) => {
        try {
          const dmg = release.assets?.find((entry) => entry.name === DMG_ASSET);
          const manifestAsset = release.assets?.find((entry) => entry.name === MANIFEST_ASSET);
          if (!dmg?.browser_download_url || !manifestAsset?.browser_download_url) {
            return undefined;
          }

          const manifest = await githubJson<ReleaseManifest>(manifestAsset.browser_download_url);
          const version = release.tag_name?.replace(/^v/, "");
          const digest = manifest.assets?.[DMG_ASSET]?.sha256;
          if (
            manifest.schemaVersion !== 1 ||
            !version ||
            manifest.version !== version ||
            !manifest.commit ||
            !digest ||
            !/^[0-9a-f]{64}$/.test(digest)
          ) {
            return undefined;
          }
          if (!(await releaseMatchesMain(manifest.commit, mainCommit))) return undefined;

          return {
            commit: manifest.commit,
            digest,
            downloadUrl: dmg.browser_download_url,
            version,
          };
        } catch {
          return undefined;
        }
      },
    );
    if (!verified) return unavailable("no verified stable release was found");

    const response = NextResponse.redirect(verified.downloadUrl, 302);
    response.headers.set(
      "cache-control",
      "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    );
    response.headers.set("x-local-studio-version", verified.version);
    response.headers.set("x-local-studio-commit", verified.commit);
    response.headers.set("x-local-studio-main-commit", mainCommit);
    response.headers.set("x-local-studio-sha256", verified.digest);
    return response;
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : "GitHub request failed");
  }
}
