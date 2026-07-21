import { describe, it, expect } from 'vitest'
import { buildStats } from './handlers'
import type { PersonDetails } from '@entities/person/model/types'

function person(partial: Partial<PersonDetails>): PersonDetails {
  return { gender: 'male', birthDate: '1990-01-01', appeals: [], ...partial } as unknown as PersonDetails
}

describe('buildStats', () => {
  it('группирует категории по фактическому значению, без схлопывания в other', () => {
    const persons = [
      person({ appeals: [{ category: 'ЖКХ', status: 'new' }, { category: 'Жалоба', status: 'resolved' }] as never }),
      person({ gender: 'female', appeals: [{ category: 'Обращение по ТКО', status: 'in-progress' }] as never }),
    ]
    const stats = buildStats(persons)
    expect(stats.appealStats.byCategory['ЖКХ']).toBe(1)
    expect(stats.appealStats.byCategory['Жалоба']).toBe(1)
    expect(stats.appealStats.byCategory['Обращение по ТКО']).toBe(1)
    expect(stats.appealStats.byCategory['other']).toBeUndefined()
  })

  it('считает активные обращения (new + in-progress)', () => {
    const persons = [
      person({ appeals: [{ category: 'ЖКХ', status: 'new' }, { category: 'ЖКХ', status: 'resolved' }] as never }),
      person({ appeals: [{ category: 'ЖКХ', status: 'in-progress' }] as never }),
    ]
    const stats = buildStats(persons)
    expect(stats.summary.totalAppeals).toBe(3)
    expect(stats.summary.activeAppeals).toBe(2)
  })

  it('считает распределение по полу', () => {
    const stats = buildStats([person({}), person({ gender: 'female' })])
    expect(stats.personStats.genderDistribution).toEqual({ male: 1, female: 1 })
  })
})
