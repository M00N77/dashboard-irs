import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import type { PersonDetails } from '@entities/person/model/types'
import { updatePerson } from '@shared/api/persons.api'
import { housingRecordSchema, type HousingRecordFormValues } from '../model/schema'

const TYPE_OPTIONS = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'other', label: 'Другое' },
]

const OWNERSHIP_OPTIONS = [
  { value: 'owned', label: 'Собственность' },
  { value: 'rented', label: 'Аренда' },
  { value: 'social', label: 'Социальный найм' },
]

interface Props {
  person: PersonDetails
}

export default function EditHousing({ person }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  const housing = person.housing[0]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HousingRecordFormValues>({
    resolver: zodResolver(housingRecordSchema),
    defaultValues: {
      address: housing?.address ?? '',
      type: housing?.type ?? 'apartment',
      area: housing?.area ?? 0,
      ownershipType: housing?.ownershipType ?? 'owned',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: HousingRecordFormValues) =>
      updatePerson(person.id, { housing: [{ ...housing!, ...data }] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setIsEditing(false)
    },
  })

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  const onSubmit = (data: HousingRecordFormValues) => {
    mutation.mutate(data)
  }

  const disabled = !isEditing || mutation.isPending

  if (!housing) {
    return <Box>Нет данных о жилье</Box>
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600 }}>
      <TextField
        label="Адрес"
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message}
        disabled={disabled}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Тип жилья"
          {...register('type')}
          error={!!errors.type}
          helperText={errors.type?.message}
          disabled={disabled}
          size="small"
          fullWidth
        >
          {TYPE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Форма собственности"
          {...register('ownershipType')}
          error={!!errors.ownershipType}
          helperText={errors.ownershipType?.message}
          disabled={disabled}
          size="small"
          fullWidth
        >
          {OWNERSHIP_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TextField
        label="Площадь (м²)"
        type="number"
        {...register('area', { valueAsNumber: true })}
        error={!!errors.area}
        helperText={errors.area?.message}
        disabled={disabled}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      />

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
