import { useState, useEffect, useCallback } from 'react'
import type { FilterResult } from '../scagairex/types'
import { exportResults } from '../scagairex/exportResults'

const PAGE_SIZE = 50

interface ResultsTableProps {
  result: FilterResult
}

export function ResultsTable({ result }: ResultsTableProps): React.JSX.Element {
  const [page, setPage] = useState(0)

  // Reset to first page when results change
  useEffect(() => { setPage(0) }, [result])

  const headers = parseHeaders(result.header)
  const geneColIndex = findGeneColumn(headers, result.format)

  const totalPages = Math.max(1, Math.ceil(result.records.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageRecords = result.records.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  const handleExport = useCallback(() => {
    exportResults(result)
  }, [result])

  const handlePrev = useCallback(() => setPage(p => Math.max(0, p - 1)), [])
  const handleNext = useCallback(() => setPage(p => p + 1), [])

  if (result.records.length === 0) {
    return (
      <section className="results">
        <div className="results-header">
          <h2>Filtered Results</h2>
          <button className="export-button" onClick={handleExport} disabled>
            Export TSV
          </button>
        </div>
        <p className="no-results">No genes passed the filter for this species.</p>
      </section>
    )
  }

  return (
    <section className="results">
      <div className="results-header">
        <h2>Filtered Results</h2>
        <div className="results-actions">
          <span className="results-count">{result.filteredCount} records</span>
          <button className="export-button" onClick={handleExport}>
            Export TSV
          </button>
        </div>
      </div>

      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className={i === geneColIndex ? 'gene-col' : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRecords.map((record, ri) => (
              <tr key={ri}>
                {record.rawFields.map((field, fi) => (
                  <td key={fi} className={fi === geneColIndex ? 'gene-col' : undefined}>
                    {field}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={handlePrev} disabled={safePage === 0}>
            ← Prev
          </button>
          <span className="page-info">
            Page {safePage + 1} of {totalPages}
          </span>
          <button className="page-btn" onClick={handleNext} disabled={safePage >= totalPages - 1}>
            Next →
          </button>
        </div>
      )}
    </section>
  )
}

function parseHeaders(headerLine: string): string[] {
  return headerLine.replace(/^#/, '').split('\t')
}

function findGeneColumn(headers: string[], format: string): number {
  switch (format) {
    case 'rgi':
      return headers.findIndex(h => h.trim() === 'Best_Hit_ARO')
    case 'staramr':
      return headers.findIndex(h => h.trim().toLowerCase() === 'gene')
    default: {
      const idx = headers.findIndex(h => h.trim().toUpperCase() === 'GENE')
      return idx === -1 ? 5 : idx
    }
  }
}
