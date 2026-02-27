export function AboutPage(): React.JSX.Element {
  return (
    <div className="about-page">
      <section>
        <h2>About ScagaireX</h2>
        <p>
          ScagaireX is a browser-based tool for filtering antimicrobial resistance (AMR) gene
          predictions by bacterial species. It takes output from AMR tools — Abricate, StarAMR,
          or RGI-CARD — and removes genes not known to occur in the target species, reducing
          noise from commensal flora and false positives.
        </p>
        <p>
          It is a TypeScript port of{' '}
          <a href="https://github.com/andrewjpage/scagaire" target="_blank" rel="noopener noreferrer">
            scagaire
          </a>{' '}
          by Andrew Page, running entirely client-side in your browser. No WASM required — the
          filtering logic is a pure lookup against a bundled species-gene database.
        </p>
        <div className="privacy-note">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p>
            No data leaves your machine — all processing happens entirely client-side.
            Your AMR results files are never uploaded to any server.
          </p>
        </div>
      </section>

      <section>
        <h2>Supported Input Formats</h2>
        <ul className="format-list">
          <li>
            <strong>Abricate</strong> — TSV output from{' '}
            <a href="https://github.com/tseemann/abricate" target="_blank" rel="noopener noreferrer">
              Abricate
            </a>{' '}
            (v0.9.7 and v0.9.8)
          </li>
          <li>
            <strong>StarAMR</strong> — <code>resfinder.tsv</code> output from{' '}
            <a href="https://github.com/phac-nml/staramr" target="_blank" rel="noopener noreferrer">
              StarAMR
            </a>
          </li>
          <li>
            <strong>RGI-CARD</strong> — TSV output from the{' '}
            <a href="https://card.mcmaster.ca/analyze/rgi" target="_blank" rel="noopener noreferrer">
              Resistance Gene Identifier
            </a>
          </li>
        </ul>
        <p className="format-note">
          Format is auto-detected from the header line. You can also select it manually in the
          Filter Options panel.
        </p>
      </section>

      <section>
        <h2>Database</h2>
        <p>
          Species-gene associations are sourced from the{' '}
          <a href="https://github.com/andrewjpage/scagaire" target="_blank" rel="noopener noreferrer">
            scagaire
          </a>{' '}
          <code>species_to_genes.tsv</code> file, which maps bacterial species to AMR genes
          observed in isolates of that species across public databases.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <p>
          If you use ScagaireX in your research, please cite the original scagaire tool:
        </p>
        <blockquote className="citation">
          Page AJ. scagaire: species-aware AMR gene filtering.{' '}
          <a href="https://github.com/andrewjpage/scagaire" target="_blank" rel="noopener noreferrer">
            https://github.com/andrewjpage/scagaire
          </a>
        </blockquote>
      </section>

      <section>
        <h2>About the Author</h2>
        <h3>Nabil-Fareed Alikhan</h3>
        <p className="about-role">
          Senior Bioinformatician, Centre for Genomic Pathogen Surveillance,
          University of Oxford
        </p>
        <p>
          Bioinformatics researcher and software developer specialising in microbial genomics.
          I build widely used open-source tools, publish peer-reviewed research, and co-host
          the MicroBinfie podcast.
        </p>
        <div className="about-links">
          <a href="https://www.happykhan.com" target="_blank" rel="noopener noreferrer">
            happykhan.com
          </a>
          <a href="https://orcid.org/0000-0002-1243-0767" target="_blank" rel="noopener noreferrer">
            ORCID: 0000-0002-1243-0767
          </a>
          <a href="mailto:nabil@happykhan.com">nabil@happykhan.com</a>
          <a href="https://twitter.com/happy_khan" target="_blank" rel="noopener noreferrer">
            Twitter: @happy_khan
          </a>
          <a href="https://mstdn.science/@happykhan" target="_blank" rel="noopener noreferrer">
            Mastodon: @happykhan@mstdn.science
          </a>
        </div>
      </section>
    </div>
  )
}
