import { apiClient } from './client'
import type { PersonSummary, PersonDetails } from '@entities/person/model/types'
import type { FamilyMember } from '@entities/family/model/types'
import type { EducationRecord } from '@entities/education/model/types'
import type { Appeal } from '@entities/appeal/model/types'

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

export function updatePerson(id: string, data: Partial<PersonDetails>): Promise<PersonDetails> {
  return apiClient<PersonDetails>(`/api/persons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function addFamilyMember(
  id: string,
  data: {
    relation: FamilyMember['relation']
    firstName: string
    lastName: string
    birthDate: string
  },
): Promise<FamilyMember> {
  return apiClient<FamilyMember>(`/api/persons/${id}/family`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteFamilyMember(id: string, memberId: string): Promise<void> {
  return apiClient<void>(`/api/persons/${id}/family/${memberId}`, {
    method: 'DELETE',
  })
}

export function addEducationRecord(
  id: string,
  data: {
    institution: string
    degree: string
    startYear: number
    endYear: number
  },
): Promise<EducationRecord> {
  return apiClient<EducationRecord>(`/api/persons/${id}/education`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteEducationRecord(id: string, recordId: string): Promise<void> {
  return apiClient<void>(`/api/persons/${id}/education/${recordId}`, {
    method: 'DELETE',
  })
}

export function addAppeal(
  id: string,
  data: {
    source: Appeal['source']
    category: string
    registeredAt: string
    status: Appeal['status']
    responsible: string
    dueDate: string
    resolutionText?: string
  },
): Promise<Appeal> {
  return apiClient<Appeal>(`/api/persons/${id}/appeals`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateAppealStatus(
  id: string,
  appealId: string,
  status: Appeal['status'],
): Promise<Appeal> {
  return apiClient<Appeal>(`/api/persons/${id}/appeals/${appealId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function deleteAppeal(id: string, appealId: string): Promise<void> {
  return apiClient<void>(`/api/persons/${id}/appeals/${appealId}`, {
    method: 'DELETE',
  })
}
