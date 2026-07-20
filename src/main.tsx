import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'

async function start() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./shared/api/mocks/browser')
    const { getCachedPersons } = await import('@shared/api/mock-data/cache')

    await Promise.all([
      worker.start({ onUnhandledRequest: 'bypass' }),
      getCachedPersons(),
    ])
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()
