import type { AmrRecord, ParsedInput } from './types'

/**
 * Parse RGI-CARD TSV output.
 *
 * Key column: Best_Hit_ARO — the ARO term name used as the gene identifier.
 *
 * Other relevant columns include Cut_Off, Best_Identities, ARO, etc.
 */
export function parseRgi(text: string): ParsedInput {
  const lines = text.split('\n')
  let headerLine = ''
  let geneColIndex = -1
  const records: AmrRecord[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    if (headerLine === '') {
      headerLine = line
      const cols = line.split('\t').map(c => c.trim().toLowerCase().replace(/ /g, '_'))
      geneColIndex = cols.indexOf('best_hit_aro')
      if (geneColIndex === -1) geneColIndex = 8 // typical position
      continue
    }

    const fields = line.split('\t')
    if (fields.length <= geneColIndex) continue

    const gene = fields[geneColIndex].trim()
    if (!gene) continue

    records.push({ gene, rawFields: fields })
  }

  return { format: 'rgi', header: headerLine, records }
}
