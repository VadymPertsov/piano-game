import { ReactNode } from 'react'

import { WelcomePage } from '@src/pages/welcome-page'

export const ROUTES = {
  home: '/',
  profile: '/profile',
}

interface Route {
  label: string
  path: string
  element: ReactNode
  type: 'public' | 'private'
}

export const PUBLIC_ROUTES: Route[] = [
  {
    label: 'Home',
    path: ROUTES.home,
    element: <WelcomePage />,
    type: 'public',
  },
]

export const PRIVATE_ROUTES: Route[] = [
  // {
  //   label: 'Profile',
  //   path: ROUTES.profile,
  //   element: <ProfilePage />,
  //   type: 'private',
  // },
]
