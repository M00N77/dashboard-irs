import { faker } from '@faker-js/faker'
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

faker.seed(42)

const COUNT = 5000

let nextPersonId = 1000
let nextSubId = 1



function generateFamilyMember(personId: number): FamilyMember {
  const gender = faker.helpers.arrayElement([...GENDERS]) as 'male' | 'female'
  return {
    id: nextSubId++,
    personId,
    relation: faker.helpers.arrayElement([...FAMILY_RELATIONS]),
    firstName: faker.person.firstName(gender === 'male' ? 'male' : 'female'),
    lastName: faker.person.lastName(),
    birthDate: faker.date.birthdate({ min: 1, max: 80, mode: 'age' }).toISOString().split('T')[0],
  }
}

function generateEducationRecord(personId: number): EducationRecord {
  const startYear = faker.number.int({ min: 2000, max: 2020 })
  return {
    id: nextSubId++,
    personId,
    institution: faker.company.name() + ' University',
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

function generatePerson(): PersonDetails {
  const id = nextPersonId++
  const gender = faker.helpers.arrayElement([...GENDERS]) as 'male' | 'female'
  const firstName = faker.person.firstName(gender === 'male' ? 'male' : 'female')
  const lastName = faker.person.lastName()
  const middleName = faker.person.middleName(gender === 'male' ? 'male' : 'female')
  const birthDate = faker.date.birthdate({ min: 18, max: 90, mode: 'age' }).toISOString().split('T')[0]

  const familyCount = faker.number.int({ min: 0, max: 4 })
  const educationCount = faker.number.int({ min: 1, max: 3 })
  const employmentCount = faker.number.int({ min: 0, max: 2 })
  const appealsCount = faker.number.int({ min: 0, max: 3 })

  return {
    id,
    firstName,
    lastName,
    middleName,
    birthDate,
    gender,
    status: faker.helpers.arrayElement([...PERSON_STATUSES]),
    region: faker.helpers.arrayElement([...REGIONS]),
    registryCode: `REG-2026-${id.toString().padStart(5, '0')}`,
    passportSeries: faker.string.numeric({ length: 4 }),
    passportNumber: faker.string.numeric({ length: 6 }),
    address: faker.location.streetAddress(true),
    phone: faker.phone.number(),
    email: faker.internet.email({ firstName, lastName }),
    family: Array.from({ length: familyCount }, () => generateFamilyMember(id)),
    education: Array.from({ length: educationCount }, () => generateEducationRecord(id)),
    employment: Array.from({ length: employmentCount }, () => generateEmploymentRecord(id)),
    housing: [generateHousingRecord(id)],
    appeals: Array.from({ length: appealsCount }, () => generateAppeal(id)),
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
