import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import type { PersonDetails } from '@entities/person/model/types'
import { updatePerson } from '@shared/api/persons.api'
import {
  personGeneralSchema,
  type PersonGeneralFormValues,
} from '../model/schema'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Активен' },
  { value: 'archived', label: 'Архивирован' },
]

const REGIONS = [
  'Москва', 'Московская область', 'Санкт-Петербург', 'Ленинградская область',
  'Краснодарский край', 'Республика Татарстан', 'Свердловская область',
  'Ростовская область', 'Республика Башкортостан', 'Новосибирская область',
]

interface Props {
  person: PersonDetails
}

export default function EditPersonGeneral({ person }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonGeneralFormValues>({
    resolver: zodResolver(personGeneralSchema),
    defaultValues: {
      firstName: person.firstName,
      lastName: person.lastName,
      middleName: person.middleName ?? '',
      birthDate: person.birthDate,
      gender: person.gender,
      passportSeries: person.passportSeries ?? '',
      passportNumber: person.passportNumber ?? '',
      address: person.address ?? '',
      phone: person.phone ?? '',
      email: person.email ?? '',
      status: person.status,
      region: person.region,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: PersonGeneralFormValues) => updatePerson(person.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setIsEditing(false)
    },
  })

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const onSubmit = (data: PersonGeneralFormValues) => {
    mutation.mutate(data)
  }

  const disabled = !isEditing || mutation.isPending

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Фамилия"
          {...register('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          disabled={disabled}
          size="small"
          fullWidth
        />
        <TextField
          label="Имя"
          {...register('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          disabled={disabled}
          size="small"
          fullWidth
        />
        <TextField
          label="Отчество"
          {...register('middleName')}
          disabled={disabled}
          size="small"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Дата рождения"
          type="date"
          {...register('birthDate')}
          error={!!errors.birthDate}
          helperText={errors.birthDate?.message}
          disabled={disabled}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <FormControl component="fieldset" sx={{ mb: 2 }} disabled={disabled}>
        <FormLabel component="legend">Пол</FormLabel>
        <RadioGroup row {...register('gender')}>
          <FormControlLabel value="male" control={<Radio />} label="Мужской" />
          <FormControlLabel value="female" control={<Radio />} label="Женский" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Серия паспорта"
          {...register('passportSeries')}
          disabled={disabled}
          size="small"
          fullWidth
        />
        <TextField
          label="Номер паспорта"
          {...register('passportNumber')}
          disabled={disabled}
          size="small"
          fullWidth
        />
      </Box>

      <TextField
        label="Адрес"
        {...register('address')}
        disabled={disabled}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Телефон"
          {...register('phone')}
          disabled={disabled}
          size="small"
          fullWidth
        />
        <TextField
          label="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={disabled}
          size="small"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Статус"
          {...register('status')}
          error={!!errors.status}
          helperText={errors.status?.message}
          disabled={disabled}
          size="small"
          fullWidth
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Регион"
          {...register('region')}
          error={!!errors.region}
          helperText={errors.region?.message}
          disabled={disabled}
          size="small"
          fullWidth
        >
          {REGIONS.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {isEditing ? (
          <>
            <Button type="submit" variant="contained" disabled={mutation.isPending}>
              {mutation.isPending ? <CircularProgress size={20} /> : 'Сохранить'}
            </Button>
            <Button variant="outlined" onClick={handleCancel} disabled={mutation.isPending}>
              Отмена
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
        )}
      </Box>
    </Box>
  )
}
