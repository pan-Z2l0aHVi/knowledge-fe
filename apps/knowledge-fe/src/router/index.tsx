import { createBrowserRouter } from 'react-router-dom'

import App from '@/app'
import ErrorBoundary from '@/app/components/error-boundary'

import { routes } from './routes'

const router = createBrowserRouter([
  {
    path: '*',
    element: <App />,
    children: routes,
    errorElement: <ErrorBoundary />
  }
])

export default router
