import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryStats } from './SummaryStats'
import type { FilterResult } from '../scagairex/types'

const mockResult: FilterResult = {
  inputCount: 10,
  filteredCount: 7,
  removedCount: 3,
  format: 'abricate',
  header: 'FILE\tGENE',
  records: [],
}

describe('SummaryStats', () => {
  it('renders counts correctly', () => {
    render(<SummaryStats result={mockResult} species="Escherichia coli" />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows percentage retained', () => {
    render(<SummaryStats result={mockResult} species="Escherichia coli" />)
    expect(screen.getByText('70.0%')).toBeInTheDocument()
  })

  it('shows format tag', () => {
    render(<SummaryStats result={mockResult} species="Escherichia coli" />)
    expect(screen.getByText('abricate')).toBeInTheDocument()
  })

  it('shows species name', () => {
    render(<SummaryStats result={mockResult} species="Escherichia coli" />)
    expect(screen.getByText('Escherichia coli')).toBeInTheDocument()
  })

  it('handles 0 input count without division error', () => {
    const emptyResult: FilterResult = { ...mockResult, inputCount: 0, filteredCount: 0, removedCount: 0 }
    render(<SummaryStats result={emptyResult} species="test" />)
    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })
})
