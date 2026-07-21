import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info.componentStack)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            <AlertTitle>Что-то пошло не так</AlertTitle>
            {this.state.error?.message || 'Произошла непредвиденная ошибка.'}
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" color="error" onClick={this.handleReload}>
                Перезагрузить страницу
              </Button>
            </Box>
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}
