import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { PieLabelRenderProps } from 'recharts'
import type { AppealStats, PersonStats } from '@shared/api/stats.api'

interface ChartsContentProps {
  appealStats?: AppealStats
  personStats?: PersonStats
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  'in-progress': 'В работе',
  resolved: 'Решён',
  rejected: 'Отклонён',
  redirected: 'Перенаправлен',
}

const CATEGORY_LABELS: Record<string, string> = {
  tko: 'ТКО',
  jkh: 'ЖКХ',
  complaint: 'Жалоба',
  info: 'Запрос информации',
  other: 'Прочее',
}

export default function ChartsContent({ appealStats, personStats }: ChartsContentProps) {
  const theme = useTheme()

  const STATUS_THEME_COLORS: Record<string, string> = {
    new: theme.palette.info.main,
    'in-progress': theme.palette.warning.main,
    resolved: theme.palette.success.main,
    rejected: theme.palette.error.main,
    redirected: theme.palette.text.secondary,
  }

  const statusData = appealStats
    ? Object.entries(appealStats.byStatus).map(([key, value]) => ({
        name: STATUS_LABELS[key] || key,
        value,
        color: STATUS_THEME_COLORS[key] || theme.palette.grey[400],
      }))
    : []

  const categoryData = appealStats
    ? Object.entries(appealStats.byCategory).map(([key, value]) => ({
        name: CATEGORY_LABELS[key] || key,
        value,
      }))
    : []

  const ageData = personStats
    ? Object.entries(personStats.ageGroups).map(([key, value]) => ({
        name: key,
        value,
      }))
    : []

  return (
    <Grid container spacing={3} sx={{ minHeight: 400 }}>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <Paper sx={{ p: 3, height: 400, width: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ lineHeight: 1.3, mb: 2 }}>
            Статусы обращений
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="75%"
                dataKey="value"
                label={({ name, percent }: PieLabelRenderProps) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <Paper sx={{ p: 3, height: 400, width: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ lineHeight: 1.3, mb: 2 }}>
            Категории обращений
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <Paper sx={{ p: 3, height: 400, width: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" sx={{ lineHeight: 1.3, mb: 2 }}>
            Возрастные группы
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.success.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  )
}
