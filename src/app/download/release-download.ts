import { NextResponse } from "next/server";
import {
  comparisonContainsRelease,
  type ReleaseComparison,
} from "./macos/release-provenance";
import {
  selectLatestValidRelease,
  type ListedRelease,
} from "./macos/release-selection";

const REPO_API = "https://api.github.com/repos/sybil-solutions/local-studio";
const RELEASES_API = `${REPO_API}/releases?per_page=100`;
const MAIN_COMMIT_API = `${REPO_API}/commits/main`;
const COMPARE_API = `${REPO_API}/compare`;
const RELEASE_PUBLISHER = "github-actions[bot]";
const MANIFEST_ASSET = "Local-Studio-manifest.json";
const LEGACY_MANIFEST_ASSET = "Local-Studio-release.json";
const LEGACY_DMG_ASSET = "Local-Studio-arm64.dmg";

export const DOWNLOAD_TARGETS = {
  macos: { asset: "Local-Studio-mac-arm64.dmg", label: "macOS", legacy: true },
  "macos-arm64": { asset: "Local-Studio-mac-arm64.dmg", label: "macOS (Apple Silicon)", legacy: true },
  "macos-x64": { asset: "Local-Studio-mac-x64.dmg", label: "macOS (Intel)", legacy: false },
  windows: { asset: "Local-Studio-win-x64.exe", label: "Windows", legacy: false },
  linux: { asset: "Local-Studio-linux-x64.AppImage", label: "Linux", legacy: false },
  "linux-arm64": { asset: "Local-Studio-linux-arm64.AppImage", label: "Linux (arm64)", legacy: false },
} as const;

export type DownloadTarget = keyof typeof DOWNLOAD_TARGETS;

type ReleaseAsset = {
  name?: string;
  browser_download_url?: string;
  digest?: string | null;
  size?: number;
};
type Release = ListedRelease & {
  assets?: ReleaseAsset[];
  author?: { login?: string };
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

export function isDownloadTarget(value: string): value is DownloadTarget {
  return Object.hasOwn(DOWNLOAD_TARGETS, value);
}

function unavailable(label: string, reason: string, status = 503): NextResponse {
  return NextResponse.json(
    { error: `The latest verified ${label} build is temporarily unavailable.`, reason },
    {
      status,
      headers: {
        "cache-control": "no-store",
        "retry-after": "300",
      },
    },
  );
}

async function githubJson<T>(url: string, revalidate = 60): Promise<T> {
  const token = url.startsWith("https://api.github.com/") ? process.env.GITHUB_TOKEN : undefined;
  const init: RequestInit & { cf?: { cacheTtl: number; cacheEverything: boolean } } = {
    next: { revalidate },
    cf: { cacheTtl: revalidate, cacheEverything: true },
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "localstudio.ai",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return (await response.json()) as T;
}

function releaseVersion(release: Release): string | undefined {
  return release.tag_name?.replace(/^v/, "") || undefined;
}

function findAsset(release: Release, name: string): ReleaseAsset | undefined {
  return release.assets?.find((entry) => entry.name === name && entry.browser_download_url);
}

async function verifyRelease(release: Release, assetName: string): Promise<VerifiedRelease | undefined> {
  if (release.author?.login !== RELEASE_PUBLISHER) return undefined;
  const asset = findAsset(release, assetName);
  const manifestAsset = findAsset(release, MANIFEST_ASSET);
  if (!asset?.browser_download_url || !manifestAsset?.browser_download_url) return undefined;

  const manifest = await githubJson<ReleaseManifest>(manifestAsset.browser_download_url);
  const version = releaseVersion(release);
  const digest = manifest.assets?.[assetName]?.sha256;
  if (
    manifest.schemaVersion !== 2 ||
    !version ||
    manifest.version !== version ||
    !manifest.commit ||
    !/^[0-9a-f]{40}$/.test(manifest.commit) ||
    !digest ||
    !/^[0-9a-f]{64}$/.test(digest)
  ) {
    return undefined;
  }
  if (asset.digest && asset.digest !== `sha256:${digest}`) return undefined;

  return { commit: manifest.commit, digest, downloadUrl: asset.browser_download_url, version };
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

async function verifyLegacyRelease(release: Release): Promise<VerifiedRelease | undefined> {
  const dmg = findAsset(release, LEGACY_DMG_ASSET);
  const manifestAsset = findAsset(release, LEGACY_MANIFEST_ASSET);
  if (!dmg?.browser_download_url || !manifestAsset?.browser_download_url) return undefined;

  const manifest = await githubJson<ReleaseManifest>(manifestAsset.browser_download_url);
  const version = releaseVersion(release);
  const digest = manifest.assets?.[LEGACY_DMG_ASSET]?.sha256;
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
  const main = await githubJson<Commit>(MAIN_COMMIT_API);
  if (!main.sha || !(await releaseMatchesMain(manifest.commit, main.sha))) return undefined;

  return { commit: manifest.commit, digest, downloadUrl: dmg.browser_download_url, version };
}

export async function redirectToVerifiedDownload(target: string): Promise<NextResponse> {
  if (!isDownloadTarget(target)) return unavailable(target, "unknown download target", 404);
  const { asset, label, legacy } = DOWNLOAD_TARGETS[target];

  try {
    const releases = await githubJson<Release[]>(RELEASES_API);
    const verified = await selectLatestValidRelease<Release, VerifiedRelease>(
      releases,
      async (release) => {
        try {
          return (
            (await verifyRelease(release, asset)) ??
            (legacy ? await verifyLegacyRelease(release) : undefined)
          );
        } catch {
          return undefined;
        }
      },
    );
    if (!verified) return unavailable(label, "no verified stable release was found");

    const response = NextResponse.redirect(verified.downloadUrl, 302);
    response.headers.set(
      "cache-control",
      "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    );
    response.headers.set("x-local-studio-version", verified.version);
    response.headers.set("x-local-studio-commit", verified.commit);
    response.headers.set("x-local-studio-sha256", verified.digest);
    return response;
  } catch (error) {
    return unavailable(label, error instanceof Error ? error.message : "GitHub request failed");
  }
}

export type PublishedAsset = { name: string; url: string; size: number; sha256: string };
export type PublishedRelease = {
  version: string;
  publishedAt: string;
  pageUrl: string;
  sumsUrl: string | undefined;
  assets: PublishedAsset[];
};

export async function latestPublishedRelease(): Promise<PublishedRelease | undefined> {
  const releases = await githubJson<(Release & { html_url?: string })[]>(RELEASES_API, 300);
  return selectLatestValidRelease(releases, async (release) => {
    try {
      const manifestAsset = findAsset(release, MANIFEST_ASSET);
      const version = releaseVersion(release);
      if (release.author?.login !== RELEASE_PUBLISHER || !manifestAsset?.browser_download_url || !version) {
        return undefined;
      }
      const manifest = await githubJson<ReleaseManifest>(manifestAsset.browser_download_url, 3600);
      if (manifest.schemaVersion !== 2 || manifest.version !== version) return undefined;
      const assets = (release.assets ?? []).flatMap((asset) => {
        const sha256 = asset.name ? manifest.assets?.[asset.name]?.sha256 : undefined;
        return asset.name && asset.browser_download_url && sha256
          ? [{ name: asset.name, url: asset.browser_download_url, size: asset.size ?? 0, sha256 }]
          : [];
      });
      return {
        version,
        publishedAt: release.published_at ?? "",
        pageUrl: release.html_url ?? `https://github.com/sybil-solutions/local-studio/releases/tag/v${version}`,
        sumsUrl: findAsset(release, "SHA256SUMS")?.browser_download_url,
        assets,
      };
    } catch {
      return undefined;
    }
  });
}
