import { useQuery } from '@tanstack/react-query'

import { LOAD_PARSED_BEATMAP_QUERY_KEY } from '@src/shared/constants/query-keys'
import {
  loadParsedBeatmap,
  loadRawBeatmap,
  saveParsedBeatmap,
} from '@src/shared/db/beatmap-actions'

import { parseBeatmapData } from '../../utils/parse-beatmap-data'
import { prepareBeatmapData } from '../../utils/prepare-beatmap-data'

export const useLoadParsedBeatmap = (title?: string) => {
  return useQuery({
    queryKey: [LOAD_PARSED_BEATMAP_QUERY_KEY, { title }],
    queryFn: async () => {
      if (!title) return

      const savedParsed = await loadParsedBeatmap(title)
      if (savedParsed) return savedParsed

      const raw = await loadRawBeatmap(title)
      if (!raw) return

      const prepared = prepareBeatmapData(raw)
      const parsed = parseBeatmapData(prepared)

      await saveParsedBeatmap(parsed)

      return parsed
    },
    enabled: !!title,
  })
}
