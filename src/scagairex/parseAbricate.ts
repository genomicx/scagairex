import type { AmrRecord, ParsedInput } from './types'

/**
 * Parse Abricate TSV output (v0.9.7 and v0.9.8).
 *
 * Header columns (v0.9.8):
 *   #FILE  SEQUENCE  START  END  STRAND  GENE  COVERAGE  COVERAGE_MAP  GAPS  %COVERAGE  %IDENTITY  DATABASE  ACCESSION  PRODUCT  RESISTANCE
 *
 * The GENE column is identified by name (case-insensitive) rather than hardcoded index
 * to handle both versions.
 */
export function parseAbricate(text: string): ParsedInput {
  const lines = text.split('\n')
  let headerLine = ''
  let geneColIndex = -1
  const records: AmrRecord[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    // Header line (may start with '#')
    if (headerLine === '') {
      headerLine = line
      const cols = line.replace(/^#/, '').split('\t').map(c => c.trim().toUpperCase())
      geneColIndex = cols.indexOf('GENE')
      if (geneColIndex === -1) {
        // Fallback: try column 5 (0-indexed) as the typical GENE column
        geneColIndex = 5
      }
      continue
    }

    const fields = line.split('\t')
    if (fields.length <= geneColIndex) continue

    const gene = fields[geneColIndex].trim()
    if (!gene) continue

    records.push({ gene, rawFields: fields })
  }

  return { format: 'abricate', header: headerLine, records }
}
