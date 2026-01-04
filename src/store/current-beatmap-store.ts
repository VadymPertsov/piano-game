import { create } from 'zustand'

import { Beatmap } from '@src/shared/types/beatmap'

interface CurrentBeatmapState {
  beatmap: Beatmap

  setBeatmap: (beatmap: Beatmap) => void
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
}))
