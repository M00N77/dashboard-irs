import { http, HttpResponse, delay } from 'msw'
import type { PersonDetails, PersonSummary } from '@entities/person/model/types'
import type { FamilyMember } from '@entities/family/model/types'
import type { EducationRecord } from '@entities/education/model/types'
import type { Appeal } from '@entities/appeal/model/types'
import type { StatsResponse } from '@shared/api/stats.api'
import { getCachedPersons, getCachedPersonsSync } from '@shared/api/mock-data/cache'

let cachedStats: StatsResponse | null = null

function buildStats(persons: PersonDetails[]): StatsResponse {
  const totalPersons = persons.length
  const male = persons.filter((p) => p.gender === 'male').length
  const female = persons.filter((p) => p.gender === 'female').length

  const now = new Date()
  const ageGroups: Record<string, number> = {}
  for (const p of persons) {
    const birth = new Date(p.birthDate)
    const age = now.getFullYear() - birth.getFullYear()
    const group =
      age < 18 ? 'under 18' : age <= 30 ? '18-30' : age <= 45 ? '30-45' : age <= 60 ? '45-60' : '60+'
    ageGroups[group] = (ageGroups[group] || 0) + 1
  }

  const CATEGORY_KEY_MAP: Record<string, string> = {
    'Обращение по ТКО': 'tko',
    'ЖКХ': 'jkh',
    'Жалоба': 'complaint',
    'Запрос информации': 'info',
    'Иное': 'other',
  }

  let totalAppeals = 0
  let activeAppeals = 0
  const byStatus: Record<string, number> = {}
  const byCategory: Record<string, number> = {}

  for (const p of persons) {
    for (const a of p.appeals) {
      totalAppeals++
      byStatus[a.status] = (byStatus[a.status] || 0) + 1

      const catKey = CATEGORY_KEY_MAP[a.category] || 'other'
      byCategory[catKey] = (byCategory[catKey] || 0) + 1

      if (a.status === 'new' || a.status === 'in-progress') {
        activeAppeals++
      }
    }
  }

  return {
    summary: { totalPersons, totalAppeals, activeAppeals },
    personStats: { genderDistribution: { male, female }, ageGroups },
    appealStats: { byStatus, byCategory },
  }
}

function invalidateStatsCache(): void {
  const cache = getCachedPersonsSync()
  if (cache) {
    cachedStats = buildStats(cache)
  } else {
    cachedStats = null
  }
}

function findPersonIndex(id: number): number | null {
  const cache = getCachedPersonsSync()
  if (!cache) return null
  const idx = cache.findIndex((p) => p.id === id)
  return idx >= 0 ? idx : null
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
    registryCode: details.registryCode,
  }
}

function randomDelay(): Promise<void> {
  return delay(Math.floor(Math.random() * 101) + 50)
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

    const id = parseInt(params.id as string, 10)
    const allPersons = await getCachedPersons()
    const person = allPersons.find((p) => p.id === id)

    if (!person) {
      return HttpResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    return HttpResponse.json(person)
  }),

  http.get('/api/stats', async () => {
    const persons = await getCachedPersons()
    if (!cachedStats) {
      cachedStats = buildStats(persons)
    }
    return HttpResponse.json(cachedStats)
  }),

  // Mutation handlers — these update the in-memory cache but do NOT persist to disk.
  // After invalidateQueries the UI will fetch the updated data from cache.
  // On page reload the original data from persons.json is loaded.

  http.put('/api/persons/:id', async ({ params, request }) => {
    await mutationDelay()
    const body = (await request.json()) as Record<string, unknown>
    const id = parseInt(params.id as string, 10)
    const idx = findPersonIndex(id)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        persons[idx] = { ...persons[idx], ...body } as PersonDetails
      }
    }
    invalidateStatsCache()
    return HttpResponse.json({ id, ...body })
  }),

  http.post('/api/persons/:id/family', async ({ params, request }) => {
    await mutationDelay()
    const body = (await request.json()) as { relation: FamilyMember['relation']; firstName: string; lastName: string; birthDate: string }
    const personId = parseInt(params.id as string, 10)
    const newMember: FamilyMember = { id: Date.now(), personId, ...body }
    const idx = findPersonIndex(personId)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        persons[idx].family.push(newMember)
      }
    }
    return HttpResponse.json(newMember, { status: 201 })
  }),

  http.delete('/api/persons/:id/family/:memberId', async ({ params }) => {
    await mutationDelay()
    const id = parseInt(params.id as string, 10)
    const memberId = parseInt(params.memberId as string, 10)
    const idx = findPersonIndex(id)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        persons[idx].family = persons[idx].family.filter(
          (m: { id: number }) => m.id !== memberId,
        )
      }
    }
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post('/api/persons/:id/education', async ({ params, request }) => {
    await mutationDelay()
    const body = (await request.json()) as { institution: string; degree: string; startYear: number; endYear: number }
    const personId = parseInt(params.id as string, 10)
    const newRecord: EducationRecord = { id: Date.now(), personId, ...body }
    const idx = findPersonIndex(personId)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        persons[idx].education.push(newRecord)
      }
    }
    return HttpResponse.json(newRecord, { status: 201 })
  }),

  http.delete('/api/persons/:id/education/:recordId', async ({ params }) => {
    await mutationDelay()
    const id = parseInt(params.id as string, 10)
    const recordId = parseInt(params.recordId as string, 10)
    const idx = findPersonIndex(id)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        persons[idx].education = persons[idx].education.filter(
          (r: { id: number }) => r.id !== recordId,
        )
      }
    }
    return HttpResponse.json(null, { status: 204 })
  }),

  // Appeal handlers

  http.post('/api/persons/:id/appeals', async ({ params, request }) => {
    await mutationDelay()
    const body = (await request.json()) as Record<string, unknown>
    const personId = parseInt(params.id as string, 10)
    const newAppeal: Appeal = {
      id: Date.now(),
      personId,
      source: body.source as Appeal['source'],
      category: body.category as string,
      registeredAt: body.registeredAt as string,
      status: body.status as Appeal['status'],
      responsible: body.responsible as string,
      dueDate: body.dueDate as string,
      resolutionText: body.resolutionText as string | undefined,
      attachments: [],
    }
    const idx = findPersonIndex(personId)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        persons[idx].appeals.push(newAppeal)
      }
    }
    invalidateStatsCache()
    return HttpResponse.json(newAppeal, { status: 201 })
  }),

  http.patch('/api/persons/:id/appeals/:appealId', async ({ params, request }) => {
    await mutationDelay()
    const body = (await request.json()) as { status: Appeal['status'] }
    const id = parseInt(params.id as string, 10)
    const appealId = parseInt(params.appealId as string, 10)
    const idx = findPersonIndex(id)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        const appeal = persons[idx].appeals.find((a: { id: number }) => a.id === appealId)
        if (appeal) {
          appeal.status = body.status
          invalidateStatsCache()
          return HttpResponse.json(appeal)
        }
        return HttpResponse.json({ error: 'Appeal Not Found' }, { status: 404 })
      }
    }
    return HttpResponse.json({ id: appealId, ...body })
  }),

  http.delete('/api/persons/:id/appeals/:appealId', async ({ params }) => {
    await mutationDelay()
    const id = parseInt(params.id as string, 10)
    const appealId = parseInt(params.appealId as string, 10)
    const idx = findPersonIndex(id)
    if (idx !== null) {
      const persons = getCachedPersonsSync()
      if (persons) {
        persons[idx].appeals = persons[idx].appeals.filter(
          (a: { id: number }) => a.id !== appealId,
        )
      }
    }
    invalidateStatsCache()
    return HttpResponse.json(null, { status: 204 })
  }),
]
