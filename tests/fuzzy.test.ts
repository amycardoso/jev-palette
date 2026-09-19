import { describe, test, expect } from 'vitest'
import { fuzzyRank } from '../src/fuzzy'

const commands = [
  { id: 'delete_message', label: 'Delete message', description: '', group: '', icon: '' },
  { id: 'increase_font', label: 'Increase font size', description: '', group: '', icon: '' },
  { id: 'dark_mode', label: 'Toggle dark mode', description: '', group: '', icon: '' },
]

describe('fuzzyRank', () => {
  test('ranks exact substring matches first', () => {
    const ranked = fuzzyRank('delete', commands)
    expect(ranked[0].id).toBe('delete_message')
  })

  test('matches subsequences (dkm -> Toggle dark mode)', () => {
    const ranked = fuzzyRank('drk md', commands)
    expect(ranked[0].id).toBe('dark_mode')
  })

  test('returns no matches for semantic-only queries (the honest failure)', () => {
    expect(fuzzyRank('jogar fora', commands)).toEqual([])
  })

  test('empty query matches nothing', () => {
    expect(fuzzyRank('  ', commands)).toEqual([])
  })
})
