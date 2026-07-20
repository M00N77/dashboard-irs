import { z } from 'zod'

export const personGeneralSchema = z.object({
  firstName: z.string().min(1, 'Обязательное поле'),
  lastName: z.string().min(1, 'Обязательное поле'),
  middleName: z.string().optional().default(''),
  birthDate: z.string().min(1, 'Обязательное поле'),
  gender: z.enum(['male', 'female']),
  passportSeries: z.string().optional().default(''),
  passportNumber: z.string().optional().default(''),
  address: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  status: z.string().min(1, 'Обязательное поле'),
  region: z.string().min(1, 'Обязательное поле'),
})

export type PersonGeneralFormValues = z.infer<typeof personGeneralSchema>
