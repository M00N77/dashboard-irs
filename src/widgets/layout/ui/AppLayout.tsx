import { Suspense } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Дашборд', path: '/dashboard' },
    { label: 'Картотека', path: '/registry' },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ИРС Дашборд
          </Typography>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                textDecoration: location.pathname.startsWith(item.path) ? 'underline' : 'none',
                fontWeight: location.pathname.startsWith(item.path) ? 'bold' : 'normal',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ py: 3, flex: 1 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        }>
          <Outlet />
        </Suspense>
      </Container>
    </Box>
  )
}
