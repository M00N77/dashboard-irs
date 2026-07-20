import { lazy, Suspense } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import type { AppealStats, PersonStats } from '@shared/api/stats.api'

const ChartsContent = lazy(() => import('./ChartsContent'))

interface DashboardChartsProps {
  appealStats?: AppealStats
  personStats?: PersonStats
  loading?: boolean
}

function ChartSkeleton() {
  return (
    <Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Skeleton width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" sx={{ flex: 1, minHeight: 320 }} />
    </Paper>
  )
}

export default function DashboardCharts({ appealStats, personStats, loading }: DashboardChartsProps) {
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

  return (
    <Suspense
      fallback={
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
      }
    >
      <ChartsContent appealStats={appealStats} personStats={personStats} />
    </Suspense>
  )
}
