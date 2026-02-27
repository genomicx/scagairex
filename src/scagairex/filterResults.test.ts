import { describe, it, expect } from 'vitest'
import { filterResults } from './filterResults'
import type { ParsedInput, SpeciesDatabase } from './types'

function makeDb(): SpeciesDatabase {
  const ecoliGenes = new Map([
    ['blaTEM-1', { gene: 'blaTEM-1', occurrences: 500, program: 'abricate', database: 'card' }],
    ['tet(A)', { gene: 'tet(A)', occurrences: 10, program: 'abricate', database: 'resfinder' }],
  ])
  const genesBySpecies = new Map([['Escherichia coli', ecoliGenes]])
  return { speciesList: ['Escherichia coli'], genesBySpecies }
}

function makeParsed(genes: string[]): ParsedInput {
  return {
    format: 'abricate',
    header: 'FILE\tGENE',
    records: genes.map(g => ({ gene: g, rawFields: ['sample.fasta', g] })),
  }
}

describe('filterResults', () => {
  it('keeps genes known for the species', () => {
    const db = makeDb()
    const parsed = makeParsed(['blaTEM-1', 'tet(A)'])
    const result = filterResults(parsed, db, 'Escherichia coli', 0)
    expect(result.filteredCount).toBe(2)
    expect(result.removedCount).toBe(0)
  })

  it('removes genes not known for the species', () => {
    const db = makeDb()
    const parsed = makeParsed(['blaTEM-1', 'vanA', 'mecA'])
    const result = filterResults(parsed, db, 'Escherichia coli', 0)
    expect(result.filteredCount).toBe(1)
    expect(result.removedCount).toBe(2)
    expect(result.records[0].gene).toBe('blaTEM-1')
  })

  it('applies minOccurrences filter', () => {
    const db = makeDb()
    const parsed = makeParsed(['blaTEM-1', 'tet(A)'])
    const result = filterResults(parsed, db, 'Escherichia coli', 50)
    // tet(A) has 10 occurrences, below threshold of 50
    expect(result.filteredCount).toBe(1)
    expect(result.records[0].gene).toBe('blaTEM-1')
  })

  it('returns 0 results for unknown species', () => {
    const db = makeDb()
    const parsed = makeParsed(['blaTEM-1'])
    const result = filterResults(parsed, db, 'Unknown species', 0)
    expect(result.filteredCount).toBe(0)
    expect(result.removedCount).toBe(1)
  })

  it('reports correct input count', () => {
    const db = makeDb()
    const parsed = makeParsed(['blaTEM-1', 'vanA'])
    const result = filterResults(parsed, db, 'Escherichia coli', 0)
    expect(result.inputCount).toBe(2)
  })
})
