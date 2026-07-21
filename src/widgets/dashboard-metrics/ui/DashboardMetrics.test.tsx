import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardMetrics from './DashboardMetrics'

describe('DashboardMetrics', () => {
  it('показывает сводные показатели', () => {
    render(<DashboardMetrics data={{ totalPersons: 5000, totalAppeals: 120, activeAppeals: 30 }} />)
    expect(screen.getByText('Всего граждан')).toBeInTheDocument()
    expect(screen.getByText('5000')).toBeInTheDocument()
    expect(screen.getByText('Активные обращения')).toBeInTheDocument()
  })
})
