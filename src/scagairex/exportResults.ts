import { saveAs } from 'file-saver'
import type { FilterResult } from './types'

/**
 * Build TSV string from filtered results (header + data rows).
 */
export function buildTsv(result: FilterResult): string {
  const lines: string[] = [result.header]
  for (const record of result.records) {
    lines.push(record.rawFields.join('\t'))
  }
  return lines.join('\n')
}

/**
 * Reconstruct the original-format TSV from filtered results and trigger download.
 */
export function exportResults(result: FilterResult, filename?: string): void {
  const tsv = buildTsv(result)
  const blob = new Blob([tsv], { type: 'text/tab-separated-values' })
  saveAs(blob, filename ?? `scagairex_filtered_${result.format}.tsv`)
}
