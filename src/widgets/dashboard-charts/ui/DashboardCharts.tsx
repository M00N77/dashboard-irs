import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
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

interface DashboardChartsProps {
  appealStats?: AppealStats
  personStats?: PersonStats
  loading?: boolean
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

function ChartSkeleton() {
  return (
    <Paper sx={{ p: 3, height: '100%', minHeight: 360, display: 'flex', flexDirection: 'column' }}>
      <Skeleton width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" sx={{ flex: 1, minHeight: 260 }} />
    </Paper>
  )
}

export default function DashboardCharts({ appealStats, personStats, loading }: DashboardChartsProps) {
  const theme = useTheme()

  const STATUS_THEME_COLORS: Record<string, string> = {
    new: theme.palette.info.main,
    'in-progress': theme.palette.warning.main,
    resolved: theme.palette.success.main,
    rejected: theme.palette.error.main,
    redirected: theme.palette.text.secondary,
  }

  if (loading) {
    return (
      <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <ChartSkeleton />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <ChartSkeleton />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <ChartSkeleton />
      </Grid>
      </Grid>
    )
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
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <Paper sx={{ p: 3, height: '100%', minHeight: 400 }}>
          <Typography variant="h6" gutterBottom>
            Статусы обращений
          </Typography>
          <ResponsiveContainer width="100%" height={330}>
            <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
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
        <Paper sx={{ p: 3, height: '100%', minHeight: 400 }}>
          <Typography variant="h6" gutterBottom>
            Категории обращений
          </Typography>
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={categoryData} margin={{ bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <Paper sx={{ p: 3, height: '100%', minHeight: 400 }}>
          <Typography variant="h6" gutterBottom>
            Возрастные группы
          </Typography>
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={ageData} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.success.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  )
}
