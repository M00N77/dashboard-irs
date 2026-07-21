import type { Appeal } from '@entities/appeal/model/types'
import type { FamilyMember } from '@entities/family/model/types'
import type { EducationRecord } from '@entities/education/model/types'
import type { EmploymentRecord } from '@entities/employment/model/types'
import type { HousingRecord } from '@entities/housing/model/types'
import type { Document } from '@entities/document/model/types'
import type { Benefit } from '@entities/benefit/model/types'

export interface PersonSummary {
  id: number
  firstName: string
  lastName: string
  middleName: string
  birthDate: string
  gender: 'male' | 'female'
  status: string
  region: string
  registryCode: string
}

export interface PersonDetails extends PersonSummary {
  // Личные данные
  birthPlace: string
  citizenship: string
  maritalStatus: string
  childrenCount: number
  snils: string
  inn: string
  // Паспорт
  passportSeries: string
  passportNumber: string
  passportIssuedBy: string
  passportIssueDate: string
  passportDivisionCode: string
  // Контакты
  phone: string
  secondaryPhone: string
  email: string
  preferredContact: string
  // Адрес регистрации
  regCity: string
  regStreet: string
  regHouse: string
  regApartment: string
  regPostalCode: string
  actualSameAsReg: boolean
  actualAddress: string
  // Социальный статус
  employmentStatus: string
  averageIncome: number
  disabilityGroup: string
  benefitCategories: string[]
  isPensioner: boolean
  isVeteran: boolean
  isLargeFamily: boolean
  notes: string
  // Связанные таблицы
  family: FamilyMember[]
  education: EducationRecord[]
  employment: EmploymentRecord[]
  housing: HousingRecord[]
  appeals: Appeal[]
  documents: Document[]
  benefits: Benefit[]
}
