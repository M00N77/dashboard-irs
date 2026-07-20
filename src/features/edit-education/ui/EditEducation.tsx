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
import type { EducationRecord } from '@entities/education/model/types'
import { addEducationRecord, deleteEducationRecord } from '@shared/api/persons.api'
import { z } from 'zod'
import { educationRecordSchema } from '../model/schema'

type EducationFormValues = z.infer<typeof educationRecordSchema>

interface Props {
  person: PersonDetails
}

export default function EditEducation({ person }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<EducationRecord | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationRecordSchema),
    defaultValues: {
      institution: '',
      degree: '',
      startYear: 2020,
      endYear: 2024,
    },
  })

  const addMutation = useMutation({
    mutationFn: (data: EducationFormValues) => addEducationRecord(person.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setShowForm(false)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (recordId: string) => deleteEducationRecord(person.id, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setDeleteTarget(null)
    },
  })

  const onSubmit = (data: EducationFormValues) => {
    addMutation.mutate(data)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }

  return (
    <Box>
      <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
        Добавить образование
      </Button>

      <List>
        {person.education.map((record) => (
          <ListItem
            key={record.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => setDeleteTarget(record)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={record.institution}
              secondary={`${record.degree} — ${record.startYear}–${record.endYear}`}
            />
          </ListItem>
        ))}
        {person.education.length === 0 && (
          <ListItem>
            <ListItemText primary="Нет записей" />
          </ListItem>
        )}
      </List>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Добавить образование</DialogTitle>
          <DialogContent>
            <TextField
              label="Учебное заведение"
              {...register('institution')}
              error={!!errors.institution}
              helperText={errors.institution?.message}
              size="small"
              fullWidth
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              label="Степень"
              {...register('degree')}
              error={!!errors.degree}
              helperText={errors.degree?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Год начала"
                type="number"
                {...register('startYear', { valueAsNumber: true })}
                error={!!errors.startYear}
                helperText={errors.startYear?.message}
                size="small"
                fullWidth
              />
              <TextField
                label="Год окончания"
                type="number"
                {...register('endYear', { valueAsNumber: true })}
                error={!!errors.endYear}
                helperText={errors.endYear?.message}
                size="small"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setShowForm(false); resetForm() }}>Отмена</Button>
            <Button type="submit" variant="contained" disabled={addMutation.isPending}>
              {addMutation.isPending ? <CircularProgress size={20} /> : 'Добавить'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Удалить запись об образовании в {deleteTarget?.institution}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Отмена</Button>
          <Button onClick={handleDelete} color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
