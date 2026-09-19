// Pure accuracy metrics for the eval runner.

export function hitAtK(rankedIds, expected, k) {
  return rankedIds.slice(0, k).includes(expected)
}

function rate(rows, key) {
  return rows.filter((r) => r[key]).length / rows.length
}

export function summarize(rows) {
  const byCategory = {}
  for (const row of rows) {
    ;(byCategory[row.category] ??= []).push(row)
  }
  const fold = (subset) => ({ n: subset.length, top1: rate(subset, 'top1'), top3: rate(subset, 'top3') })
  return {
    overall: fold(rows),
    byCategory: Object.fromEntries(Object.entries(byCategory).map(([c, subset]) => [c, fold(subset)])),
  }
}
