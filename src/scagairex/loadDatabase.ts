import type { SpeciesDatabase, DatabaseEntry } from './types'

/**
 * Fetch and parse species_to_genes.tsv into a SpeciesDatabase.
 * TSV columns: GenusSpecies \t Gene \t Occurances \t Program \t Database \t Auto \t Date
 */
export async function loadDatabase(): Promise<SpeciesDatabase> {
  const response = await fetch('/species_to_genes.tsv')
  if (!response.ok) {
    throw new Error(`Failed to load database: ${response.statusText}`)
  }
  const text = await response.text()
  return parseDatabase(text)
}

export function parseDatabase(text: string): SpeciesDatabase {
  const lines = text.split('\n')
  const genesBySpecies = new Map<string, Map<string, DatabaseEntry>>()

  // skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const fields = line.split('\t')
    if (fields.length < 3) continue

    const species = fields[0].trim()
    const gene = fields[1].trim()
    const occurrences = parseInt(fields[2], 10) || 0
    const program = fields[3]?.trim() ?? ''
    const database = fields[4]?.trim() ?? ''

    if (!species || !gene) continue

    let speciesGenes = genesBySpecies.get(species)
    if (!speciesGenes) {
      speciesGenes = new Map()
      genesBySpecies.set(species, speciesGenes)
    }

    // Keep the entry with highest occurrences if gene appears multiple times
    const existing = speciesGenes.get(gene)
    if (!existing || occurrences > existing.occurrences) {
      speciesGenes.set(gene, { gene, occurrences, program, database })
    }
  }

  const speciesList = Array.from(genesBySpecies.keys()).sort()
  return { speciesList, genesBySpecies }
}
