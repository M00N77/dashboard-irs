import type { PersonDetails } from '@entities/person/model/types'

let personsCache: PersonDetails[] | null = null
let loadPromise: Promise<PersonDetails[]> | null = null

export function getCachedPersons(): Promise<PersonDetails[]> {
  if (personsCache) return Promise.resolve(personsCache)
  if (loadPromise) return loadPromise

  loadPromise = fetch('/mock-data/persons.json')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load mock data')
      return res.json() as Promise<PersonDetails[]>
    })
    .then((data) => {
      personsCache = data
      return data
    })

  return loadPromise
}

export function getCachedPersonsSync(): PersonDetails[] | null {
  return personsCache
}

export function isDataLoaded(): boolean {
  return personsCache !== null
}
