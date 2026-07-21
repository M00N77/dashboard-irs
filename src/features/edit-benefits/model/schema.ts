import { z } from 'zod'

export const benefitSchema = z.object({
  kind: z.string().min(1, 'Обязательное поле'),
  basis: z.string().min(1, 'Обязательное поле'),
  assignedDate: z.string().min(1, 'Обязательное поле'),
  status: z.string().min(1, 'Обязательное поле'),
  amount: z.number().min(0),
})

export type BenefitFormValues = z.infer<typeof benefitSchema>
