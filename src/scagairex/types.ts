export type InputFormat = 'abricate' | 'staramr' | 'rgi' | 'unknown'

export interface AmrRecord {
  gene: string        // normalized gene name for lookup
  rawFields: string[] // original TSV fields for export
}

export interface ParsedInput {
  format: InputFormat
  header: string      // original header line for export
  records: AmrRecord[]
}

export interface DatabaseEntry {
  gene: string
  occurrences: number
  program: string
  database: string
}

export interface SpeciesDatabase {
  speciesList: string[]
  genesBySpecies: Map<string, Map<string, DatabaseEntry>>
}

export interface FilterOptions {
  minOccurrences: number
  formatOverride: InputFormat | 'auto'
}

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  minOccurrences: 0,
  formatOverride: 'auto',
}

export interface FilterResult {
  inputCount: number
  filteredCount: number
  removedCount: number
  records: AmrRecord[]
  header: string
  format: InputFormat
}
