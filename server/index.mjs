import http from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildJevRequest, rankFromAnswer, costUsd } from './jev.mjs'
import { COMMANDS } from '../src/commands.js'

const PORT = process.env.PORT ?? 8787
const JEV_URL = 'https://api.typesafe.ai/v1/systemone'

// Load TYPESAFE_API_KEY from the environment or a local .env file.
function loadApiKey() {
  if (process.env.TYPESAFE_API_KEY) return process.env.TYPESAFE_API_KEY
  try {
    const env = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '.env'), 'utf8')
    const match = env.match(/^TYPESAFE_API_KEY=(.+)$/m)
    return match?.[1].trim()
  } catch {
    return undefined
  }
}

const API_KEY = loadApiKey()
const MOCK = process.env.JEV_MOCK === '1' || (!API_KEY && process.env.JEV_MOCK !== '0')

async function callJev(query) {
  const request = buildJevRequest(query, COMMANDS)
  const started = performance.now()
  const res = await fetch(JEV_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    signal: AbortSignal.timeout(4000),
  })
  const latencyMs = Math.round(performance.now() - started)
  if (!res.ok) {
    throw new Error(`Jev respondeu ${res.status}: ${(await res.text()).slice(0, 300)}`)
  }
  const body = await res.json()
  const answer = body.answers?.command ?? {}
  return {
    ranked: rankFromAnswer(answer),
    confidence: answer.confidence ?? null,
    latencyMs,
    usage: body.usage ?? null,
    costUsd: costUsd(body.usage),
    model: body.model ?? 'jev',
    mock: false,
  }
}

// Offline stand-in so the demo runs before the API key is configured.
// Deliberately dumb: keyword overlap over labels+descriptions plus a PT
// synonym nudge, softmaxed into something distribution-shaped.
const PT_HINTS = {
  'jogar fora': 'delete trash', apagar: 'delete trash', lixeira: 'trash',
  arquivar: 'archive', responder: 'reply', encaminhar: 'forward',
  'letra maior': 'bigger increase font', 'letra menor': 'smaller decrease font',
  escuro: 'dark', desfazer: 'undo', buscar: 'search find', enviar: 'send',
  anexar: 'attach file', imprimir: 'print', sair: 'sign out leave',
  ferias: 'vacation holiday', férias: 'vacation holiday', senha: 'password',
}

function mockJev(query) {
  const q = query.toLowerCase()
  let expanded = q
  for (const [pt, en] of Object.entries(PT_HINTS)) {
    if (q.includes(pt)) expanded += ' ' + en
  }
  const words = expanded.split(/\s+/).filter((w) => w.length > 2)
  const scores = COMMANDS.map((cmd) => {
    const hay = `${cmd.label} ${cmd.description}`.toLowerCase()
    const hits = words.filter((w) => hay.includes(w)).length
    return { id: cmd.id, s: hits }
  })
  const temp = 1.5
  const exps = scores.map(({ id, s }) => ({ id, e: Math.exp(s * temp) }))
  const total = exps.reduce((acc, { e }) => acc + e, 0)
  const ranked = exps
    .map(({ id, e }) => ({ id, p: e / total }))
    .sort((a, b) => b.p - a.p)
  const inputTokens = 900 + Math.round(query.length / 4)
  return {
    ranked,
    confidence: ranked[0].p,
    latencyMs: 90 + Math.round(Math.random() * 60),
    usage: { input_tokens: inputTokens, output_tokens: 0 },
    costUsd: costUsd({ input_tokens: inputTokens }),
    model: 'mock-local',
    mock: true,
  }
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/api/health') {
    return json(res, 200, { ok: true, mock: MOCK, hasKey: Boolean(API_KEY) })
  }
  if (req.method === 'POST' && req.url === '/api/rank') {
    let raw = ''
    for await (const chunk of req) raw += chunk
    let query
    try {
      query = JSON.parse(raw).query
    } catch {
      return json(res, 400, { error: 'JSON inválido' })
    }
    if (typeof query !== 'string' || !query.trim()) {
      return json(res, 400, { error: 'Informe "query" como texto não vazio' })
    }
    try {
      const result = MOCK ? mockJev(query) : await callJev(query)
      if (MOCK) await new Promise((r) => setTimeout(r, result.latencyMs))
      return json(res, 200, result)
    } catch (err) {
      console.error('[jev]', err.message)
      return json(res, 502, { error: err.message })
    }
  }
  json(res, 404, { error: 'Rota desconhecida' })
})

server.listen(PORT, () => {
  console.log(
    `jev-palette proxy em http://localhost:${PORT} — modo: ${MOCK ? 'MOCK (sem chave)' : 'Jev real'}`,
  )
})
