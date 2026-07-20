import type { Appeal } from '@entities/appeal/model/types'

export const SOURCE_LABELS: Record<Appeal['source'], string> = {
  phone: 'Телефон',
  email: 'Электронная почта',
  portal: 'Портал',
  paper: 'Письменное',
  'in-person': 'Личный приём',
}

export const STATUS_LABELS: Record<Appeal['status'], string> = {
  new: 'Новое',
  'in-progress': 'В работе',
  resolved: 'Решено',
  rejected: 'Отклонено',
  redirected: 'Перенаправлено',
}

export const STATUS_COLORS: Record<Appeal['status'], 'info' | 'warning' | 'success' | 'error' | 'default'> = {
  new: 'info',
  'in-progress': 'warning',
  resolved: 'success',
  rejected: 'error',
  redirected: 'default',
}

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value: value as Appeal['status'],
  label,
}))

export const CATEGORY_OPTIONS = [
  'ЖКХ',
  'Обращение по ТКО',
  'Жалоба',
  'Запрос информации',
  'Иное',
]
