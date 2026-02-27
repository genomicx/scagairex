import type { FilterResult } from '../scagairex/types'

interface SummaryStatsProps {
  result: FilterResult
  species: string
}

export function SummaryStats({ result, species }: SummaryStatsProps): React.JSX.Element {
  const pctRetained =
    result.inputCount > 0
      ? ((result.filteredCount / result.inputCount) * 100).toFixed(1)
      : '0.0'

  return (
    <section className="summary-stats" aria-label="Filter summary">
      <div className="stats-header">
        <h2>Filter Results</h2>
        <span className="format-tag">{result.format}</span>
      </div>
      {species && (
        <p className="stats-species">Species: <strong>{species}</strong></p>
      )}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{result.inputCount}</div>
          <div className="stat-label">Genes in</div>
        </div>
        <div className="stat-card stat-card--accent">
          <div className="stat-value">{result.filteredCount}</div>
          <div className="stat-label">After filter</div>
        </div>
        <div className="stat-card stat-card--warning">
          <div className="stat-value">{result.removedCount}</div>
          <div className="stat-label">Removed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pctRetained}%</div>
          <div className="stat-label">Retained</div>
        </div>
      </div>
    </section>
  )
}
