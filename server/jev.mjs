// Pure helpers for talking to the TypeSafe Jev systemone endpoint.

const PRICE_PER_INPUT_TOKEN_USD = 0.042 / 1_000_000

/**
 * Build a single-call Jev request: one Choice question whose options are the
 * whole command catalog. The answer's probability distribution IS the ranking.
 */
export function buildJevRequest(query, commands) {
  const options = {}
  for (const cmd of commands) {
    options[cmd.id] = `${cmd.label} — ${cmd.description}`
  }
  return {
    model: 'jev-latest',
    state: { query },
    questions: {
      command: {
        type: 'choice',
        instructions:
          'The user typed this query into a command palette (in Portuguese or English). Which command are they trying to run?',
        options,
      },
    },
  }
}

/**
 * Turn a Choice answer into a ranking sorted by descending probability.
 * Tolerates both `distribution` and `probabilities` field names; falls back
 * to the single chosen id when no distribution is returned.
 */
export function rankFromAnswer(answer) {
  const dist = answer.distribution ?? answer.probabilities
  if (dist && typeof dist === 'object') {
    return Object.entries(dist)
      .map(([id, p]) => ({ id, p }))
      .sort((a, b) => b.p - a.p)
  }
  if (answer.choice) {
    return [{ id: answer.choice, p: answer.confidence ?? 1 }]
  }
  return []
}

/** Output tokens are free; only input tokens are billed. */
export function costUsd(usage) {
  return (usage?.input_tokens ?? 0) * PRICE_PER_INPUT_TOKEN_USD
}
