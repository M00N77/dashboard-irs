import { z } from 'zod'

export const housingRecordSchema = z.object({
  address: z.string().min(1, 'Обязательное поле'),
  type: z.enum(['apartment', 'house', 'other']),
  area: z.coerce.number().positive('Должно быть положительным числом'),
  ownershipType: z.enum(['owned', 'rented', 'social']),
})

export type HousingRecordFormValues = z.infer<typeof housingRecordSchema>
