// Classic fuzzy matcher, on purpose: this is the baseline the Jev ranking
// gets compared against. It only sees the command labels, exactly like a
// traditional palette would.

export interface CommandLike {
  id: string
  label: string
}

interface FuzzyResult<T> {
  id: string
  score: number
  command: T
}

function substringScore(query: string, label: string): number | null {
  const idx = label.indexOf(query)
  if (idx === -1) return null
  // Earlier and tighter matches score higher.
  return 100 - idx + (query.length / label.length) * 20
}

function subsequenceScore(query: string, label: string): number | null {
  let li = 0
  let score = 0
  for (const ch of query) {
    if (ch === ' ') continue
    const found = label.indexOf(ch, li)
    if (found === -1) return null
    score += found === li ? 3 : 1 // consecutive hits are worth more
    li = found + 1
  }
  return score
}

export function fuzzyRank<T extends CommandLike>(query: string, commands: T[]): FuzzyResult<T>[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: FuzzyResult<T>[] = []
  for (const command of commands) {
    const label = command.label.toLowerCase()
    const score = substringScore(q, label) ?? subsequenceScore(q, label)
    if (score !== null) results.push({ id: command.id, score, command })
  }
  return results.sort((a, b) => b.score - a.score)
}
