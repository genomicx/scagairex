import { describe, it, expect, vi } from 'vitest'
import { buildTsv } from './exportResults'
import type { FilterResult } from './types'

describe('buildTsv', () => {
  it('includes header and records', () => {
    const result: FilterResult = {
      inputCount: 3,
      filteredCount: 2,
      removedCount: 1,
      format: 'abricate',
      header: 'FILE\tGENE\tDATABASE',
      records: [
        { gene: 'blaTEM-1', rawFields: ['sample.fasta', 'blaTEM-1', 'card'] },
        { gene: 'tet(A)', rawFields: ['sample.fasta', 'tet(A)', 'resfinder'] },
      ],
    }
    const tsv = buildTsv(result)
    const lines = tsv.split('\n')
    expect(lines[0]).toBe('FILE\tGENE\tDATABASE')
    expect(lines[1]).toBe('sample.fasta\tblaTEM-1\tcard')
    expect(lines[2]).toBe('sample.fasta\ttet(A)\tresfinder')
    expect(lines).toHaveLength(3)
  })

  it('round-trips original fields correctly', () => {
    const rawLine = 'sample.fa\tcontig1\t100\t900\t+\tblaTEM-1\t1-800/800\t========\t0\t100.00\t99.50\tcard\tNG_050897\tbeta-lactamase\tambicillin'
    const result: FilterResult = {
      inputCount: 1,
      filteredCount: 1,
      removedCount: 0,
      format: 'abricate',
      header: '#FILE\tSEQUENCE\tSTART\tEND\tSTRAND\tGENE\tCOVERAGE\tCOVERAGE_MAP\tGAPS\t%COVERAGE\t%IDENTITY\tDATABASE\tACCESSION\tPRODUCT\tRESISTANCE',
      records: [{ gene: 'blaTEM-1', rawFields: rawLine.split('\t') }],
    }
    const tsv = buildTsv(result)
    expect(tsv.split('\n')[1]).toBe(rawLine)
  })
})

// Suppress file-saver import error in test environment
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))
