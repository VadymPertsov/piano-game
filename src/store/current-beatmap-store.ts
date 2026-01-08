import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CurrentBeatmapState {
  beatmap: string | undefined
  setBeatmap: (beatmap: string) => void
}

const PERSIST_STORE_NAME = 'current-beatmap-store'

export const useCurrentBeatmapStore = create(
  persist<CurrentBeatmapState>(
    set => ({
      beatmap: undefined,
      setBeatmap: beatmap => set({ beatmap }),
    }),
    {
      name: PERSIST_STORE_NAME,
    }
  )
)
