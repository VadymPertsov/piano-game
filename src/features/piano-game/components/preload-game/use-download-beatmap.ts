import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { DOWNLOAD_BEATMAP_QUERY_KEY } from '@src/shared/constants/query-keys'

import { downloadBeatmapById } from '../../api-route'
import { parseBeatmapData } from '../../utils/parse-beatmap-data'

export const useDownloadBeatmap = (beatmapId: number, version: string) => {
  const [downloadPercent, setDownloadPercent] = useState<number>(0)

  const queryKey = useMemo(
    () => [DOWNLOAD_BEATMAP_QUERY_KEY, beatmapId],
    [beatmapId]
  )

  const { data, isLoading } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: () => downloadBeatmapById(beatmapId, setDownloadPercent),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: beatmapId > 0 && !!version,
  })

  const displayPercent = data ? 100 : downloadPercent

  const currentVersion = data?.beatmapsSet.filter(b => b.version === version)[0]
    ?.data

  const parsedData = parseBeatmapData(currentVersion)

  return {
    isLoading,
    audioUrl: data?.audioUrl,
    displayPercent,
    parsedData,
  }
}
