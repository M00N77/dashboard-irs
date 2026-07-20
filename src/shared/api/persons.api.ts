import { apiClient } from './client'
import type { PersonSummary, PersonDetails } from '@entities/person/model/types'

export interface GetPersonsParams {
  page: number
  limit: number
  search?: string
  status?: string
  region?: string
  sortBy?: string
  sortOrder?: string
}

export interface GetPersonsResponse {
  items: PersonSummary[]
  total: number
}

export function getPersons(params: GetPersonsParams): Promise<GetPersonsResponse> {
  const query = new URLSearchParams()
  query.set('page', String(params.page))
  query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  if (params.region) query.set('region', params.region)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)

  return apiClient<GetPersonsResponse>(`/api/persons?${query.toString()}`)
}

export function getPersonById(id: string): Promise<PersonDetails> {
  return apiClient<PersonDetails>(`/api/persons/${id}`)
}
