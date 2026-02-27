import type { InputFormat } from './types'

/**
 * Auto-detect input format from the header line of a TSV file.
 *
 * - Abricate: contains '%COVERAGE' or 'GENE' (v0.9.7/v0.9.8)
 * - StarAMR:  contains 'Predicted Phenotype'
 * - RGI-CARD: contains 'Best_Hit_ARO'
 */
export function detectFormat(headerLine: string): InputFormat {
  const h = headerLine.toUpperCase()

  if (h.includes('BEST_HIT_ARO')) return 'rgi'
  if (h.includes('PREDICTED PHENOTYPE') || h.includes('PREDICTED_PHENOTYPE')) return 'staramr'
  if (h.includes('%COVERAGE') || h.includes('%IDENTITY') || (h.includes('FILE') && h.includes('GENE'))) {
    return 'abricate'
  }
  return 'unknown'
}
