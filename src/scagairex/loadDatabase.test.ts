import { describe, it, expect } from 'vitest'
import { parseDatabase } from './loadDatabase'

const SAMPLE_TSV = `GenusSpecies\tGene\tOccurances\tProgram\tDatabase\tAuto\tDate
Escherichia coli\tblaTEM-1\t500\tabricate\tcard\tauto\t20191028
Escherichia coli\ttet(A)\t200\tabricate\tresfinder\tauto\t20191028
Klebsiella pneumoniae\tblaTEM-1\t300\tabricate\tcard\tauto\t20191028
Klebsiella pneumoniae\tOXA-48\t150\tabricate\tcard\tauto\t20191028
`

describe('parseDatabase', () => {
  it('parses species list', () => {
    const db = parseDatabase(SAMPLE_TSV)
    expect(db.speciesList).toContain('Escherichia coli')
    expect(db.speciesList).toContain('Klebsiella pneumoniae')
    expect(db.speciesList).toHaveLength(2)
  })

  it('species list is sorted', () => {
    const db = parseDatabase(SAMPLE_TSV)
    expect(db.speciesList[0]).toBe('Escherichia coli')
    expect(db.speciesList[1]).toBe('Klebsiella pneumoniae')
  })

  it('maps genes to species', () => {
    const db = parseDatabase(SAMPLE_TSV)
    const ecoliGenes = db.genesBySpecies.get('Escherichia coli')!
    expect(ecoliGenes.has('blaTEM-1')).toBe(true)
    expect(ecoliGenes.has('tet(A)')).toBe(true)
  })

  it('stores occurrences', () => {
    const db = parseDatabase(SAMPLE_TSV)
    const ecoliGenes = db.genesBySpecies.get('Escherichia coli')!
    expect(ecoliGenes.get('blaTEM-1')?.occurrences).toBe(500)
    expect(ecoliGenes.get('tet(A)')?.occurrences).toBe(200)
  })

  it('handles empty input', () => {
    const db = parseDatabase('GenusSpecies\tGene\tOccurances\n')
    expect(db.speciesList).toHaveLength(0)
  })
})
