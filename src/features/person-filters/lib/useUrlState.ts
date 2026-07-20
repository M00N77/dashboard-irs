import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const SUPPORTED_KEYS = ['page', 'limit', 'search', 'status', 'region', 'sortBy', 'sortOrder'] as const

type SupportedKey = (typeof SUPPORTED_KEYS)[number]

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const get = useCallback(
    (key: SupportedKey, defaultValue: string): string => {
      return searchParams.get(key) ?? defaultValue
    },
    [searchParams],
  )

  const set = useCallback(
    (key: SupportedKey, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        if (key !== 'page') {
          next.set('page', '1')
        }
        return next
      })
    },
    [setSearchParams],
  )

  return { get, set, searchParams }
}
