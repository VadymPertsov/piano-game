import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Beatmap } from '@src/shared/types/beatmap'

interface CurrentBeatmapState {
  beatmap: Beatmap

  setBeatmap: (beatmap: Beatmap) => void
}

const PERSIST_STORE_NAME = 'current-beatmap-store'

export const useCurrentBeatmapStore = create(
  persist<CurrentBeatmapState>(
    set => ({
      beatmap: {
        title: '',
        artist: '',
        creator: '',
        picture: '',
        previewAudio: '',
        beatmapSet: [],
      },
      setBeatmap: (beatmap: Beatmap) => set({ beatmap }),
    }),
    {
      name: PERSIST_STORE_NAME,
    }
  )
)
