import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const familyMemberSchema = z.object({
  relation: z.enum(['spouse', 'child', 'parent', 'sibling']),
  firstName: z.string().min(1, 'Обязательное поле'),
  lastName: z.string().min(1, 'Обязательное поле'),
  birthDate: z
    .string()
    .min(1, 'Обязательное поле')
    .refine(
      (val) => {
        const date = new Date(val)
        if (isNaN(date.getTime())) return false
        const year = date.getFullYear()
        return year >= 1900 && year <= currentYear
      },
      'Некорректная дата рождения',
    ),
})

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>
