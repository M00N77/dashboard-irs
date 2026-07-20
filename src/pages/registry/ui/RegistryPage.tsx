import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PersonFilters from '@features/person-filters/ui/PersonFilters'
import PersonTableWidget from '@widgets/person-table/ui/PersonTableWidget'

export default function RegistryPage() {
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 3 } }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ lineHeight: 1.2, mb: 2 }}>
          Картотека
        </Typography>
        <PersonFilters />
        <PersonTableWidget />
      </Box>
    </Container>
  )
}
