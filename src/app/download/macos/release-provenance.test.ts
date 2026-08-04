import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { comparisonContainsRelease } from "./release-provenance";

describe("macOS release provenance", () => {
  test("keeps the latest release available while main advances", () => {
    assert.equal(
      comparisonContainsRelease({ status: "ahead", ahead_by: 1, behind_by: 0 }),
      true,
    );
    assert.equal(
      comparisonContainsRelease({ status: "ahead", ahead_by: 100, behind_by: 0 }),
      true,
    );
  });

  test("rejects a release commit that is not an ancestor of main", () => {
    assert.equal(
      comparisonContainsRelease({ status: "diverged", ahead_by: 2, behind_by: 1 }),
      false,
    );
    assert.equal(
      comparisonContainsRelease({ status: "behind", ahead_by: 0, behind_by: 1 }),
      false,
    );
    assert.equal(
      comparisonContainsRelease({ status: "ahead", ahead_by: 0, behind_by: 0 }),
      false,
    );
  });
});
