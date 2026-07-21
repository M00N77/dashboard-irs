import { lazy, Suspense } from 'react'
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
import { calculateAge, genderLabel } from '@shared/lib/date'

function pluralYears(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'год'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'года'
  return 'лет'
}
import EditPersonGeneral from '@features/edit-person-general/ui/EditPersonGeneral'

const EditFamily = lazy(() => import('@features/edit-family/ui/EditFamily'))
const EditEducation = lazy(() => import('@features/edit-education/ui/EditEducation'))
const EditHousing = lazy(() => import('@features/edit-housing/ui/EditHousing'))
const EditAppeal = lazy(() => import('@features/edit-appeal/ui/EditAppeal'))
const EditEmployment = lazy(() => import('@features/edit-employment/ui/EditEmployment'))
const EditDocuments = lazy(() => import('@features/edit-documents/ui/EditDocuments'))
const EditBenefits = lazy(() => import('@features/edit-benefits/ui/EditBenefits'))

const TABS = [
  { value: 'general', label: 'Общие сведения' },
  { value: 'family', label: 'Семья' },
  { value: 'education', label: 'Образование' },
  { value: 'employment', label: 'Занятость' },
  { value: 'documents', label: 'Документы' },
  { value: 'benefits', label: 'Льготы' },
  { value: 'housing', label: 'Жильё' },
  { value: 'appeals', label: 'Обращения' },
]

export default function PersonCardPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'general'

  const { data: person, isLoading, isError, refetch } = usePersonQuery(id)

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
          <Box sx={{ minHeight: 64, display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="rectangular" width={200} height={40} />
          </Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Skeleton variant="rectangular" width="60%" height={32} sx={{ bgcolor: 'grey.300', mb: 1 }} />
            <Skeleton variant="rectangular" width="40%" height={20} sx={{ bgcolor: 'grey.300', mb: 1 }} />
            <Skeleton variant="rectangular" width="30%" height={24} sx={{ bgcolor: 'grey.300' }} />
          </Paper>
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
          <Box sx={{ minHeight: 64, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
              {person.lastName} {person.firstName} {person.middleName}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {person.registryCode}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body1">
              {genderLabel(person.gender)}, {age} {pluralYears(age)}
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
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 2 }} />}>
          {activeTab === 'general' && <EditPersonGeneral person={person} />}
          {activeTab === 'family' && <EditFamily person={person} />}
          {activeTab === 'education' && <EditEducation person={person} />}
          {activeTab === 'housing' && <EditHousing person={person} />}
          {activeTab === 'appeals' && <EditAppeal person={person} />}
          {activeTab === 'employment' && <EditEmployment person={person} />}
          {activeTab === 'documents' && <EditDocuments person={person} />}
          {activeTab === 'benefits' && <EditBenefits person={person} />}
        </Suspense>
      </Box>
    </Container>
  )
}
