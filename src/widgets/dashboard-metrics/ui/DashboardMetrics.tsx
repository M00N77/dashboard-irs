import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import PeopleIcon from '@mui/icons-material/People'
import ForumIcon from '@mui/icons-material/Forum'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import type { StatsSummary } from '@shared/api/stats.api'

interface DashboardMetricsProps {
  data?: StatsSummary
  loading?: boolean
}

const metricCards = [
  { label: 'Всего граждан', field: 'totalPersons' as const, icon: PeopleIcon },
  { label: 'Всего обращений', field: 'totalAppeals' as const, icon: ForumIcon },
  { label: 'Активные обращения', field: 'activePersons' as const, icon: PlaylistAddCheckIcon },
]

export default function DashboardMetrics({ data, loading }: DashboardMetricsProps) {
  return (
    <Grid container spacing={3}>
      {metricCards.map((card) => {
        const Icon = card.icon
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.field}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 3,
                  '&:last-child': { pb: 3 },
                }}
              >
                <Icon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
                <div>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                  {loading ? (
                    <Skeleton variant="rectangular" width={60} height={40} />
                  ) : (
                    <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                      {data?.[card.field] ?? '—'}
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}
