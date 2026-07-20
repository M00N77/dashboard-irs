import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import type { PersonSummary } from '@entities/person/model/types'
import { usePersonsQuery } from '@entities/person/model/usePersonsQuery'
import { useUrlState } from '@features/person-filters/lib/useUrlState'

const columnHelper = createColumnHelper<PersonSummary>()

const columns = [
  columnHelper.accessor((row) => `${row.lastName} ${row.firstName} ${row.middleName}`, {
    id: 'fio',
    header: 'ФИО',
    enableSorting: false,
  }),
  columnHelper.accessor('birthDate', {
    header: 'Дата рождения',
  }),
  columnHelper.accessor('gender', {
    header: 'Пол',
  }),
  columnHelper.accessor('status', {
    header: 'Статус',
  }),
  columnHelper.accessor('region', {
    header: 'Регион',
  }),
]

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('ru-RU').format(new Date(dateStr))
}

export default function PersonTableWidget() {
  const navigate = useNavigate()
  const { get, set } = useUrlState()

  const page = parseInt(get('page', '1'), 10)
  const limit = parseInt(get('limit', '20'), 10)
  const search = get('search', '')
  const status = get('status', '')
  const region = get('region', '')
  const sortBy = get('sortBy', '')
  const sortOrder = get('sortOrder', '')

  const { data, isFetching, isError, refetch } = usePersonsQuery({
    page,
    limit,
    search,
    status,
    region,
    sortBy,
    sortOrder,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const pageIndex = page - 1

  const sortingState = useMemo<SortingState>(() => {
    if (!sortBy) return []
    return [{ id: sortBy, desc: sortOrder === 'desc' }]
  }, [sortBy, sortOrder])

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(total / limit),
    state: {
      sorting: sortingState,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sortingState) : updater
      if (next.length > 0) {
        set('sortBy', next[0].id)
        set('sortOrder', next[0].desc ? 'desc' : 'asc')
      } else {
        set('sortBy', '')
        set('sortOrder', '')
      }
    },
  })

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        Всего: {total}
      </Typography>

      {isFetching && <LinearProgress sx={{ mb: 1 }} />}

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Повторить
            </Button>
          }
          sx={{ mb: 2 }}
        >
          Ошибка загрузки данных
        </Alert>
      )}

      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.column.getCanSort() ? (
                    <TableSortLabel
                      active={header.column.getIsSorted() !== false}
                      direction={header.column.getIsSorted() || 'asc'}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableSortLabel>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/registry/${row.original.id}`)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {cell.column.id === 'birthDate'
                    ? formatDate(cell.getValue() as string)
                    : flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={pageIndex}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 20, 50]}
        onPageChange={(_, newPage) => set('page', String(newPage + 1))}
        onRowsPerPageChange={(e) => {
          set('limit', e.target.value)
        }}
      />
    </Box>
  )
}
