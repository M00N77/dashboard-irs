import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
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
import type { EmploymentRecord } from '@entities/employment/model/types'
import { addEmploymentRecord, deleteEmploymentRecord } from '@shared/api/persons.api'
import { employmentRecordSchema, type EmploymentRecordFormValues } from '../model/schema'

interface Props {
  person: PersonDetails
}

export default function EditEmployment({ person }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<EmploymentRecord | null>(null)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmploymentRecordFormValues>({
    resolver: zodResolver(employmentRecordSchema),
    defaultValues: { company: '', position: '', startDate: '', endDate: '' },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['person', person.id] })

  const addMutation = useMutation({
    mutationFn: (data: EmploymentRecordFormValues) =>
      addEmploymentRecord(person.id, { ...data, endDate: data.endDate || null }),
    onSuccess: () => { invalidate(); setShowForm(false); reset() },
  })
  const deleteMutation = useMutation({
    mutationFn: (recordId: number) => deleteEmploymentRecord(person.id, recordId),
    onSuccess: () => { invalidate(); setDeleteTarget(null) },
  })

  const fmt = (d: string) => new Intl.DateTimeFormat('ru-RU').format(new Date(d))

  return (
    <Box>
      <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
        Добавить место работы
      </Button>

      <List>
        {person.employment.map((rec) => (
          <ListItem
            key={rec.id}
            secondaryAction={
              <IconButton edge="end" aria-label="Удалить" onClick={() => setDeleteTarget(rec)}><DeleteIcon /></IconButton>
            }
          >
            <ListItemText
              primary={`${rec.position} — ${rec.company}`}
              secondary={`с ${fmt(rec.startDate)} ${rec.endDate ? 'по ' + fmt(rec.endDate) : '— по настоящее время'}`}
            />
          </ListItem>
        ))}
        {person.employment.length === 0 && <ListItem><ListItemText primary="Нет записей" /></ListItem>}
      </List>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit((d) => addMutation.mutate(d))}>
          <DialogTitle>Добавить место работы</DialogTitle>
          <DialogContent>
            <TextField label="Организация" {...register('company')} error={!!errors.company} helperText={errors.company?.message} size="small" fullWidth sx={{ mb: 2, mt: 1 }} />
            <TextField label="Должность" {...register('position')} error={!!errors.position} helperText={errors.position?.message} size="small" fullWidth sx={{ mb: 2 }} />
            <TextField label="Дата начала" type="date" {...register('startDate')} error={!!errors.startDate} helperText={errors.startDate?.message} size="small" fullWidth sx={{ mb: 2 }} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="Дата окончания (пусто — по н.в.)" type="date" {...register('endDate')} size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
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
        <DialogContent>Удалить запись «{deleteTarget?.position} — {deleteTarget?.company}»?</DialogContent>
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
