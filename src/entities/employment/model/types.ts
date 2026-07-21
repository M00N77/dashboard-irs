export interface EmploymentRecord {
  id: number
  personId: number
  company: string
  position: string
  startDate: string
  endDate: string | null
}
