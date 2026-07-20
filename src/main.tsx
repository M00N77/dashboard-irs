import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'

async function start() {
  const { worker } = await import('./shared/api/mocks/browser')

  await worker.start({ onUnhandledRequest: 'bypass' })

  import('@shared/api/mock-data/cache').then(({ getCachedPersons }) =>
    getCachedPersons(),
  )

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()
