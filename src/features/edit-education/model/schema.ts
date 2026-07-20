import { z } from 'zod'

export const educationRecordSchema = z.object({
  institution: z.string().min(1, 'Обязательное поле'),
  degree: z.string().min(1, 'Обязательное поле'),
  startYear: z.coerce.number().int().min(1900, 'Некорректный год').max(2100, 'Некорректный год'),
  endYear: z.coerce.number().int().min(1900, 'Некорректный год').max(2100, 'Некорректный год'),
})

export type EducationRecordFormValues = z.infer<typeof educationRecordSchema>
