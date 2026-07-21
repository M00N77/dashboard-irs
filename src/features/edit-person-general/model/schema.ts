import { z } from 'zod'

export const personGeneralSchema = z.object({
  firstName: z.string().min(1, 'Обязательное поле'),
  lastName: z.string().min(1, 'Обязательное поле'),
  middleName: z.string(),
  birthDate: z.string().min(1, 'Обязательное поле'),
  gender: z.enum(['male', 'female']),
  passportSeries: z.string(),
  passportNumber: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().refine(
    (val) => val.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    'Некорректный email',
  ),
  status: z.string().min(1, 'Обязательное поле'),
  region: z.string().min(1, 'Обязательное поле'),
})

export type PersonGeneralFormValues = z.infer<typeof personGeneralSchema>
