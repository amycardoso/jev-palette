import { describe, test, expect } from 'vitest'
import { buildJevRequest, rankFromAnswer, costUsd } from '../server/jev.mjs'

const commands = [
  { id: 'delete_message', label: 'Delete message', description: 'Move the current message to the trash' },
  { id: 'archive', label: 'Archive', description: 'Archive the current message' },
]

describe('buildJevRequest', () => {
  test('builds a single choice question with one option per command', () => {
    const req = buildJevRequest('jogar fora essa mensagem', commands)
    expect(req.model).toBe('jev-latest')
    expect(req.state.query).toBe('jogar fora essa mensagem')
    expect(req.questions.command.type).toBe('choice')
    expect(req.questions.command.instructions).toContain('command palette')
    expect(Object.keys(req.questions.command.criteria)).toEqual(['delete_message', 'archive'])
    const criteria = req.questions.command.criteria as Record<string, string>
    expect(criteria.delete_message).toContain('trash')
  })
})

describe('rankFromAnswer', () => {
  test('sorts ids by descending probability from the distribution', () => {
    const ranked = rankFromAnswer({
      type: 'choice',
      choice: 'delete_message',
      confidence: 0.91,
      distribution: { archive: 0.07, delete_message: 0.91 },
    })
    expect(ranked.map((r) => r.id)).toEqual(['delete_message', 'archive'])
    expect(ranked[0].p).toBeCloseTo(0.91)
  })

  test('accepts "probabilities" as an alternative field name', () => {
    const ranked = rankFromAnswer({
      type: 'choice',
      choice: 'archive',
      probabilities: { archive: 0.8, delete_message: 0.2 },
    })
    expect(ranked[0]).toEqual({ id: 'archive', p: 0.8 })
  })

  test('falls back to the single chosen id when no distribution is present', () => {
    const ranked = rankFromAnswer({ type: 'choice', choice: 'archive', confidence: 0.6 })
    expect(ranked).toEqual([{ id: 'archive', p: 0.6 }])
  })
})

describe('costUsd', () => {
  test('charges $0.042 per million input tokens and nothing for output', () => {
    expect(costUsd({ input_tokens: 1_000_000, output_tokens: 31 })).toBeCloseTo(0.042)
    expect(costUsd({ input_tokens: 2100, output_tokens: 999 })).toBeCloseTo(0.0000882)
  })
})
