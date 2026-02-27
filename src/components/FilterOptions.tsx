import type { FilterOptions, InputFormat } from '../scagairex/types'

interface FilterOptionsProps {
  options: FilterOptions
  onChange: (opts: FilterOptions) => void
  disabled: boolean
  detectedFormat: InputFormat | null
}

export function FilterOptionsPanel({ options, onChange, disabled, detectedFormat }: FilterOptionsProps): React.JSX.Element {
  return (
    <div className="filter-options">
      <div className="field-group">
        <label className="field-label" htmlFor="min-occurrences">
          Min. occurrences in database
        </label>
        <input
          id="min-occurrences"
          type="number"
          className="number-input"
          min={0}
          value={options.minOccurrences}
          onChange={e =>
            onChange({ ...options, minOccurrences: Math.max(0, parseInt(e.target.value, 10) || 0) })
          }
          disabled={disabled}
          aria-label="Minimum gene occurrence count"
        />
        <span className="field-hint">
          Only include genes seen in ≥ this many isolates (0 = all)
        </span>
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="format-override">
          Input format
          {detectedFormat && detectedFormat !== 'unknown' && (
            <span className="format-badge">Auto-detected: {detectedFormat}</span>
          )}
        </label>
        <select
          id="format-override"
          className="select-input"
          value={options.formatOverride}
          onChange={e =>
            onChange({
              ...options,
              formatOverride: e.target.value as FilterOptions['formatOverride'],
            })
          }
          disabled={disabled}
        >
          <option value="auto">Auto-detect</option>
          <option value="abricate">Abricate</option>
          <option value="staramr">StarAMR</option>
          <option value="rgi">RGI-CARD</option>
        </select>
      </div>
    </div>
  )
}
