import { useParams } from 'react-router-dom'

import { useDownloadBeatmap } from '../hooks/use-download-beatmap'

export const PianoGame = () => {
  const { beatmapId = 0, version = '' } = useParams<{
    beatmapId?: string
    version?: string
  }>()

  const { isLoading, parsedData, displayPercent } = useDownloadBeatmap(
    Number(beatmapId),
    version
  )

  if (isLoading && !parsedData) {
    return <div>Загрузка: {displayPercent}%</div>
  }

  return <div>{parsedData?.version}</div>
}
