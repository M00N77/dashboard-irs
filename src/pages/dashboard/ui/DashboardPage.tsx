import { useQuery } from '@tanstack/react-query'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { getStats } from '@shared/api/stats.api'
import DashboardMetrics from '@widgets/dashboard-metrics/ui/DashboardMetrics'
import DashboardCharts from '@widgets/dashboard-charts/ui/DashboardCharts'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  })

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 2 }}>
        Аналитический дашборд
      </Typography>

      <Box sx={{ mb: 4 }}>
        <DashboardMetrics data={data?.summary} loading={isLoading} />
      </Box>

      <DashboardCharts
        appealStats={data?.appealStats}
        personStats={data?.personStats}
        loading={isLoading}
      />
    </Box>
  )
}
