import type { AmrRecord, ParsedInput } from './types'

/**
 * Parse StarAMR resfinder.tsv output.
 *
 * Header columns:
 *   Isolate ID  Gene  Predicted Phenotype  %Identity  %Overlap  HSP Length/Total Length  Contig  Start  End  Accession
 *
 * The Gene column is at index 1 but identified by name for robustness.
 */
export function parseStaramr(text: string): ParsedInput {
  const lines = text.split('\n')
  let headerLine = ''
  let geneColIndex = -1
  const records: AmrRecord[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    if (headerLine === '') {
      headerLine = line
      const cols = line.split('\t').map(c => c.trim().toLowerCase())
      geneColIndex = cols.indexOf('gene')
      if (geneColIndex === -1) geneColIndex = 1
      continue
    }

    const fields = line.split('\t')
    if (fields.length <= geneColIndex) continue

    const gene = fields[geneColIndex].trim()
    if (!gene) continue

    records.push({ gene, rawFields: fields })
  }

  return { format: 'staramr', header: headerLine, records }
}
