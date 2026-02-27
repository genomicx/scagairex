import { useCallback } from 'react'

interface FileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  disabled: boolean
}

export function FileUpload({ file, onFileChange, disabled }: FileUploadProps): React.JSX.Element {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) onFileChange(selected)
    },
    [onFileChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const dropped = e.dataTransfer.files[0]
      if (dropped) onFileChange(dropped)
    },
    [onFileChange],
  )

  return (
    <div
      className="file-upload"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <label className="file-upload-area">
        <input
          type="file"
          accept=".tsv,.txt,.tab"
          onChange={handleChange}
          disabled={disabled}
          aria-label="Upload AMR results file"
        />
        <svg
          className="file-upload-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {file === null ? (
          <>
            <div className="file-upload-label">Drop AMR results file or click to browse</div>
            <div className="file-upload-hint">Abricate, StarAMR, or RGI-CARD TSV output</div>
          </>
        ) : (
          <>
            <div className="file-upload-label">Selected: {file.name}</div>
            <div className="file-upload-hint">
              {(file.size / 1024).toFixed(1)} KB
            </div>
          </>
        )}
      </label>
    </div>
  )
}
