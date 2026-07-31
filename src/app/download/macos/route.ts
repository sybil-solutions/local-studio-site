import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DMG_ASSET = "Local-Studio-arm64.dmg";
const MANIFEST_ASSET = "Local-Studio-release.json";
const LATEST_RELEASE_API =
  "https://api.github.com/repos/sybil-solutions/local-studio/releases/latest";
const MAIN_COMMIT_API =
  "https://api.github.com/repos/sybil-solutions/local-studio/commits/main";
const COMPARE_API =
  "https://api.github.com/repos/sybil-solutions/local-studio/compare";
const NON_PACKAGED_RELEASE_FILES = new Set(["scripts/sign-desktop-release.mjs"]);

type ReleaseAsset = { name?: string; browser_download_url?: string };
type Release = {
  tag_name?: string;
  draft?: boolean;
  prerelease?: boolean;
  assets?: ReleaseAsset[];
};
type Commit = { sha?: string };
type Comparison = {
  status?: string;
  ahead_by?: number;
  behind_by?: number;
  total_commits?: number;
  commits?: unknown[];
  files?: { filename?: string }[];
};
type ReleaseManifest = {
  schemaVersion?: number;
  version?: string;
  commit?: string;
  assets?: Record<string, { sha256?: string }>;
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

  const comparison = await githubJson<Comparison>(
    `${COMPARE_API}/${releaseCommit}...${mainCommit}`,
  );
  const commits = comparison.commits ?? [];
  const files = comparison.files ?? [];
  return (
    comparison.status === "ahead" &&
    comparison.behind_by === 0 &&
    typeof comparison.ahead_by === "number" &&
    comparison.ahead_by > 0 &&
    comparison.total_commits === commits.length &&
    files.length > 0 &&
    files.every(
      ({ filename }) => typeof filename === "string" && NON_PACKAGED_RELEASE_FILES.has(filename),
    )
  );
}

export async function GET(): Promise<NextResponse> {
  try {
    const [release, main] = await Promise.all([
      githubJson<Release>(LATEST_RELEASE_API),
      githubJson<Commit>(MAIN_COMMIT_API),
    ]);
    if (release.draft || release.prerelease) return unavailable("latest release is not stable");

    const dmg = release.assets?.find((entry) => entry.name === DMG_ASSET);
    const manifestAsset = release.assets?.find((entry) => entry.name === MANIFEST_ASSET);
    if (!dmg?.browser_download_url || !manifestAsset?.browser_download_url) {
      return unavailable("latest release is incomplete");
    }

    const manifest = await githubJson<ReleaseManifest>(manifestAsset.browser_download_url);
    const version = release.tag_name?.replace(/^v/, "");
    const digest = manifest.assets?.[DMG_ASSET]?.sha256;
    if (
      manifest.schemaVersion !== 1 ||
      !version ||
      manifest.version !== version ||
      !main.sha ||
      !manifest.commit ||
      !digest ||
      !/^[0-9a-f]{64}$/.test(digest)
    ) {
      return unavailable("latest release does not match main");
    }
    if (!(await releaseMatchesMain(manifest.commit, main.sha))) {
      return unavailable("latest release does not match main");
    }

    const response = NextResponse.redirect(dmg.browser_download_url, 302);
    response.headers.set("x-local-studio-version", version);
    response.headers.set("x-local-studio-commit", manifest.commit);
    response.headers.set("x-local-studio-main-commit", main.sha);
    response.headers.set("x-local-studio-sha256", digest);
    return response;
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : "GitHub request failed");
  }
}
