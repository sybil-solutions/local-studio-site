export type ReleaseComparison = {
  status?: string;
  ahead_by?: number;
  behind_by?: number;
};

export function comparisonContainsRelease(comparison: ReleaseComparison): boolean {
  return (
    comparison.status === "ahead" &&
    comparison.behind_by === 0 &&
    typeof comparison.ahead_by === "number" &&
    comparison.ahead_by > 0
  );
}
