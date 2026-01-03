import { BeatmapFile, PreparedBeatmap } from '@src/shared/types/beatmap'

export const prepareBeatmapData = (
  data: BeatmapFile[]
): PreparedBeatmap | undefined => {
  if (!data || data.length === 0) return

  const decoder = new TextDecoder('utf-8')

  const beatmaps = data.filter(file => file.name.endsWith('.osu'))

  if (!beatmaps || !beatmaps.length) return

  const beatmapsSet = beatmaps.map(b => {
    const decodedData = decoder.decode(b.data)
    const version = decoder.decode(b.data).match(/Version\s*:\s*(.+)/i)

    return {
      data: decodedData,
      version: version && version[1] ? version[1].trim() : '',
    }
  })
  const audioMatch = decoder
    .decode(beatmaps[0]?.data)
    .match(/AudioFilename\s*:\s*(.+)/i) // get AudioFilename from 1st beatmap
  const audioFileName = audioMatch && audioMatch[1] ? audioMatch[1].trim() : ''

  const audioFile = data.find(
    file => file.name.toLowerCase() === audioFileName.toLowerCase()
  )

  if (!audioFile) return

  const blob = new Blob([new Uint8Array(audioFile.data)], {
    type: 'audio/mpeg',
  })
  const audioUrl = URL.createObjectURL(blob)
  console.log('re')

  return {
    beatmapsSet,
    audioUrl,
  }
}
