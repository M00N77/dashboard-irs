import { http, HttpResponse, delay } from 'msw'
import type { PersonDetails, PersonSummary } from '@entities/person/model/types'

let personsCache: PersonDetails[] | null = null
let loadPromise: Promise<PersonDetails[]> | null = null

async function getCachedPersons(): Promise<PersonDetails[]> {
  if (personsCache) return personsCache
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

function toPersonSummary(details: PersonDetails): PersonSummary {
  return {
    id: details.id,
    firstName: details.firstName,
    lastName: details.lastName,
    middleName: details.middleName,
    birthDate: details.birthDate,
    gender: details.gender,
    status: details.status,
    region: details.region,
  }
}

function randomDelay(): Promise<void> {
  return delay(Math.floor(Math.random() * 701) + 100)
}

const mutationDelay = () => delay(400)

export const handlers = [
  http.get('/api/persons', async ({ request }) => {
    if (Math.random() < 0.05) {
      await randomDelay()
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    await randomDelay()

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '20', 10)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const status = url.searchParams.get('status') || ''
    const region = url.searchParams.get('region') || ''
    const sortBy = url.searchParams.get('sortBy') || ''
    const sortOrder = url.searchParams.get('sortOrder') || ''

    const allPersons = await getCachedPersons()
    let filtered = [...allPersons]

    if (search) {
      filtered = filtered.filter((p) =>
        `${p.firstName} ${p.lastName} ${p.middleName}`.toLowerCase().includes(search),
      )
    }

    if (status) {
      filtered = filtered.filter((p) => p.status === status)
    }

    if (region) {
      filtered = filtered.filter((p) => p.region === region)
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = String((a as unknown as Record<string, unknown>)[sortBy] ?? '')
        const bVal = String((b as unknown as Record<string, unknown>)[sortBy] ?? '')
        const cmp = aVal.localeCompare(bVal, 'ru')
        return sortOrder === 'desc' ? -cmp : cmp
      })
    }

    const total = filtered.length
    const start = (page - 1) * limit
    const items = filtered.slice(start, start + limit).map(toPersonSummary)

    return HttpResponse.json({ items, total })
  }),

  http.get('/api/persons/:id', async ({ params }) => {
    await randomDelay()

    const { id } = params
    const allPersons = await getCachedPersons()
    const person = allPersons.find((p) => p.id === id)

    if (!person) {
      return HttpResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    return HttpResponse.json(person)
  }),

  http.get('/api/stats', async () => {
    await randomDelay()

    const allPersons = await getCachedPersons()
    const totalPersons = allPersons.length
    const male = allPersons.filter((p) => p.gender === 'male').length
    const female = allPersons.filter((p) => p.gender === 'female').length
    const employed = allPersons.filter((p) =>
      p.employment.some((e) => e.endDate === null),
    ).length
    const unemployed = totalPersons - employed

    const byRegion: Record<string, number> = {}
    for (const p of allPersons) {
      byRegion[p.region] = (byRegion[p.region] || 0) + 1
    }

    const byAgeGroup: Record<string, number> = {}
    const now = new Date()
    for (const p of allPersons) {
      const birth = new Date(p.birthDate)
      const age = now.getFullYear() - birth.getFullYear()
      const group =
        age < 18 ? 'under 18' : age <= 30 ? '18-30' : age <= 45 ? '30-45' : age <= 60 ? '45-60' : '60+'
      byAgeGroup[group] = (byAgeGroup[group] || 0) + 1
    }

    return HttpResponse.json({
      totalPersons,
      male,
      female,
      employed,
      unemployed,
      byRegion,
      byAgeGroup,
    })
  }),

  // Mutation handlers — these return the sent data but do NOT persist to disk.
  // After invalidateQueries the UI will fetch old data from the in-memory cache.
  // This is expected behavior for the mock environment.

  http.put('/api/persons/:id', async ({ params, request }) => {
    await mutationDelay()
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ id: params.id, ...body })
  }),

  http.post('/api/persons/:id/family', async ({ request }) => {
    await mutationDelay()
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      { id: crypto.randomUUID(), personId: '', ...body },
      { status: 201 },
    )
  }),

  http.delete('/api/persons/:id/family/:memberId', async () => {
    await mutationDelay()
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post('/api/persons/:id/education', async ({ request }) => {
    await mutationDelay()
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json(
      { id: crypto.randomUUID(), personId: '', ...body },
      { status: 201 },
    )
  }),

  http.delete('/api/persons/:id/education/:recordId', async () => {
    await mutationDelay()
    return HttpResponse.json(null, { status: 204 })
  }),
]
