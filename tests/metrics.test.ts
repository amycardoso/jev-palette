import { describe, test, expect } from 'vitest'
import { hitAtK, summarize } from '../eval/metrics.mjs'

describe('hitAtK', () => {
  test('hits when the expected id is within the first k entries', () => {
    expect(hitAtK(['a', 'b', 'c'], 'a', 1)).toBe(true)
    expect(hitAtK(['a', 'b', 'c'], 'c', 3)).toBe(true)
  })

  test('misses when the expected id is absent or beyond k', () => {
    expect(hitAtK(['a', 'b', 'c'], 'c', 1)).toBe(false)
    expect(hitAtK([], 'a', 3)).toBe(false)
  })
})

describe('summarize', () => {
  test('aggregates top-1/top-3 rates per category and overall', () => {
    const rows = [
      { category: 'pt-intent', top1: true, top3: true },
      { category: 'pt-intent', top1: false, top3: true },
      { category: 'name', top1: true, top3: true },
      { category: 'name', top1: false, top3: false },
    ]
    const s = summarize(rows)
    expect(s.overall).toEqual({ n: 4, top1: 0.5, top3: 0.75 })
    expect(s.byCategory['pt-intent']).toEqual({ n: 2, top1: 0.5, top3: 1 })
    expect(s.byCategory.name).toEqual({ n: 2, top1: 0.5, top3: 0.5 })
  })
})
