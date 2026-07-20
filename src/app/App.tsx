import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { theme } from './theme'
import ErrorBoundary from '@shared/ui/error-boundary/ErrorBoundary'
import AppLayout from '@widgets/layout/ui/AppLayout'

const DashboardPage = lazy(() => import('@pages/dashboard/ui/DashboardPage'))
const RegistryPage = lazy(() => import('@pages/registry/ui/RegistryPage'))
const PersonCardPage = lazy(() => import('@pages/person-card/ui/PersonCardPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
      <ErrorBoundary>
      <BrowserRouter>
        <Suspense
          fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <CircularProgress />
            </Box>
          }
        >
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/registry" element={<RegistryPage />} />
              <Route path="/registry/:id" element={<PersonCardPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      </ErrorBoundary>
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </QueryClientProvider>
  )
}
