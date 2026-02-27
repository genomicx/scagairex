import type { SpeciesDatabase, FilterResult, ParsedInput } from './types'

/**
 * Filter AMR records to only those genes known for the given species.
 *
 * @param parsed - Parsed input with records
 * @param db - Loaded species database
 * @param species - Target species name (must match db key exactly)
 * @param minOccurrences - Minimum occurrence count to include a gene (0 = all)
 */
export function filterResults(
  parsed: ParsedInput,
  db: SpeciesDatabase,
  species: string,
  minOccurrences: number,
): FilterResult {
  const speciesGenes = db.genesBySpecies.get(species)

  const validGenes = new Set<string>()
  if (speciesGenes) {
    for (const [geneName, entry] of speciesGenes) {
      if (entry.occurrences >= minOccurrences) {
        validGenes.add(geneName)
      }
    }
  }

  const filtered = parsed.records.filter(r => validGenes.has(r.gene))

  return {
    inputCount: parsed.records.length,
    filteredCount: filtered.length,
    removedCount: parsed.records.length - filtered.length,
    records: filtered,
    header: parsed.header,
    format: parsed.format,
  }
}
