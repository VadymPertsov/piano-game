import { ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { HomePage } from '@src/pages/home-page'
import { ProfilePage } from '@src/pages/profile-page'
import { ROUTES } from '@src/shared/constants/routes'

import { AppLayout } from '../layout/app-layout'

const isUserLogged = true

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  return isUserLogged ? children : <>404 not found</>
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // public
      {
        path: ROUTES.home,
        element: <HomePage />,
      },
      // private
      {
        path: ROUTES.profile,
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
    ],
  },
])

export const AppRouter = () => <RouterProvider router={router} />
