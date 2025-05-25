
export function sortRuns<T extends { cells: number; time: number; mazeCompleted: boolean }>(runs: T[]): T[] {
  // If a run is completed, it is ordered before an incomplete run.
  // Between two completed runs, the one with the shorter time is ordered first.
  // Between two incomplete runs, the one with more cells visited is ordered first.

  return runs.sort((a, b) => {
    if (a.mazeCompleted && !b.mazeCompleted) return -1;
    if (!a.mazeCompleted && b.mazeCompleted) return 1;
    if (a.mazeCompleted && b.mazeCompleted) return a.time - b.time;
    return b.cells - a.cells;
  });
}