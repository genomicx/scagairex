import { describe, it, expect } from 'vitest'
import { parseAbricate } from './parseAbricate'

const SAMPLE_ABRICATE_V098 = `#FILE\tSEQUENCE\tSTART\tEND\tSTRAND\tGENE\tCOVERAGE\tCOVERAGE_MAP\tGAPS\t%COVERAGE\t%IDENTITY\tDATABASE\tACCESSION\tPRODUCT\tRESISTANCE
sample1.fasta\tcontig1\t100\t900\t+\tblaTEM-1\t1-800/800\t========\t0/0\t100.00\t99.50\tcard\tNG_050897\tbeta-lactamase\tambicillin
sample1.fasta\tcontig2\t200\t1000\t+\taac(6')-Ib-cr\t1-800/800\t========\t0/0\t100.00\t98.00\tresfinder\tAY530558\taminoglycoside\tgentamicin`

describe('parseAbricate', () => {
  it('parses header and records', () => {
    const result = parseAbricate(SAMPLE_ABRICATE_V098)
    expect(result.format).toBe('abricate')
    expect(result.records).toHaveLength(2)
  })

  it('extracts gene names correctly', () => {
    const result = parseAbricate(SAMPLE_ABRICATE_V098)
    expect(result.records[0].gene).toBe('blaTEM-1')
    expect(result.records[1].gene).toBe("aac(6')-Ib-cr")
  })

  it('preserves raw fields for export', () => {
    const result = parseAbricate(SAMPLE_ABRICATE_V098)
    expect(result.records[0].rawFields[0]).toBe('sample1.fasta')
    expect(result.records[0].rawFields).toHaveLength(15)
  })

  it('stores header line', () => {
    const result = parseAbricate(SAMPLE_ABRICATE_V098)
    expect(result.header).toContain('GENE')
  })

  it('handles empty input gracefully', () => {
    const result = parseAbricate('#FILE\tGENE\n')
    expect(result.records).toHaveLength(0)
  })
})
