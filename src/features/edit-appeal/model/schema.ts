import { z } from 'zod'

export const appealFormSchema = z.object({
  source: z.enum(['phone', 'email', 'portal', 'paper', 'in-person'], {
    message: 'Выберите источник',
  }),
  category: z.string().min(1, 'Обязательное поле'),
  registeredAt: z.string().min(1, 'Обязательное поле'),
  status: z.enum(['new', 'in-progress', 'resolved', 'rejected', 'redirected'], {
    message: 'Выберите статус',
  }),
  responsible: z.string().min(1, 'Обязательное поле'),
  dueDate: z.string().min(1, 'Обязательное поле'),
  resolutionText: z.string().optional(),
}).refine((d) => !d.dueDate || !d.registeredAt || d.dueDate >= d.registeredAt, { message: 'Срок не раньше даты регистрации', path: ['dueDate'] })

export type AppealFormValues = z.infer<typeof appealFormSchema>
