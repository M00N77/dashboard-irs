import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import type { PersonDetails } from '@entities/person/model/types'
import type { Benefit } from '@entities/benefit/model/types'
import { addBenefit, deleteBenefit } from '@shared/api/persons.api'
import { benefitSchema, type BenefitFormValues } from '../model/schema'
import { BENEFIT_KINDS, BENEFIT_STATUS_LABELS, toOptions } from '@shared/config/dictionaries'

interface Props {
  person: PersonDetails
}

export default function EditBenefits({ person }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Benefit | null>(null)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BenefitFormValues>({
    resolver: zodResolver(benefitSchema),
    defaultValues: { kind: BENEFIT_KINDS[0], basis: '', assignedDate: '', status: 'active', amount: 0 },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['person', person.id] })

  const addMutation = useMutation({
    mutationFn: (data: BenefitFormValues) => addBenefit(person.id, data as unknown as Record<string, unknown>),
    onSuccess: () => { invalidate(); setShowForm(false); reset() },
  })

  const deleteMutation = useMutation({
    mutationFn: (recordId: number) => deleteBenefit(person.id, recordId),
    onSuccess: () => { invalidate(); setDeleteTarget(null) },
  })

  const fmt = (d: string) => new Intl.DateTimeFormat('ru-RU').format(new Date(d))

  return (
    <Box>
      <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
        Добавить льготу
      </Button>

      <List>
        {person.benefits.map((b) => (
          <ListItem
            key={b.id}
            secondaryAction={
              <IconButton edge="end" aria-label="Удалить" onClick={() => setDeleteTarget(b)}><DeleteIcon /></IconButton>
            }
          >
            <ListItemText
              primary={`${b.kind} — ${b.amount.toLocaleString('ru-RU')} ₽`}
              secondary={`${BENEFIT_STATUS_LABELS[b.status]}, с ${fmt(b.assignedDate)}`}
            />
          </ListItem>
        ))}
        {person.benefits.length === 0 && <ListItem><ListItemText primary="Нет записей" /></ListItem>}
      </List>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit((d) => addMutation.mutate(d))}>
          <DialogTitle>Добавить льготу</DialogTitle>
          <DialogContent>
            <TextField select label="Вид" {...register('kind')} error={!!errors.kind} helperText={errors.kind?.message} size="small" fullWidth sx={{ mb: 2, mt: 1 }}>
              {BENEFIT_KINDS.map((k) => <MenuItem key={k} value={k}>{k}</MenuItem>)}
            </TextField>
            <TextField label="Основание" {...register('basis')} error={!!errors.basis} helperText={errors.basis?.message} size="small" fullWidth sx={{ mb: 2 }} />
            <TextField label="Дата назначения" type="date" {...register('assignedDate')} error={!!errors.assignedDate} helperText={errors.assignedDate?.message} size="small" fullWidth sx={{ mb: 2 }} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField select label="Статус" {...register('status')} error={!!errors.status} helperText={errors.status?.message} size="small" fullWidth sx={{ mb: 2 }}>
              {toOptions(BENEFIT_STATUS_LABELS).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
            <TextField label="Сумма, ₽" type="number" {...register('amount', { valueAsNumber: true })} error={!!errors.amount} helperText={errors.amount?.message} size="small" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setShowForm(false); reset() }}>Отмена</Button>
            <Button type="submit" variant="contained" disabled={addMutation.isPending}>
              {addMutation.isPending ? <CircularProgress size={20} /> : 'Добавить'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>Удалить льготу «{deleteTarget?.kind}»?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Отмена</Button>
          <Button onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)} color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
