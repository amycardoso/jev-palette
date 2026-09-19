// Eval runner: measures Jev vs the fuzzy baseline on the labeled query set.
// Usage: node eval/run.mjs   (needs TYPESAFE_API_KEY in env or ../.env)
// Node >= 22.6 (imports ../src/fuzzy.ts via native type stripping).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildJevRequest, rankFromAnswer, costUsd } from '../server/jev.mjs'
import { COMMANDS } from '../src/commands.js'
import { fuzzyRank } from '../src/fuzzy.ts'
import { QUERIES } from './queries.mjs'
import { hitAtK, summarize } from './metrics.mjs'

const JEV_URL = 'https://api.typesafe.ai/v1/systemone'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const key =
  process.env.TYPESAFE_API_KEY ??
  readFileSync(join(root, '.env'), 'utf8').match(/^TYPESAFE_API_KEY=(.+)$/m)?.[1].trim()
if (!key) throw new Error('TYPESAFE_API_KEY not found (env or .env)')

async function jevRank(query) {
  const started = performance.now()
  const res = await fetch(JEV_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(buildJevRequest(query, COMMANDS)),
    signal: AbortSignal.timeout(15000),
  })
  const latencyMs = performance.now() - started
  if (!res.ok) throw new Error(`${res.status} on "${query}": ${(await res.text()).slice(0, 200)}`)
  const body = await res.json()
  return {
    ids: rankFromAnswer(body.answers.command).map((r) => r.id),
    latencyMs,
    cost: costUsd(body.usage),
  }
}

const jevRows = []
const fuzzyRows = []
let totalLatency = 0
let totalCost = 0
let done = 0

for (const { q, expected, category } of QUERIES) {
  const jev = await jevRank(q)
  totalLatency += jev.latencyMs
  totalCost += jev.cost
  jevRows.push({ category, top1: hitAtK(jev.ids, expected, 1), top3: hitAtK(jev.ids, expected, 3) })

  const fuzzyIds = fuzzyRank(q, COMMANDS).map((r) => r.id)
  fuzzyRows.push({ category, top1: hitAtK(fuzzyIds, expected, 1), top3: hitAtK(fuzzyIds, expected, 3) })

  done++
  const jevMark = jevRows.at(-1).top1 ? '✓' : jevRows.at(-1).top3 ? '~' : '✗'
  const fuzzyMark = fuzzyRows.at(-1).top1 ? '✓' : fuzzyRows.at(-1).top3 ? '~' : '✗'
  console.error(`[${String(done).padStart(2)}/${QUERIES.length}] jev ${jevMark}  fuzzy ${fuzzyMark}  ${q}`)
}

const jev = summarize(jevRows)
const fuzzy = summarize(fuzzyRows)
const pct = (x) => `${Math.round(x * 100)}%`

const categories = ['pt-intent', 'en-intent', 'name']
console.log('\n| Slice | n | Jev top-1 | Jev top-3 | Fuzzy top-1 | Fuzzy top-3 |')
console.log('|---|---|---|---|---|---|')
for (const c of categories) {
  const j = jev.byCategory[c]
  const f = fuzzy.byCategory[c]
  console.log(`| ${c} | ${j.n} | ${pct(j.top1)} | ${pct(j.top3)} | ${pct(f.top1)} | ${pct(f.top3)} |`)
}
console.log(
  `| **overall** | ${jev.overall.n} | **${pct(jev.overall.top1)}** | **${pct(jev.overall.top3)}** | ${pct(fuzzy.overall.top1)} | ${pct(fuzzy.overall.top3)} |`,
)
console.log(
  `\nJev mean latency: ${Math.round(totalLatency / QUERIES.length)}ms · total cost for ${QUERIES.length} calls: $${totalCost.toFixed(4)}`,
)
