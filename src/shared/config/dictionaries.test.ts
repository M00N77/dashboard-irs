import { describe, it, expect } from 'vitest'
import { toOptions, APPEAL_STATUS_LABELS } from './dictionaries'

describe('toOptions', () => {
  it('преобразует карту подписей в массив value/label', () => {
    const opts = toOptions(APPEAL_STATUS_LABELS)
    expect(opts).toContainEqual({ value: 'new', label: 'Новое' })
    expect(opts.length).toBe(Object.keys(APPEAL_STATUS_LABELS).length)
  })
})
