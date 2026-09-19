import { useEffect, useMemo, useRef, useState } from 'react'
import { COMMANDS } from './commands.js'
import { fuzzyRank } from './fuzzy'
import { useJevRank } from './useJevRank'

interface Command {
  id: string
  label: string
  description: string
  group: string
  icon: string
}

const commands = COMMANDS as Command[]
const byId = new Map(commands.map((c) => [c.id, c]))

const EXAMPLES = [
  'jogar fora essa mensagem',
  'deixar a letra maior',
  'make it dark in here',
  'avisar que estou de férias',
  'mandar depois, não agora',
  'sumir com tudo que já li',
]

const TOP_N = 7

export function App() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [executed, setExecuted] = useState<Command | null>(null)
  const [serverMock, setServerMock] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { result, loading, error } = useJevRank(query)

  const jevRows = useMemo(() => {
    if (!result) return []
    return result.ranked
      .slice(0, TOP_N)
      .map(({ id, p }) => ({ command: byId.get(id), p }))
      .filter((r): r is { command: Command; p: number } => Boolean(r.command))
  }, [result])

  const fuzzyRows = useMemo(() => fuzzyRank(query, commands).slice(0, TOP_N), [query, commands])

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((h) => setServerMock(Boolean(h.mock)))
      .catch(() => setServerMock(null))
  }, [])

  useEffect(() => setSelected(0), [query, result])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, jevRows.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && jevRows[selected]) {
      run(jevRows[selected].command)
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  function run(command: Command) {
    setExecuted(command)
    setQuery('')
    setTimeout(() => setExecuted(null), 2600)
  }

  const confidence = result?.confidence ?? null

  return (
    <div className="page">
      <header className="masthead">
        <span className="wordmark">
          jev<em>palette</em>
        </span>
        <span className="tagline">
          uma ⌘K que entende intenção — decisões tipadas com{' '}
          <a href="https://typesafe.ai" target="_blank" rel="noreferrer">
            Jev
          </a>
          , sem embeddings
        </span>
        {serverMock === true && (
          <span className="badge badge-mock" title="Defina TYPESAFE_API_KEY no .env para usar o Jev real">
            modo mock
          </span>
        )}
        {serverMock === false && <span className="badge badge-live">jev ao vivo</span>}
      </header>

      <main className="stage">
        <section className="panel panel-jev" aria-label="Paleta semântica (Jev)">
          <div className="panel-head">
            <h2>semântica · jev</h2>
            <span className="panel-sub">um Choice, 77 opções, a distribuição é o ranking</span>
          </div>

          <div className="palette">
            <div className="palette-inputrow">
              <span className="prompt-glyph" aria-hidden>
                ⌘K
              </span>
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="digite a intenção, em português ou inglês…"
                aria-label="Buscar comando por intenção"
                spellCheck={false}
              />
              <span className={`pulse ${loading ? 'on' : ''}`} aria-hidden />
            </div>

            {query.trim() === '' && (
              <div className="hint">
                <p>experimente:</p>
                <div className="chips">
                  {EXAMPLES.map((ex) => (
                    <button key={ex} className="chip" onClick={() => setQuery(ex)}>
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && query.trim() !== '' && (
              <p className="error" role="alert">
                Jev fora do ar ({error}). Mostrando só o fuzzy ao lado — verifique o proxy e a chave.
              </p>
            )}

            <ul className="results" role="listbox" aria-label="Comandos por probabilidade">
              {jevRows.map(({ command, p }, i) => (
                <li
                  key={command.id}
                  role="option"
                  aria-selected={i === selected}
                  className={`row ${i === selected ? 'is-selected' : ''}`}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => run(command)}
                >
                  <span className="mass" style={{ width: `${Math.max(p * 100, 1.5)}%` }} aria-hidden />
                  <span className="row-icon" aria-hidden>
                    {command.icon}
                  </span>
                  <span className="row-label">
                    {command.label}
                    <small>{command.group}</small>
                  </span>
                  <span className="row-p">{(p * 100).toFixed(p >= 0.1 ? 0 : 1)}%</span>
                </li>
              ))}
            </ul>

            {result && (
              <div className="decision-strip" aria-label="Métricas da decisão">
                <span>
                  <b>{result.latencyMs}</b>ms
                </span>
                <span>
                  <b>{result.usage?.input_tokens ?? '—'}</b> tokens in
                </span>
                <span>
                  <b>${result.costUsd.toFixed(6)}</b> por tecla
                </span>
                {confidence !== null && (
                  <span>
                    confiança <b>{(confidence * 100).toFixed(0)}%</b>
                  </span>
                )}
                <span className="model">{result.model}</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel panel-fuzzy" aria-label="Baseline fuzzy">
          <div className="panel-head">
            <h2>fuzzy · baseline</h2>
            <span className="panel-sub">substring + subsequência sobre os rótulos, como toda paleta faz</span>
          </div>
          <ul className="results results-fuzzy">
            {fuzzyRows.map(({ command }) => (
              <li key={command.id} className="row row-fuzzy">
                <span className="row-icon" aria-hidden>
                  {(command as Command).icon}
                </span>
                <span className="row-label">
                  {command.label}
                  <small>{(command as Command).group}</small>
                </span>
              </li>
            ))}
            {query.trim() !== '' && fuzzyRows.length === 0 && (
              <li className="empty">
                nenhum resultado — o texto não bate com nenhum rótulo.
                <br />
                <span>é aqui que o fuzzy desiste.</span>
              </li>
            )}
            {query.trim() === '' && <li className="empty">digite ao lado para comparar</li>}
          </ul>
        </section>
      </main>

      {executed && (
        <div className="toast" role="status">
          <span aria-hidden>{executed.icon}</span> Executado: <b>{executed.label}</b>
        </div>
      )}

      <footer className="colophon">
        77 comandos · 1 chamada por tecla (debounce 200ms) · Choice devolve a distribuição completa —{' '}
        nenhum embedding, nenhum índice, nenhum token de saída cobrado
      </footer>
    </div>
  )
}
