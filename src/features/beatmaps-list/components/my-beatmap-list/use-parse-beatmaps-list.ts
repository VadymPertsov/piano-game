import { useQuery } from '@tanstack/react-query'

import { BEATMAPS_QUERY_KEY } from '@src/shared/constants/query-keys'
import { ImportedBeatmap } from '@src/shared/types/beatmap-prepare'

const BEATMAPS = import.meta.glob('@src/assets/*.osz', {
  query: '?url',
  import: 'default',
}) as Record<string, () => Promise<string>>

export const useParseBeatmapSet = () => {
  return useQuery({
    queryKey: [BEATMAPS_QUERY_KEY],
    queryFn: (): ImportedBeatmap[] => {
      return Object.entries(BEATMAPS).map(([title, urlFn]) => ({
        title: title.split(' ').splice(1).join(' ').replace('.osz', ''),
        urlFn,
      }))
    },
  })
}
