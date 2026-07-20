import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getPersons } from '@shared/api/persons.api'
import type { GetPersonsParams } from '@shared/api/persons.api'

export function usePersonsQuery(params: GetPersonsParams) {
  return useQuery({
    queryKey: ['persons', params.page, params.limit, params.search, params.status, params.region, params.sortBy, params.sortOrder],
    queryFn: () => getPersons(params),
    placeholderData: keepPreviousData,
  })
}
