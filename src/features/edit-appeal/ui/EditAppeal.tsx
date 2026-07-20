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
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import type { PersonDetails } from '@entities/person/model/types'
import type { Appeal } from '@entities/appeal/model/types'
import { addAppeal, updateAppealStatus, deleteAppeal } from '@shared/api/persons.api'
import { appealFormSchema, type AppealFormValues } from '../model/schema'

const SOURCE_LABELS: Record<Appeal['source'], string> = {
  phone: 'Телефон',
  email: 'Электронная почта',
  portal: 'Портал',
  paper: 'Письменное',
  'in-person': 'Личный приём',
}

const STATUS_LABELS: Record<Appeal['status'], string> = {
  new: 'Новое',
  'in-progress': 'В работе',
  resolved: 'Решено',
  rejected: 'Отклонено',
  redirected: 'Перенаправлено',
}

const STATUS_COLORS: Record<Appeal['status'], 'info' | 'warning' | 'success' | 'error' | 'default'> = {
  new: 'info',
  'in-progress': 'warning',
  resolved: 'success',
  rejected: 'error',
  redirected: 'default',
}

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value: value as Appeal['status'],
  label,
}))

const CATEGORY_OPTIONS = [
  'ЖКХ',
  'обращение по ТКО',
  'жалоба',
  'запрос информации',
]

interface Props {
  person: PersonDetails
}

export default function EditAppeal({ person }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Appeal | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<AppealFormValues>({
    resolver: zodResolver(appealFormSchema),
    defaultValues: {
      source: 'phone',
      category: '',
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'new',
      responsible: '',
      dueDate: '',
      resolutionText: '',
    },
  })

  const addMutation = useMutation({
    mutationFn: (data: AppealFormValues) => addAppeal(person.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setShowForm(false)
      resetForm()
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ appealId, status }: { appealId: string; status: Appeal['status'] }) =>
      updateAppealStatus(person.id, appealId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (appealId: string) => deleteAppeal(person.id, appealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['person', person.id] })
      setDeleteTarget(null)
    },
  })

  const onSubmit = (data: AppealFormValues) => {
    addMutation.mutate(data)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }

  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('ru-RU').format(new Date(dateStr))
  }

  return (
    <Box>
      <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
        Добавить обращение
      </Button>

      <List>
        {person.appeals.map((appeal) => (
          <ListItem
            key={appeal.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => setDeleteTarget(appeal)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{appeal.category}</span>
                  <Chip
                    label={STATUS_LABELS[appeal.status]}
                    color={STATUS_COLORS[appeal.status]}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <span>{SOURCE_LABELS[appeal.source]}</span>
                  <span>—</span>
                  <span>{appeal.responsible}</span>
                  <span>—</span>
                  <span>с {formatDate(appeal.registeredAt)}</span>
                  {appeal.dueDate && (
                    <>
                      <span>до {formatDate(appeal.dueDate)}</span>
                    </>
                  )}
                  <TextField
                    select
                    size="small"
                    value={appeal.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        appealId: appeal.id,
                        status: e.target.value as Appeal['status'],
                      })
                    }
                    sx={{ minWidth: 140, ml: 1 }}
                    disabled={statusMutation.isPending}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              }
            />
          </ListItem>
        ))}
        {person.appeals.length === 0 && (
          <ListItem>
            <ListItemText primary="Нет записей" />
          </ListItem>
        )}
      </List>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Добавить обращение</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Источник"
              {...register('source')}
              error={!!errors.source}
              helperText={errors.source?.message}
              size="small"
              fullWidth
              sx={{ mb: 2, mt: 1 }}
            >
              {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Категория"
              {...register('category')}
              error={!!errors.category}
              helperText={errors.category?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Дата регистрации"
              type="date"
              {...register('registeredAt')}
              error={!!errors.registeredAt}
              helperText={errors.registeredAt?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select
              label="Статус"
              {...register('status')}
              error={!!errors.status}
              helperText={errors.status?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Ответственный"
              {...register('responsible')}
              error={!!errors.responsible}
              helperText={errors.responsible?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Срок исполнения"
              type="date"
              {...register('dueDate')}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Текст решения"
              {...register('resolutionText')}
              error={!!errors.resolutionText}
              helperText={errors.resolutionText?.message}
              size="small"
              fullWidth
              multiline
              rows={3}
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
          Удалить обращение по категории &quot;{deleteTarget?.category}&quot;?
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
