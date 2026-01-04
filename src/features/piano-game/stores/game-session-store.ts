import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { GameResults } from '@src/features/piano-game/types/beatmap-data'

export interface GameSessionState {
  gameResults: GameResults
  setGameResults: (gameResults: GameResults) => void
}

const PERSIST_STORE_NAME = 'game-session-store'

export const useGameSessionStore = create(
  persist<GameSessionState>(
    set => ({
      gameResults: {
        currentCombo: 0,
        maxCombo: 0,
        score: 0,
        summary: {
          '320': 0,
          '300': 0,
          '200': 0,
          '100': 0,
          '50': 0,
          '0': 0,
        },
      },
      setGameResults: (gameResults: GameResults) => set({ gameResults }),
    }),
    {
      name: PERSIST_STORE_NAME,
    }
  )
)
