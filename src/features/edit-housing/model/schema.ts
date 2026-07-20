import { z } from 'zod'

export const housingRecordSchema = z.object({
  address: z.string().min(1, 'Обязательное поле'),
  type: z.enum(['apartment', 'house', 'other']),
  area: z
    .number({ message: 'Обязательное поле' })
    .min(10, 'Площадь должна быть от 10 до 500 м²')
    .max(500, 'Площадь должна быть от 10 до 500 м²'),
  ownershipType: z.enum(['owned', 'rented', 'social']),
})

export type HousingRecordFormValues = z.infer<typeof housingRecordSchema>
