import type { Appeal } from '@entities/appeal/model/types'
import type { FamilyMember } from '@entities/family/model/types'
import type { EducationRecord } from '@entities/education/model/types'
import type { EmploymentRecord } from '@entities/employment/model/types'
import type { HousingRecord } from '@entities/housing/model/types'

export interface PersonSummary {
  id: string
  firstName: string
  lastName: string
  middleName: string
  birthDate: string
  gender: 'male' | 'female'
  status: string
  region: string
}

export interface PersonDetails extends PersonSummary {
  passportSeries: string
  passportNumber: string
  address: string
  phone: string
  email: string
  family: FamilyMember[]
  education: EducationRecord[]
  employment: EmploymentRecord[]
  housing: HousingRecord[]
  appeals: Appeal[]
}
