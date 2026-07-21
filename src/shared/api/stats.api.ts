import { apiClient } from './client'

export interface StatsSummary {
  totalPersons: number
  totalAppeals: number
  activeAppeals: number
}

export interface PersonStats {
  genderDistribution: { male: number; female: number }
  ageGroups: Record<string, number>
}

export interface AppealStats {
  byStatus: Record<string, number>
  byCategory: Record<string, number>
}

export interface StatsResponse {
  summary: StatsSummary
  personStats: PersonStats
  appealStats: AppealStats
}

export function getStats(): Promise<StatsResponse> {
  return apiClient<StatsResponse>('/api/stats')
}
