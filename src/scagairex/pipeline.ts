import type { FilterResult, FilterOptions, InputFormat, ParsedInput, SpeciesDatabase } from './types'
import { detectFormat } from './detectFormat'
import { parseAbricate } from './parseAbricate'
import { parseStaramr } from './parseStaramr'
import { parseRgi } from './parseRgi'
import { filterResults } from './filterResults'

function parseByFormat(format: InputFormat, text: string): ParsedInput {
  switch (format) {
    case 'abricate': return parseAbricate(text)
    case 'staramr':  return parseStaramr(text)
    case 'rgi':      return parseRgi(text)
    case 'unknown':
      throw new Error('Could not detect input format. Please select a format manually.')
  }
}

/**
 * Run the full scagairex filter pipeline on a single file.
 */
export async function runScagairex(
  file: File,
  db: SpeciesDatabase,
  species: string,
  options: FilterOptions,
  onLog: (msg: string) => void,
): Promise<FilterResult> {
  onLog(`[Scagairex] Reading ${file.name}...`)
  const text = await file.text()

  const headerLine = text.slice(0, text.indexOf('\n')).trim()
  const format = options.formatOverride !== 'auto' ? options.formatOverride : detectFormat(headerLine)
  onLog(`[Scagairex] Detected format: ${format}`)

  const parsed = parseByFormat(format, text)
  onLog(`[Scagairex] Parsed ${parsed.records.length} records`)

  const result = filterResults(parsed, db, species, options.minOccurrences)
  onLog(
    `[Scagairex] Filtered: ${result.filteredCount} kept, ${result.removedCount} removed from ${result.inputCount} input records`,
  )

  return result
}
