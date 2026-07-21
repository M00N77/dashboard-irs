// Единый источник правды для справочных значений и подписей (RU).

type ChipColor = 'info' | 'warning' | 'success' | 'error' | 'default'

export const GENDERS = ['male', 'female'] as const
export const GENDER_LABELS: Record<string, string> = {
  male: 'Мужской',
  female: 'Женский',
}

export const PERSON_STATUSES = ['active', 'archived'] as const
export const PERSON_STATUS_LABELS: Record<string, string> = {
  active: 'Активен',
  archived: 'Архивирован',
}

export const REGIONS = [
  'Москва', 'Московская область', 'Санкт-Петербург', 'Ленинградская область',
  'Краснодарский край', 'Республика Татарстан', 'Свердловская область',
  'Ростовская область', 'Республика Башкортостан', 'Новосибирская область',
] as const

// Каноничные значения категорий — хранятся в данных как есть
export const APPEAL_CATEGORIES = [
  'ЖКХ', 'Обращение по ТКО', 'Жалоба', 'Запрос информации', 'Иное',
] as const

export const APPEAL_SOURCES = ['phone', 'email', 'portal', 'paper', 'in-person'] as const
export const APPEAL_SOURCE_LABELS: Record<string, string> = {
  phone: 'Телефон',
  email: 'Электронная почта',
  portal: 'Портал',
  paper: 'Письменное',
  'in-person': 'Личный приём',
}

export const APPEAL_STATUSES = ['new', 'in-progress', 'resolved', 'rejected', 'redirected'] as const
export const APPEAL_STATUS_LABELS: Record<string, string> = {
  new: 'Новое',
  'in-progress': 'В работе',
  resolved: 'Решено',
  rejected: 'Отклонено',
  redirected: 'Перенаправлено',
}
export const APPEAL_STATUS_COLORS: Record<string, ChipColor> = {
  new: 'info',
  'in-progress': 'warning',
  resolved: 'success',
  rejected: 'error',
  redirected: 'default',
}

export const FAMILY_RELATIONS = ['spouse', 'child', 'parent', 'sibling'] as const
export const FAMILY_RELATION_LABELS: Record<string, string> = {
  spouse: 'Супруг(а)',
  child: 'Ребёнок',
  parent: 'Родитель',
  sibling: 'Брат/Сестра',
}

export const HOUSING_TYPES = ['apartment', 'house', 'other'] as const
export const HOUSING_TYPE_LABELS: Record<string, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  other: 'Другое',
}
export const OWNERSHIP_TYPES = ['owned', 'rented', 'social'] as const
export const OWNERSHIP_LABELS: Record<string, string> = {
  owned: 'Собственность',
  rented: 'Аренда',
  social: 'Социальный найм',
}

export const EDUCATION_DEGREES = [
  'Среднее общее', 'Среднее профессиональное', 'Бакалавриат',
  'Специалитет', 'Магистратура', 'Аспирантура',
] as const

export function toOptions(labels: Record<string, string>): { value: string; label: string }[] {
  return Object.keys(labels).map((value) => ({ value, label: labels[value] }))
}
