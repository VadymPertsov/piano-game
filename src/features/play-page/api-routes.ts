import axios from 'axios'

import { Beatmap } from '@src/shared/types/beatmap'

const BASIC_BEATMAPS_IDS = [2120250, 2478424, 2464092]

interface CatboyBeatmapResponse {
  id: number
  title: string
  artist: string
  creator: string
  covers: {
    cover: string
    'cover@2x': string
  }
  preview_url: string
  beatmaps: CatboyBeatmapItem[]
}

interface CatboyBeatmapItem {
  id: number
  beatmapset_id: number
  url: string
  version: string
  difficulty_rating: number
  max_combo: number
}

export const getBasicBeatmaps = async (): Promise<Beatmap[]> => {
  const results = await Promise.allSettled(
    BASIC_BEATMAPS_IDS.map(id =>
      axios.get<CatboyBeatmapResponse>(`https://catboy.best/api/v2/s/${id}`)
    )
  )

  return results
    .filter(
      (
        r
      ): r is PromiseFulfilledResult<
        Awaited<ReturnType<typeof axios.get<CatboyBeatmapResponse>>>
      > => r.status === 'fulfilled'
    )
    .map(r => parseCatboyToBeatmap(r.value.data))
}

const parseCatboyToBeatmap = (data: CatboyBeatmapResponse): Beatmap => ({
  title: data.title,
  artist: data.artist,
  creator: data.creator,
  picture: data.covers['cover@2x'] ?? data.covers.cover,
  previewAudio: data.preview_url,
  beatmapSet: data.beatmaps.map(b => ({
    beatmapsetId: b.beatmapset_id,
    url: b.url,
    version: b.version,
    difficultyRating: b.difficulty_rating,
    maxCombo: b.max_combo,
  })),
})
