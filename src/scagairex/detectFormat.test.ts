import { describe, it, expect } from 'vitest'
import { detectFormat } from './detectFormat'

describe('detectFormat', () => {
  it('detects abricate format from %COVERAGE', () => {
    expect(detectFormat('#FILE\tSEQUENCE\tSTART\tEND\tSTRAND\tGENE\t%COVERAGE\t%IDENTITY\tDATABASE')).toBe('abricate')
  })

  it('detects abricate format from FILE + GENE', () => {
    expect(detectFormat('FILE\tSEQUENCE\tSTART\tEND\tSTRAND\tGENE\tCOVERAGE_MAP\tGAPS')).toBe('abricate')
  })

  it('detects staramr format', () => {
    expect(detectFormat('Isolate ID\tGene\tPredicted Phenotype\t%Identity\t%Overlap')).toBe('staramr')
  })

  it('detects rgi format', () => {
    expect(detectFormat('ORF_ID\tContig\tStart\tStop\tOrientation\tCut_Off\tPass_Bitscore\tBest_Hit_Bitscore\tBest_Hit_ARO\tBest_Identities')).toBe('rgi')
  })

  it('returns unknown for unrecognized header', () => {
    expect(detectFormat('col1\tcol2\tcol3')).toBe('unknown')
  })

  it('is case-insensitive for rgi', () => {
    expect(detectFormat('orf_id\tbest_hit_aro\tcut_off')).toBe('rgi')
  })
})
