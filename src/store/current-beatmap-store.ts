import { create } from 'zustand'

import { GameResults } from '@src/features/piano-game/types/beatmap-data'
import { Beatmap } from '@src/shared/types/beatmap'

interface CurrentBeatmapState {
  beatmap: Beatmap
  gameResults: GameResults

  setBeatmap: (beatmap: Beatmap) => void
  setGameResults: (gameResults: GameResults) => void
}

export const useCurrentBeatmapStore = create<CurrentBeatmapState>(set => ({
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
      max: 0,
      miss: 0,
      w100: 0,
      w200: 0,
      w300: 0,
      w50: 0,
    },
  },
  setGameResults: (gameResults: GameResults) => set({ gameResults }),
}))
