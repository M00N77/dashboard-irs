import { z } from 'zod'

export const documentSchema = z.object({
  type: z.string().min(1, 'Обязательное поле'),
  series: z.string().min(1, 'Обязательное поле'),
  number: z.string().min(1, 'Обязательное поле'),
  issuedBy: z.string().min(1, 'Обязательное поле'),
  issueDate: z.string().min(1, 'Обязательное поле'),
  expiryDate: z.string().optional().or(z.literal('')),
})

export type DocumentFormValues = z.infer<typeof documentSchema>
