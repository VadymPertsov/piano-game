import { useQuery } from '@tanstack/react-query'

import { BASIC_BEATMAPS_LIST_QUERY_KEY } from '@src/shared/constants/query-keys'

import { getBasicBeatmaps } from '../api-routes'

export const useMyBeatmapList = () => {
  return useQuery({
    queryKey: [BASIC_BEATMAPS_LIST_QUERY_KEY],
    queryFn: () => getBasicBeatmaps(),
  })
}
