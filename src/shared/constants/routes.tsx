import { ReactNode } from 'react'

import { PianoGame } from '@src/features/piano-game'
import { PlayPage, WelcomePage } from '@src/pages'

export const ROUTES = {
  home: '/',
  play: '/play',
  beatmaps: '/beatmaps',
}

interface Route {
  label?: string
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
  {
    label: 'Play',
    path: ROUTES.play,
    element: <PlayPage />,
    type: 'public',
  },
  {
    path: `${ROUTES.play}/:title`,
    element: <PianoGame />,
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
