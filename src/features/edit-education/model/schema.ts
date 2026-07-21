import { z } from 'zod'

export const educationRecordSchema = z.object({
  institution: z.string().min(1, 'Обязательное поле'),
  degree: z.string().min(1, 'Обязательное поле'),
  startYear: z.number().int().min(1900, 'Некорректный год').max(2100, 'Некорректный год'),
  endYear: z.number().int().min(1900, 'Некорректный год').max(2100, 'Некорректный год'),
}).refine((d) => d.endYear >= d.startYear, { message: 'Год окончания не раньше года начала', path: ['endYear'] })

export type EducationRecordFormValues = z.infer<typeof educationRecordSchema>
