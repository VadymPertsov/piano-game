import { SavedRawBeatmap } from '@src/shared/types/beatmap-prepare'

export const prepareBeatmapData = (rawBeatmap: SavedRawBeatmap): string => {
  const decoder = new TextDecoder('utf-8')

  // BG

  // AUDIO

  return decoder.decode(rawBeatmap.beatmap)
}
