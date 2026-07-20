export { apiClient } from './client'
export {
  getPersons,
  getPersonById,
  updatePerson,
  addFamilyMember,
  deleteFamilyMember,
  addEducationRecord,
  deleteEducationRecord,
  addAppeal,
  updateAppealStatus,
  deleteAppeal,
} from './persons.api'
export type { GetPersonsParams, GetPersonsResponse } from './persons.api'
export { getStats } from './stats.api'
export type { StatsResponse } from './stats.api'
