import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PersonFilters from '@features/person-filters/ui/PersonFilters'
import PersonTableWidget from '@widgets/person-table/ui/PersonTableWidget'

export default function RegistryPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Картотека
        </Typography>
        <PersonFilters />
        <PersonTableWidget />
      </Box>
    </Container>
  )
}
