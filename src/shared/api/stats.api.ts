import { apiClient } from './client'

export interface StatsResponse {
  totalPersons: number
  male: number
  female: number
  employed: number
  unemployed: number
  byRegion: Record<string, number>
  byAgeGroup: Record<string, number>
}

export function getStats(): Promise<StatsResponse> {
  return apiClient<StatsResponse>('/api/stats')
}
