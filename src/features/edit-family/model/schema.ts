import { z } from 'zod'

export const familyMemberSchema = z.object({
  relation: z.enum(['spouse', 'child', 'parent', 'sibling']),
  firstName: z.string().min(1, 'Обязательное поле'),
  lastName: z.string().min(1, 'Обязательное поле'),
  birthDate: z.string().min(1, 'Обязательное поле'),
})

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>
