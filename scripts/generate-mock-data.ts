import { fakerRU as faker } from '@faker-js/faker'
import { REGIONS, APPEAL_CATEGORIES, APPEAL_SOURCES, APPEAL_STATUSES, PERSON_STATUSES, FAMILY_RELATIONS, HOUSING_TYPES, OWNERSHIP_TYPES, EDUCATION_DEGREES, GENDERS } from '../src/shared/config/dictionaries'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { PersonDetails } from '../src/entities/person/model/types'
import type { Appeal } from '../src/entities/appeal/model/types'
import type { FamilyMember } from '../src/entities/family/model/types'
import type { EducationRecord } from '../src/entities/education/model/types'
import type { EmploymentRecord } from '../src/entities/employment/model/types'
import type { HousingRecord } from '../src/entities/housing/model/types'
import type { Document } from '../src/entities/document/model/types'
import type { Benefit } from '../src/entities/benefit/model/types'
import {
  CITIZENSHIPS, MARITAL_STATUSES, CONTACT_CHANNELS, EMPLOYMENT_STATUSES,
  DISABILITY_GROUPS, BENEFIT_CATEGORIES, DOCUMENT_TYPES, BENEFIT_KINDS, BENEFIT_STATUSES,
} from '../src/shared/config/dictionaries'

faker.seed(42)

const COUNT = 5000

let nextPersonId = 1000
let nextSubId = 1

const INSTITUTIONS = [
  'МГУ им. М.В. Ломоносова', 'СПбГУ', 'МГТУ им. Н.Э. Баумана', 'НИУ ВШЭ',
  'МФТИ', 'Казанский федеральный университет', 'УрФУ им. Б.Н. Ельцина',
  'Новосибирский государственный университет', 'РАНХиГС', 'РУДН',
  'СПбПУ Петра Великого', 'Томский государственный университет',
]

function generateFamilyMember(personId: number): FamilyMember {
  const gender = faker.helpers.arrayElement([...GENDERS]) as 'male' | 'female'
  return {
    id: nextSubId++,
    personId,
    relation: faker.helpers.arrayElement([...FAMILY_RELATIONS]),
    firstName: faker.person.firstName(gender),
    lastName: faker.person.lastName(gender),
    birthDate: faker.date.birthdate({ min: 1, max: 80, mode: 'age' }).toISOString().split('T')[0],
  }
}

function generateEducationRecord(personId: number): EducationRecord {
  const startYear = faker.number.int({ min: 2000, max: 2020 })
  return {
    id: nextSubId++,
    personId,
    institution: faker.helpers.arrayElement(INSTITUTIONS),
    degree: faker.helpers.arrayElement([...EDUCATION_DEGREES]),
    startYear,
    endYear: startYear + faker.number.int({ min: 2, max: 6 }),
  }
}

function generateEmploymentRecord(personId: number): EmploymentRecord {
  const startDate = faker.date.past({ years: 20 }).toISOString().split('T')[0]
  const hasEndDate = faker.datatype.boolean(0.4)
  return {
    id: nextSubId++,
    personId,
    company: faker.company.name(),
    position: faker.person.jobTitle(),
    startDate,
    endDate: hasEndDate ? faker.date.between({ from: startDate, to: new Date() }).toISOString().split('T')[0] : null,
  }
}

function generateHousingRecord(personId: number): HousingRecord {
  return {
    id: nextSubId++,
    personId,
    address: faker.location.streetAddress(true),
    type: faker.helpers.arrayElement([...HOUSING_TYPES]),
    area: faker.number.float({ min: 20, max: 200, fractionDigits: 1 }),
    ownershipType: faker.helpers.arrayElement([...OWNERSHIP_TYPES]),
  }
}

function generateAppeal(personId: number): Appeal {
  const registeredAt = faker.date.past({ years: 2 })
  const dueDate = new Date(registeredAt)
  dueDate.setDate(dueDate.getDate() + faker.number.int({ min: 7, max: 60 }))
  return {
    id: nextSubId++,
    personId,
    source: faker.helpers.arrayElement([...APPEAL_SOURCES]) as Appeal['source'],
    category: faker.helpers.arrayElement([...APPEAL_CATEGORIES]),
    registeredAt: registeredAt.toISOString().split('T')[0],
    status: faker.helpers.arrayElement([...APPEAL_STATUSES]) as Appeal['status'],
    responsible: faker.person.fullName(),
    dueDate: dueDate.toISOString().split('T')[0],
    resolutionText: faker.datatype.boolean(0.5) ? faker.lorem.sentence() : undefined,
    attachments: Array.from(
      { length: faker.number.int({ min: 0, max: 3 }) },
      () => faker.system.fileName(),
    ),
  }
}

function generateDocument(personId: number): Document {
  return {
    id: nextSubId++,
    personId,
    type: faker.helpers.arrayElement(DOCUMENT_TYPES),
    series: faker.string.numeric(4),
    number: faker.string.numeric(6),
    issuedBy: 'УФМС России по ' + faker.helpers.arrayElement(REGIONS),
    issueDate: faker.date.past({ years: 15 }).toISOString().split('T')[0],
    expiryDate: faker.datatype.boolean(0.5) ? faker.date.future({ years: 8 }).toISOString().split('T')[0] : '',
  }
}

function generateBenefit(personId: number): Benefit {
  return {
    id: nextSubId++,
    personId,
    kind: faker.helpers.arrayElement(BENEFIT_KINDS),
    basis: faker.helpers.arrayElement(['Заявление гражданина', 'Автоматическое назначение', 'Решение комиссии']),
    assignedDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
    status: faker.helpers.arrayElement(BENEFIT_STATUSES),
    amount: faker.number.int({ min: 500, max: 25000 }),
  }
}

function generatePerson(): PersonDetails {
  const id = nextPersonId++
  const gender = faker.helpers.arrayElement(GENDERS) as 'male' | 'female'
  const firstName = faker.person.firstName(gender)
  const lastName = faker.person.lastName(gender)
  const middleName = faker.person.middleName(gender)
  const birthDate = faker.date.birthdate({ min: 18, max: 90, mode: 'age' }).toISOString().split('T')[0]
  const sameAddr = faker.datatype.boolean(0.7)

  return {
    id,
    firstName,
    lastName,
    middleName,
    birthDate,
    gender,
    status: faker.helpers.arrayElement(PERSON_STATUSES),
    region: faker.helpers.arrayElement(REGIONS),
    registryCode: `REG-2026-${id.toString().padStart(5, '0')}`,
    birthPlace: faker.location.city(),
    citizenship: faker.helpers.arrayElement(CITIZENSHIPS),
    maritalStatus: faker.helpers.arrayElement(MARITAL_STATUSES),
    childrenCount: faker.number.int({ min: 0, max: 5 }),
    snils: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(3)} ${faker.string.numeric(2)}`,
    inn: faker.string.numeric(12),
    passportSeries: faker.string.numeric(4),
    passportNumber: faker.string.numeric(6),
    passportIssuedBy: 'ОУФМС России по ' + faker.helpers.arrayElement(REGIONS),
    passportIssueDate: faker.date.past({ years: 20 }).toISOString().split('T')[0],
    passportDivisionCode: `${faker.string.numeric(3)}-${faker.string.numeric(3)}`,
    phone: faker.phone.number(),
    secondaryPhone: faker.datatype.boolean(0.4) ? faker.phone.number() : '',
    email: faker.internet.email().toLowerCase(),
    preferredContact: faker.helpers.arrayElement(CONTACT_CHANNELS),
    regCity: faker.location.city(),
    regStreet: faker.location.street(),
    regHouse: String(faker.number.int({ min: 1, max: 200 })),
    regApartment: String(faker.number.int({ min: 1, max: 400 })),
    regPostalCode: faker.string.numeric(6),
    actualSameAsReg: sameAddr,
    actualAddress: sameAddr ? '' : faker.location.streetAddress(true),
    employmentStatus: faker.helpers.arrayElement(EMPLOYMENT_STATUSES),
    averageIncome: faker.number.int({ min: 0, max: 300000 }),
    disabilityGroup: faker.helpers.arrayElement(DISABILITY_GROUPS),
    benefitCategories: faker.helpers.arrayElements(BENEFIT_CATEGORIES, { min: 0, max: 3 }),
    isPensioner: faker.datatype.boolean(0.25),
    isVeteran: faker.datatype.boolean(0.1),
    isLargeFamily: faker.datatype.boolean(0.15),
    notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : '',
    family: Array.from({ length: faker.number.int({ min: 0, max: 4 }) }, () => generateFamilyMember(id)),
    education: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => generateEducationRecord(id)),
    employment: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => generateEmploymentRecord(id)),
    housing: [generateHousingRecord(id)],
    appeals: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => generateAppeal(id)),
    documents: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => generateDocument(id)),
    benefits: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => generateBenefit(id)),
  }
}

const persons: PersonDetails[] = Array.from({ length: COUNT }, () => generatePerson())

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '..', 'public', 'mock-data')
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true })
}

const filePath = join(dir, 'persons.json')
const json = JSON.stringify(persons)
writeFileSync(filePath, json, 'utf-8')

const sizeMB = (Buffer.byteLength(json, 'utf-8') / (1024 * 1024)).toFixed(2)
console.log(`Generated ${persons.length} records → ${filePath}`)
console.log(`File size: ${sizeMB} MB`)
