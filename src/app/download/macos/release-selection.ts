export type ListedRelease = {
  tag_name?: string;
  draft?: boolean;
  prerelease?: boolean;
  published_at?: string;
};

function releaseTimestamp(release: ListedRelease): number {
  const timestamp = Date.parse(release.published_at ?? "");
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function stableReleasesNewestFirst<T extends ListedRelease>(releases: readonly T[]): T[] {
  return releases
    .filter((release) => !release.draft && !release.prerelease)
    .sort((left, right) => releaseTimestamp(right) - releaseTimestamp(left));
}

export async function selectLatestValidRelease<T extends ListedRelease, Match>(
  releases: readonly T[],
  validate: (release: T) => Promise<Match | undefined>,
): Promise<Match | undefined> {
  for (const release of stableReleasesNewestFirst(releases)) {
    const match = await validate(release);
    if (match !== undefined) return match;
  }
  return undefined;
}
