export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(dateStr))
}

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function genderLabel(gender: string): string {
  return gender === 'male' ? 'Мужской' : 'Женский'
}
