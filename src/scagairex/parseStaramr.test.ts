import { describe, it, expect } from 'vitest'
import { parseStaramr } from './parseStaramr'

const SAMPLE_STARAMR = `Isolate ID\tGene\tPredicted Phenotype\t%Identity\t%Overlap\tHSP Length/Total Length\tContig\tStart\tEnd\tAccession
SRR12345\ttet(A)\ttetracycline\t99.50\t100.00\t1200/1200\tcontig1\t100\t1300\tAJ517790
SRR12345\taph(3'')-Ib\taminoglycoside\t98.00\t99.50\t800/800\tcontig2\t200\t1000\tAF321553`

describe('parseStaramr', () => {
  it('parses header and records', () => {
    const result = parseStaramr(SAMPLE_STARAMR)
    expect(result.format).toBe('staramr')
    expect(result.records).toHaveLength(2)
  })

  it('extracts gene names from Gene column', () => {
    const result = parseStaramr(SAMPLE_STARAMR)
    expect(result.records[0].gene).toBe('tet(A)')
    expect(result.records[1].gene).toBe("aph(3'')-Ib")
  })

  it('preserves raw fields', () => {
    const result = parseStaramr(SAMPLE_STARAMR)
    expect(result.records[0].rawFields[0]).toBe('SRR12345')
  })

  it('handles empty input', () => {
    const result = parseStaramr('Isolate ID\tGene\n')
    expect(result.records).toHaveLength(0)
  })
})
