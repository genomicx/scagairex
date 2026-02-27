# ScagaireX

**AMR Gene Species Filter** — a browser-based tool that filters antimicrobial resistance (AMR) gene predictions by bacterial species. It is a TypeScript port of [scagaire](https://github.com/andrewjpage/scagaire) by Andrew Page, running entirely client-side with no server required.

## Live Demo

[https://scagairex.vercel.app](https://scagairex.vercel.app)

## What it does

When you run an AMR prediction tool (Abricate, StarAMR, RGI-CARD) on a genome, you may get many false positives — genes from commensal bacteria that are not relevant to your target species. ScagaireX filters these out by checking each predicted gene against a species-specific database of known AMR genes, removing those not known to occur in the target species.

## Supported Input Formats

| Format | Tool | File |
|--------|------|------|
| Abricate | [Abricate](https://github.com/tseemann/abricate) v0.9.7 / v0.9.8 | Any TSV output |
| StarAMR | [StarAMR](https://github.com/phac-nml/staramr) | `resfinder.tsv` |
| RGI-CARD | [RGI](https://card.mcmaster.ca/analyze/rgi) | TSV output |

Format is auto-detected from the header line. You can also override it manually.

## Database

The species-gene database is sourced from [scagaire's `species_to_genes.tsv`](https://github.com/andrewjpage/scagaire/blob/master/scagaire/data/species_to_genes.tsv), which maps bacterial species to AMR genes observed across public databases.

## Privacy

All processing happens client-side in your browser. No data is uploaded to any server.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Docker

```bash
# Build
docker build -t scagairex .

# Run
docker run -p 8080:80 scagairex
# Browse http://localhost:8080
```

## Citation

If you use ScagaireX in your research, please cite the original scagaire tool:

> Page AJ. scagaire: species-aware AMR gene filtering. https://github.com/andrewjpage/scagaire

## License

GPL-3.0-only

## Author

[Nabil-Fareed Alikhan](https://www.happykhan.com) — Centre for Genomic Pathogen Surveillance, University of Oxford
