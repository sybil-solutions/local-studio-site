import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  selectLatestValidRelease,
  stableReleasesNewestFirst,
  type ListedRelease,
} from "./release-selection";

type TestRelease = ListedRelease & { tag_name: string };

describe("macOS release selection", () => {
  test("orders stable releases newest first", () => {
    const releases: TestRelease[] = [
      { tag_name: "v1.0.0", published_at: "2026-08-01T00:00:00Z" },
      {
        tag_name: "v3.0.0-beta.1",
        prerelease: true,
        published_at: "2026-08-03T00:00:00Z",
      },
      { tag_name: "v2.0.0", published_at: "2026-08-02T00:00:00Z" },
      {
        tag_name: "v4.0.0-draft",
        draft: true,
        published_at: "2026-08-04T00:00:00Z",
      },
    ];

    assert.deepEqual(
      stableReleasesNewestFirst(releases).map((release) => release.tag_name),
      ["v2.0.0", "v1.0.0"],
    );
  });

  test("falls back to the newest release that passes validation", async () => {
    const releases: TestRelease[] = [
      { tag_name: "v2.0.0", published_at: "2026-08-02T00:00:00Z" },
      { tag_name: "v1.0.0", published_at: "2026-08-01T00:00:00Z" },
    ];
    const visited: string[] = [];

    const selected = await selectLatestValidRelease(releases, async (release) => {
      visited.push(release.tag_name);
      return release.tag_name === "v1.0.0" ? release.tag_name : undefined;
    });

    assert.equal(selected, "v1.0.0");
    assert.deepEqual(visited, ["v2.0.0", "v1.0.0"]);
  });
});
