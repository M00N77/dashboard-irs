import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'

async function start() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./shared/api/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()
