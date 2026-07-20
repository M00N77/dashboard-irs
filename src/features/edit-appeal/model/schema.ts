import { z } from 'zod'

export const appealFormSchema = z.object({
  source: z.enum(['phone', 'email', 'portal', 'paper', 'in-person'], {
    required_error: 'Обязательное поле',
  }),
  category: z.string().min(1, 'Обязательное поле'),
  registeredAt: z.string().min(1, 'Обязательное поле'),
  status: z.enum(['new', 'in-progress', 'resolved', 'rejected', 'redirected'], {
    required_error: 'Обязательное поле',
  }),
  responsible: z.string().min(1, 'Обязательное поле'),
  dueDate: z.string().min(1, 'Обязательное поле'),
  resolutionText: z.string().optional(),
})

export type AppealFormValues = z.infer<typeof appealFormSchema>
