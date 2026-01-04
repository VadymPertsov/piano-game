import { useParams } from 'react-router-dom'

import { PianoGame } from '../piano-game'
import { useDownloadBeatmap } from './use-download-beatmap'

export const PreloadGame = () => {
  const { beatmapId = 0, version = '' } = useParams<{
    beatmapId?: string
    version?: string
  }>()

  const { isLoading, parsedData, displayPercent, audioUrl } =
    useDownloadBeatmap(Number(beatmapId), version)

  if (isLoading && !parsedData) {
    return <div>Загрузка: {displayPercent}%</div>
  }

  if (!parsedData) return

  return <PianoGame data={parsedData} audioUrl={audioUrl} />
}
