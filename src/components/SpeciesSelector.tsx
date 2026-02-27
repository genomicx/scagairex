import { useCallback, useId } from 'react'

interface SpeciesSelectorProps {
  speciesList: string[]
  value: string
  onChange: (species: string) => void
  disabled: boolean
}

export function SpeciesSelector({ speciesList, value, onChange, disabled }: SpeciesSelectorProps): React.JSX.Element {
  const listId = useId()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <div className="species-selector">
      <label className="field-label" htmlFor={`species-input-${listId}`}>
        Target Species
        {speciesList.length > 0 && (
          <span className="species-count">{speciesList.length} species in database</span>
        )}
      </label>
      <input
        id={`species-input-${listId}`}
        className="species-input"
        type="text"
        list={listId}
        value={value}
        onChange={handleChange}
        placeholder="e.g. Escherichia coli"
        disabled={disabled}
        aria-label="Select target bacterial species"
        autoComplete="off"
      />
      <datalist id={listId}>
        {speciesList.map(s => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  )
}
