import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import {
  ColumnNote,
  GameResults,
  JudgePoints,
} from '@src/features/piano-game/types/beatmap-data'
import { Beatmap } from '@src/shared/types/beatmap'

export interface CurrentBeatmapState {
  beatmap: Beatmap
  gameResults: GameResults

  setBeatmap: (beatmap: Beatmap) => void
  setGameResults: (gameResults: GameResults) => void

  registerJudge: (value: JudgePoints) => void
  registerMiss: (note: ColumnNote, isTail: boolean) => void
}

export const useCurrentBeatmapStore = create(
  immer<CurrentBeatmapState>((set, get) => ({
    beatmap: {
      title: '',
      artist: '',
      creator: '',
      picture: '',
      previewAudio: '',
      beatmapSet: [],
    },
    setBeatmap: (beatmap: Beatmap) => set({ beatmap }),

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
  }))
)
