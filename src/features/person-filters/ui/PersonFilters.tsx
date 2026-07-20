import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { useUrlState } from '../lib/useUrlState'

const STATUS_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'archived', label: 'Архивные' },
]

const REGIONS = [
  'Москва', 'Московская область', 'Санкт-Петербург', 'Ленинградская область',
  'Краснодарский край', 'Республика Татарстан', 'Свердловская область',
  'Ростовская область', 'Республика Башкортостан', 'Новосибирская область',
]

const REGION_OPTIONS = [
  { value: '', label: 'Все регионы' },
  ...REGIONS.map((r) => ({ value: r, label: r })),
]

export default function PersonFilters() {
  const { get, set } = useUrlState()
  const searchFromUrl = get('search', '')
  const statusFromUrl = get('status', '')
  const regionFromUrl = get('region', '')

  const [searchDraft, setSearchDraft] = useState(searchFromUrl)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = (value: string) => {
    setSearchDraft(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      set('search', value)
    }, 400)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleReset = () => {
    setSearchDraft('')
    set('search', '')
    set('status', '')
    set('region', '')
    set('sortBy', '')
    set('sortOrder', '')
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
      <TextField
        size="small"
        label="Поиск"
        placeholder="ФИО..."
        value={searchDraft}
        onChange={(e) => handleSearchChange(e.target.value)}
        sx={{ minWidth: 240 }}
      />
      <TextField
        select
        size="small"
        label="Статус"
        value={statusFromUrl}
        onChange={(e) => set('status', e.target.value)}
        sx={{ minWidth: 160 }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        label="Регион"
        value={regionFromUrl}
        onChange={(e) => set('region', e.target.value)}
        sx={{ minWidth: 200 }}
      >
        {REGION_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="outlined" onClick={handleReset}>
        Сбросить фильтры
      </Button>
    </Box>
  )
}
