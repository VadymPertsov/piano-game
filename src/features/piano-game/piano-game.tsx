import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { DOWNLOAD_BEATMAP_QUERY_KEY } from '@src/shared/constants/query-keys'

import { downloadBeatmapById } from './api-route'

export const PianoGame = () => {
  const { beatmapId, version } = useParams<{
    beatmapId: string
    version: string
  }>()

  const { data } = useQuery({
    queryKey: [DOWNLOAD_BEATMAP_QUERY_KEY, { beatmapId }],
    queryFn: () => downloadBeatmapById(Number(beatmapId)),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!beatmapId,
  })

  if (!data) return

  const currentVersion = data.beatmapsSet.filter(b => b.version === version)[0]

  if (!currentVersion) return

  return <div>{currentVersion.version}</div>
}
