import { ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@src/shared/constants/routes'

import { AppLayout } from '../layout/app-layout'

const isUserLogged = true

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  return isUserLogged ? children : <>404 not found</>
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [...PUBLIC_ROUTES, ...PRIVATE_ROUTES].map(route => {
      if (route.type === 'private') {
        return {
          path: route.path,
          element: <PrivateRoute>{route.element}</PrivateRoute>,
        }
      }
      return {
        path: route.path,
        element: route.element,
      }
    }),
  },
])

export const AppRouter = () => <RouterProvider router={router} />
