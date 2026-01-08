import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { unzipSync } from 'fflate'

import { BEATMAP_SET_QUERY_KEY } from '@src/shared/constants/query-keys'
import {
  ImportedBeatmap,
  ImportedBeatmapSet,
} from '@src/shared/types/beatmap-prepare'

export const useParseBeatmapSet = ({ title, urlFn }: ImportedBeatmap) => {
  return useQuery({
    queryKey: [BEATMAP_SET_QUERY_KEY, { title }],
    queryFn: async (): Promise<ImportedBeatmapSet[]> => {
      const url = await urlFn()
      const response = await axios(url, { responseType: 'arraybuffer' })
      const buffer = new Uint8Array(response.data)

      const files = unzipSync(buffer)

      const findBeatmaps = Object.entries(files)
        .filter(([title]) => title.endsWith('.osu'))
        .map(([title, data]) => ({
          title: title.replace('.osu', ''),
          data,
        }))

      return findBeatmaps
    },
  })
}
