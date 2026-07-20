import { useQuery } from '@tanstack/react-query'
import { getPersonById } from '@shared/api/persons.api'

export function usePersonQuery(id: string) {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => getPersonById(id),
    enabled: !!id,
  })
}
