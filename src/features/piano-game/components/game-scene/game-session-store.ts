import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import {
  ColumnNote,
  GameResults,
  JudgePoints,
} from '@src/features/piano-game/types/beatmap-data'

export interface GameSessionState {
  gameResults: GameResults
  setGameResults: (gameResults: GameResults) => void

  registerJudge: (value: JudgePoints) => void
  registerMiss: (note: ColumnNote, isTail: boolean) => void
}

const PERSIST_STORE_NAME = 'game-session-store'

export const useGameSessionStore = create(
  persist(
    immer<GameSessionState>((set, get) => ({
      gameResults: {
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

      registerJudge: (value: JudgePoints) =>
        set(state => {
          state.gameResults.summary[value]++

          if (value === 0) {
            state.gameResults.maxCombo = 0
            return
          }

          state.gameResults.maxCombo++
          state.gameResults.score += value * state.gameResults.maxCombo
        }),
      registerMiss: (note: ColumnNote, isTail: boolean) => {
        const { registerJudge } = get()

        if (note.missed) return

        if (isTail) {
          note.tailHit = true
        } else {
          note.hit = true
        }

        note.missed = true

        registerJudge(0)
      },
    })),
    {
      name: PERSIST_STORE_NAME,
    }
  )
)
