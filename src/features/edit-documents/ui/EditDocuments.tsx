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
import type { Document } from '@entities/document/model/types'
import { addDocument, deleteDocument } from '@shared/api/persons.api'
import { documentSchema, type DocumentFormValues } from '../model/schema'
import { DOCUMENT_TYPES } from '@shared/config/dictionaries'

interface Props {
  person: PersonDetails
}

export default function EditDocuments({ person }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { type: DOCUMENT_TYPES[0], series: '', number: '', issuedBy: '', issueDate: '', expiryDate: '' },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['person', person.id] })

  const addMutation = useMutation({
    mutationFn: (data: DocumentFormValues) => addDocument(person.id, data),
    onSuccess: () => { invalidate(); setShowForm(false); reset() },
  })

  const deleteMutation = useMutation({
    mutationFn: (recordId: number) => deleteDocument(person.id, recordId),
    onSuccess: () => { invalidate(); setDeleteTarget(null) },
  })

  const fmt = (d: string) => new Intl.DateTimeFormat('ru-RU').format(new Date(d))

  return (
    <Box>
      <Button variant="contained" onClick={() => setShowForm(true)} sx={{ mb: 2 }}>
        Добавить документ
      </Button>

      <List>
        {person.documents.map((doc) => (
          <ListItem
            key={doc.id}
            secondaryAction={
              <IconButton edge="end" aria-label="Удалить" onClick={() => setDeleteTarget(doc)}><DeleteIcon /></IconButton>
            }
          >
            <ListItemText
              primary={`${doc.type} ${doc.series} ${doc.number}`}
              secondary={`выдан ${doc.issuedBy}, ${fmt(doc.issueDate)}`}
            />
          </ListItem>
        ))}
        {person.documents.length === 0 && <ListItem><ListItemText primary="Нет записей" /></ListItem>}
      </List>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit((d) => addMutation.mutate(d))}>
          <DialogTitle>Добавить документ</DialogTitle>
          <DialogContent>
            <TextField select label="Тип" {...register('type')} error={!!errors.type} helperText={errors.type?.message} size="small" fullWidth sx={{ mb: 2, mt: 1 }}>
              {DOCUMENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Серия" {...register('series')} error={!!errors.series} helperText={errors.series?.message} size="small" fullWidth sx={{ mb: 2 }} />
            <TextField label="Номер" {...register('number')} error={!!errors.number} helperText={errors.number?.message} size="small" fullWidth sx={{ mb: 2 }} />
            <TextField label="Кем выдан" {...register('issuedBy')} error={!!errors.issuedBy} helperText={errors.issuedBy?.message} size="small" fullWidth sx={{ mb: 2 }} />
            <TextField label="Дата выдачи" type="date" {...register('issueDate')} error={!!errors.issueDate} helperText={errors.issueDate?.message} size="small" fullWidth sx={{ mb: 2 }} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="Срок действия (опц.)" type="date" {...register('expiryDate')} size="small" fullWidth slotProps={{ inputLabel: { shrink: true } }} />
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
        <DialogContent>Удалить документ «{deleteTarget?.type} {deleteTarget?.series} {deleteTarget?.number}»?</DialogContent>
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
