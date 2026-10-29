import { useState, useEffect, useCallback } from 'react'
import { FileUpload } from './components/FileUpload'
import { LogConsole } from './components/LogConsole'
import { AboutPage } from './components/AboutPage'
import { SpeciesSelector } from './components/SpeciesSelector'
import { FilterOptionsPanel } from './components/FilterOptions'
import { SummaryStats } from './components/SummaryStats'
import { ResultsTable } from './components/ResultsTable'
import { loadDatabase } from './scagairex/loadDatabase'
import { detectFormat } from './scagairex/detectFormat'
import { runScagairex } from './scagairex/pipeline'
import type { FilterResult, FilterOptions, InputFormat, SpeciesDatabase } from './scagairex/types'
import { DEFAULT_FILTER_OPTIONS } from './scagairex/types'
import './App.css'

type Theme = 'light' | 'dark'
type View = 'analysis' | 'about'

function App(): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null)
  const [species, setSpecies] = useState('')
  const [options, setOptions] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [logLines, setLogLines] = useState<string[]>([])
  const [result, setResult] = useState<FilterResult | null>(null)
  const [db, setDb] = useState<SpeciesDatabase | null>(null)
  const [dbLoading, setDbLoading] = useState(true)
  const [dbError, setDbError] = useState('')
  const [detectedFormat, setDetectedFormat] = useState<InputFormat | null>(null)

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('gx-theme') as Theme) || 'dark'
  })
  const [currentView, setCurrentView] = useState<View>('analysis')

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('gx-theme', theme)
  }, [theme])

  // Load database on mount
  useEffect(() => {
    loadDatabase()
      .then(loaded => {
        setDb(loaded)
        setDbLoading(false)
        setLogLines(prev => [...prev, `[DB] Loaded ${loaded.speciesList.length} species`])
      })
      .catch(err => {
        setDbError(err instanceof Error ? err.message : String(err))
        setDbLoading(false)
      })
  }, [])

  // Auto-detect format when file changes
  useEffect(() => {
    if (!file) {
      setDetectedFormat(null)
      return
    }
    let cancelled = false
    file.slice(0, 2048).text().then(text => {
      if (!cancelled) {
        const firstLine = text.slice(0, text.indexOf('\n')).trim()
        setDetectedFormat(detectFormat(firstLine))
      }
    })
    return () => { cancelled = true }
  }, [file])

  const handleRun = useCallback(async () => {
    if (!file || !db || !species.trim()) return

    setRunning(true)
    setError('')
    setResult(null)
    setLogLines([])

    try {
      const res = await runScagairex(file, db, species.trim(), options, msg =>
        setLogLines(prev => [...prev, msg]),
      )
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setRunning(false)
    }
  }, [file, db, species, options])

  const canRun = file !== null && db !== null && species.trim() !== '' && !running && !dbLoading

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1>ScagaireX</h1>
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '\u263E' : '\u2600'}
          </button>
        </div>
        <p className="subtitle">AMR Gene Species Filter</p>
        <nav className="tab-bar" role="tablist" aria-label="Main navigation">
          <button
            role="tab"
            aria-selected={currentView === 'analysis'}
            className={`tab ${currentView === 'analysis' ? 'tab-active' : ''}`}
            onClick={() => setCurrentView('analysis')}
          >
            Analysis
          </button>
          <button
            role="tab"
            aria-selected={currentView === 'about'}
            className={`tab ${currentView === 'about' ? 'tab-active' : ''}`}
            onClick={() => setCurrentView('about')}
          >
            About
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'analysis' ? (
          <>
            {dbLoading && (
              <div className="db-loading" aria-live="polite">
                Loading species database…
              </div>
            )}
            {dbError && (
              <section className="error" role="alert">
                <p>Database error: {dbError}</p>
              </section>
            )}

            <div className="controls-grid">
              <FileUpload file={file} onFileChange={setFile} disabled={running} />
              <SpeciesSelector
                speciesList={db?.speciesList ?? []}
                value={species}
                onChange={setSpecies}
                disabled={running || dbLoading}
              />
              <FilterOptionsPanel
                options={options}
                onChange={setOptions}
                disabled={running}
                detectedFormat={detectedFormat}
              />
              <button className="run-button" onClick={handleRun} disabled={!canRun}>
                {running ? 'Filtering…' : 'Filter Genes'}
              </button>
            </div>

            {error && (
              <section className="error" role="alert">
                <p>{error}</p>
              </section>
            )}

            {result !== null && (
              <>
                <SummaryStats result={result} species={species} />
                <ResultsTable result={result} />
              </>
            )}

            {logLines.length > 0 && <LogConsole lines={logLines} />}
          </>
        ) : (
          <AboutPage />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <span>GenomicX &mdash; open-source bioinformatics for the browser</span>
          <div className="footer-links">
            <a href="https://github.com/genomicx" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://genomicx.org/about" target="_blank" rel="noopener noreferrer">Mission</a>
            <a href="https://www.happykhan.com/" target="_blank" rel="noopener noreferrer">Nabil-Fareed Alikhan</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
