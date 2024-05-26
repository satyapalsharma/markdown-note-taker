import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { logger } from './lib/logger'

// ──────────────────────────────────────────────
// Global error handlers
// ──────────────────────────────────────────────

/**
 * Handles uncaught exceptions that bubble up to the window.
 * Logs the error and provides a user-friendly message.
 */
function handleUncaughtException(event: ErrorEvent): void {
  logger.error('Uncaught exception', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  })

  // In production you may want to report to an external service here.
  if (import.meta.env.PROD) {
    // TODO: send to Sentry / LogRocket / etc.
  }
}

/**
 * Handles unhandled promise rejections.
 * Logs the rejection reason and any associated error.
 */
function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  logger.error('Unhandled promise rejection', {
    reason: event.reason,
  })

  // In production you may want to report to an external service here.
  if (import.meta.env.PROD) {
    // TODO: send to Sentry / LogRocket / etc.
  }
}

window.addEventListener('error', handleUncaughtException)
window.addEventListener('unhandledrejection', handleUnhandledRejection)

// ──────────────────────────────────────────────
// App bootstrap
// ──────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
