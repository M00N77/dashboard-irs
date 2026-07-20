import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { usePersonQuery } from '@entities/person/model/usePersonQuery'
import EditPersonGeneral from '@features/edit-person-general/ui/EditPersonGeneral'
import EditFamily from '@features/edit-family/ui/EditFamily'
import EditEducation from '@features/edit-education/ui/EditEducation'
import EditHousing from '@features/edit-housing/ui/EditHousing'

const TABS = [
  { value: 'general', label: 'Общие сведения' },
  { value: 'family', label: 'Семья' },
  { value: 'education', label: 'Образование' },
  { value: 'housing', label: 'Жильё' },
]

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function genderLabel(gender: string): string {
  return gender === 'male' ? 'Мужской' : 'Женский'
}

export default function PersonCardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'general'

  const { data: person, isLoading, isError, refetch } = usePersonQuery(id!)

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('tab', newValue)
      return next
    }, { replace: true })
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width="100%" height={180} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={48} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 2 }} />
        </Box>
      </Container>
    )
  }

  if (isError || !person) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Alert
            severity="error"
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  Повторить
                </Button>
                <Button color="inherit" size="small" onClick={() => navigate('/registry')}>
                  Назад к списку
                </Button>
              </Box>
            }
          >
            Ошибка загрузки данных
          </Alert>
        </Box>
      </Container>
    )
  }

  const age = calculateAge(person.birthDate)

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/registry')}
          sx={{ mb: 2 }}
        >
          Назад к списку
        </Button>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {person.lastName} {person.firstName} {person.middleName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body1">
              {genderLabel(person.gender)}, {age} лет
            </Typography>
            <Chip
              label={person.status === 'active' ? 'Активен' : 'Архивирован'}
              color={person.status === 'active' ? 'success' : 'default'}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {person.region}
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {activeTab === 'general' && <EditPersonGeneral person={person} />}
        {activeTab === 'family' && <EditFamily person={person} />}
        {activeTab === 'education' && <EditEducation person={person} />}
        {activeTab === 'housing' && <EditHousing person={person} />}
      </Box>
    </Container>
  )
}
