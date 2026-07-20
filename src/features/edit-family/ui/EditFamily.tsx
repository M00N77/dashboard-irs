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
import type { FamilyMember } from '@entities/family/model/types'
import { addFamilyMember, deleteFamilyMember } from '@shared/api/persons.api'
import { z } from 'zod'
import { familyMemberSchema } from '../model/schema'
import { formatDate } from '@shared/lib/date'

type FamilyFormValues = z.infer<typeof familyMemberSchema>

const RELATION_LABELS: Record<FamilyMember['relation'], string> = {
  spouse: 'Супруг(а)',
  child: 'Ребёнок',
  parent: 'Родитель',
  sibling: 'Брат/Сестра',
}

interface Props {
  person: PersonDetails
}

export default function EditFamily({ person }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<FamilyMember | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<FamilyFormValues>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      relation: 'spouse',
      firstName: '',
      lastName: '',
      birthDate: '',
    },
  })

  const addMutation = useMutation({
    mutationFn: (data: FamilyFormValues) => addFamilyMember(person.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setShowForm(false)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (memberId: number) => deleteFamilyMember(person.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setDeleteTarget(null)
    },
  })

  const onSubmit = (data: FamilyFormValues) => {
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
        Добавить члена семьи
      </Button>

      <List>
        {person.family.map((member) => (
          <ListItem
            key={member.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => setDeleteTarget(member)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${member.lastName} ${member.firstName}`}
              secondary={`${RELATION_LABELS[member.relation]} — ${formatDate(member.birthDate)}`}
            />
          </ListItem>
        ))}
        {person.family.length === 0 && (
          <ListItem>
            <ListItemText primary="Нет записей" />
          </ListItem>
        )}
      </List>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Добавить члена семьи</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Родство"
              {...register('relation')}
              error={!!errors.relation}
              helperText={errors.relation?.message}
              size="small"
              fullWidth
              sx={{ mb: 2, mt: 1 }}
            >
              {Object.entries(RELATION_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Имя"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Фамилия"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Дата рождения"
              type="date"
              {...register('birthDate')}
              error={!!errors.birthDate}
              helperText={errors.birthDate?.message}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
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
          Удалить {deleteTarget?.lastName} {deleteTarget?.firstName} из списка семьи?
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
