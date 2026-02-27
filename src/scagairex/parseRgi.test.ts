import { describe, it, expect } from 'vitest'
import { parseRgi } from './parseRgi'

const SAMPLE_RGI = `ORF_ID\tContig\tStart\tStop\tOrientation\tCut_Off\tPass_Bitscore\tBest_Hit_Bitscore\tBest_Hit_ARO\tBest_Identities\tARO\tModel_type
SRR12345_1|orf001\tcontig1\t100\t900\t+\tStrict\t300\t450\ttet(A)\t99.50\t3000796\thomolog model
SRR12345_1|orf002\tcontig2\t200\t1000\t+\tPerfect\t500\t600\tblaTEM-1\t100.00\t3000237\thomolog model`

describe('parseRgi', () => {
  it('parses header and records', () => {
    const result = parseRgi(SAMPLE_RGI)
    expect(result.format).toBe('rgi')
    expect(result.records).toHaveLength(2)
  })

  it('extracts gene names from Best_Hit_ARO', () => {
    const result = parseRgi(SAMPLE_RGI)
    expect(result.records[0].gene).toBe('tet(A)')
    expect(result.records[1].gene).toBe('blaTEM-1')
  })

  it('preserves raw fields', () => {
    const result = parseRgi(SAMPLE_RGI)
    expect(result.records[0].rawFields[0]).toBe('SRR12345_1|orf001')
  })

  it('handles empty input', () => {
    const result = parseRgi('ORF_ID\tBest_Hit_ARO\n')
    expect(result.records).toHaveLength(0)
  })
})
