import { z } from 'zod'

export const employmentRecordSchema = z.object({
  company: z.string().min(1, 'Обязательное поле'),
  position: z.string().min(1, 'Обязательное поле'),
  startDate: z.string().min(1, 'Обязательное поле'),
  endDate: z.string().optional().or(z.literal('')),
}).refine((d) => !d.endDate || d.endDate >= d.startDate, { message: 'Дата окончания не раньше начала', path: ['endDate'] })

export type EmploymentRecordFormValues = z.infer<typeof employmentRecordSchema>
