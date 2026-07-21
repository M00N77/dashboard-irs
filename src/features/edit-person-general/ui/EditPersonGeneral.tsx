import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import type { PersonDetails } from '@entities/person/model/types'
import { updatePerson } from '@shared/api/persons.api'
import { personGeneralSchema } from '../model/schema'
import {
  PERSON_STATUS_LABELS, REGIONS, CITIZENSHIPS, MARITAL_STATUS_LABELS,
  CONTACT_CHANNEL_LABELS, EMPLOYMENT_STATUS_LABELS, DISABILITY_GROUP_LABELS,
  BENEFIT_CATEGORIES, toOptions,
} from '@shared/config/dictionaries'

type FormValues = z.input<typeof personGeneralSchema>

const Section = ({ title }: { title: string }) => (
  <>
    <Divider sx={{ my: 2 }} />
    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
  </>
)

interface Props { person: PersonDetails }

export default function EditPersonGeneral({ person }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(personGeneralSchema),
    defaultValues: {
      lastName: person.lastName, firstName: person.firstName, middleName: person.middleName ?? '',
      birthDate: person.birthDate, birthPlace: person.birthPlace ?? '', gender: person.gender,
      citizenship: person.citizenship ?? CITIZENSHIPS[0], maritalStatus: person.maritalStatus ?? 'single',
      childrenCount: person.childrenCount ?? 0, snils: person.snils ?? '', inn: person.inn ?? '',
      passportSeries: person.passportSeries ?? '', passportNumber: person.passportNumber ?? '',
      passportIssuedBy: person.passportIssuedBy ?? '', passportIssueDate: person.passportIssueDate ?? '',
      passportDivisionCode: person.passportDivisionCode ?? '', phone: person.phone ?? '',
      secondaryPhone: person.secondaryPhone ?? '', email: person.email ?? '',
      preferredContact: person.preferredContact ?? 'phone', regCity: person.regCity ?? '',
      regStreet: person.regStreet ?? '', regHouse: person.regHouse ?? '', regApartment: person.regApartment ?? '',
      regPostalCode: person.regPostalCode ?? '', actualSameAsReg: person.actualSameAsReg ?? true,
      actualAddress: person.actualAddress ?? '', employmentStatus: person.employmentStatus ?? 'employed',
      averageIncome: person.averageIncome ?? 0, disabilityGroup: person.disabilityGroup ?? 'none',
      benefitCategories: person.benefitCategories ?? [], isPensioner: person.isPensioner ?? false,
      isVeteran: person.isVeteran ?? false, isLargeFamily: person.isLargeFamily ?? false,
      status: person.status, region: person.region, notes: person.notes ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) => updatePerson(person.id, data as Partial<PersonDetails>),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['person', person.id] }); setIsEditing(false) },
  })

  const disabled = !isEditing || mutation.isPending
  const sameAddr = watch('actualSameAsReg')
  const row = { display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' } as const
  const tf = { size: 'small' as const, fullWidth: true }

  return (
    <Box component="form" onSubmit={handleSubmit((d) => mutation.mutate(d))} sx={{ maxWidth: 900 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>ФИО и личные данные</Typography>
      <Box sx={row}>
        <TextField label="Фамилия" {...tf} {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} disabled={disabled} />
        <TextField label="Имя" {...tf} {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} disabled={disabled} />
        <TextField label="Отчество" {...tf} {...register('middleName')} disabled={disabled} />
      </Box>
      <Box sx={row}>
        <TextField label="Дата рождения" type="date" {...tf} {...register('birthDate')} error={!!errors.birthDate} helperText={errors.birthDate?.message} disabled={disabled} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="Место рождения" {...tf} {...register('birthPlace')} disabled={disabled} />
        <TextField select label="Гражданство" {...tf} {...register('citizenship')} defaultValue={person.citizenship ?? CITIZENSHIPS[0]} disabled={disabled}>
          {CITIZENSHIPS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Box>
      <Box sx={row}>
        <FormControl component="fieldset" disabled={disabled}>
          <FormLabel component="legend">Пол</FormLabel>
          <RadioGroup row {...register('gender')} defaultValue={person.gender}>
            <FormControlLabel value="male" control={<Radio />} label="Мужской" />
            <FormControlLabel value="female" control={<Radio />} label="Женский" />
          </RadioGroup>
        </FormControl>
        <TextField select label="Семейное положение" {...tf} {...register('maritalStatus')} defaultValue={person.maritalStatus ?? 'single'} disabled={disabled}>
          {toOptions(MARITAL_STATUS_LABELS).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
        <TextField label="Детей" type="number" {...tf} {...register('childrenCount', { valueAsNumber: true })} disabled={disabled} />
      </Box>

      <Section title="Идентификаторы и паспорт" />
      <Box sx={row}>
        <TextField label="СНИЛС" {...tf} {...register('snils')} error={!!errors.snils} helperText={errors.snils?.message} disabled={disabled} />
        <TextField label="ИНН" {...tf} {...register('inn')} error={!!errors.inn} helperText={errors.inn?.message} disabled={disabled} />
      </Box>
      <Box sx={row}>
        <TextField label="Серия паспорта" {...tf} {...register('passportSeries')} error={!!errors.passportSeries} helperText={errors.passportSeries?.message} disabled={disabled} />
        <TextField label="Номер паспорта" {...tf} {...register('passportNumber')} error={!!errors.passportNumber} helperText={errors.passportNumber?.message} disabled={disabled} />
        <TextField label="Код подразделения" {...tf} {...register('passportDivisionCode')} error={!!errors.passportDivisionCode} helperText={errors.passportDivisionCode?.message} disabled={disabled} />
      </Box>
      <Box sx={row}>
        <TextField label="Кем выдан" {...tf} {...register('passportIssuedBy')} disabled={disabled} />
        <TextField label="Дата выдачи" type="date" {...tf} {...register('passportIssueDate')} disabled={disabled} slotProps={{ inputLabel: { shrink: true } }} />
      </Box>

      <Section title="Контакты" />
      <Box sx={row}>
        <TextField label="Телефон" {...tf} {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} disabled={disabled} />
        <TextField label="Доп. телефон" {...tf} {...register('secondaryPhone')} disabled={disabled} />
      </Box>
      <Box sx={row}>
        <TextField label="Email" {...tf} {...register('email')} error={!!errors.email} helperText={errors.email?.message} disabled={disabled} />
        <TextField select label="Предпочтительный канал" {...tf} {...register('preferredContact')} defaultValue={person.preferredContact ?? 'phone'} disabled={disabled}>
          {toOptions(CONTACT_CHANNEL_LABELS).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
      </Box>

      <Section title="Адрес регистрации" />
      <Box sx={row}>
        <TextField select label="Регион" {...tf} {...register('region')} defaultValue={person.region} error={!!errors.region} helperText={errors.region?.message} disabled={disabled}>
          {REGIONS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </TextField>
        <TextField label="Город" {...tf} {...register('regCity')} disabled={disabled} />
        <TextField label="Индекс" {...tf} {...register('regPostalCode')} error={!!errors.regPostalCode} helperText={errors.regPostalCode?.message} disabled={disabled} />
      </Box>
      <Box sx={row}>
        <TextField label="Улица" {...tf} {...register('regStreet')} disabled={disabled} />
        <TextField label="Дом" {...tf} {...register('regHouse')} disabled={disabled} />
        <TextField label="Квартира" {...tf} {...register('regApartment')} disabled={disabled} />
      </Box>
      <Controller name="actualSameAsReg" control={control} render={({ field }) => (
        <FormControlLabel control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} disabled={disabled} />} label="Фактический адрес совпадает с регистрацией" />
      )} />
      {!sameAddr && (
        <TextField label="Фактический адрес" {...tf} {...register('actualAddress')} disabled={disabled} sx={{ mt: 1, mb: 1 }} />
      )}

      <Section title="Социальный статус" />
      <Box sx={row}>
        <TextField select label="Занятость" {...tf} {...register('employmentStatus')} defaultValue={person.employmentStatus ?? 'employed'} disabled={disabled}>
          {toOptions(EMPLOYMENT_STATUS_LABELS).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
        <TextField label="Среднемесячный доход, ₽" type="number" {...tf} {...register('averageIncome', { valueAsNumber: true })} disabled={disabled} />
        <TextField select label="Инвалидность" {...tf} {...register('disabilityGroup')} defaultValue={person.disabilityGroup ?? 'none'} disabled={disabled}>
          {toOptions(DISABILITY_GROUP_LABELS).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
      </Box>
      <Controller name="benefitCategories" control={control} render={({ field }) => (
        <FormControl fullWidth size="small" sx={{ mb: 2 }} disabled={disabled}>
          <InputLabel>Категории льгот</InputLabel>
          <Select multiple value={field.value ?? []} onChange={(e) => field.onChange(e.target.value)} input={<OutlinedInput label="Категории льгот" />}
            renderValue={(sel) => <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>{(sel as string[]).map((v) => <Chip key={v} label={v} size="small" />)}</Stack>}>
            {BENEFIT_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      )} />
      <FormGroup row sx={{ mb: 1 }}>
        <Controller name="isPensioner" control={control} render={({ field }) => (
          <FormControlLabel control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} disabled={disabled} />} label="Пенсионер" />
        )} />
        <Controller name="isVeteran" control={control} render={({ field }) => (
          <FormControlLabel control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} disabled={disabled} />} label="Ветеран" />
        )} />
        <Controller name="isLargeFamily" control={control} render={({ field }) => (
          <FormControlLabel control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} disabled={disabled} />} label="Многодетная семья" />
        )} />
      </FormGroup>

      <Section title="Учётные сведения" />
      <Box sx={row}>
        <TextField select label="Статус" {...tf} {...register('status')} defaultValue={person.status} error={!!errors.status} helperText={errors.status?.message} disabled={disabled}>
          {toOptions(PERSON_STATUS_LABELS).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
      </Box>
      <TextField label="Примечание" {...tf} {...register('notes')} disabled={disabled} multiline rows={3} sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {isEditing ? (
          <>
            <Button type="submit" variant="contained" disabled={mutation.isPending}>
              {mutation.isPending ? <CircularProgress size={20} /> : 'Сохранить'}
            </Button>
            <Button variant="outlined" onClick={() => { reset(); setIsEditing(false) }} disabled={mutation.isPending}>Отмена</Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => setIsEditing(true)}>Редактировать</Button>
        )}
      </Box>
    </Box>
  )
}
