import { SavedRawBeatmap } from '@src/shared/types/beatmap-prepare'

export const prepareBeatmapData = (rawText: SavedRawBeatmap) => {
  const decoder = new TextDecoder('utf-8')

  const rawBeatmap = decoder.decode(rawText.beatmap)

  const { audio, picture } = extractResources(rawBeatmap)

  const audioFile = rawText.audios.find(a => a.title === audio)
  const bgFile = rawText.pictures.find(p => p.title === picture)

  const audioUrl = uint8ToBlobUrl(audioFile!.data, 'audio/mpeg')
  const bgUrl = uint8ToBlobUrl(bgFile!.data, 'image/jpeg')

  return {
    rawBeatmap,
    audioUrl,
    bgUrl,
  }
}

const uint8ToBlobUrl = (
  data: Uint8Array<ArrayBufferLike>,
  mime: string
): string => {
  const blob = new Blob([new Uint8Array(data)], { type: mime })
  return URL.createObjectURL(blob)
}

const extractResources = (
  rawText: string
): { audio: string; picture: string } => {
  let audio: string | undefined
  let picture: string | undefined

  for (const line of rawText.split('\n')) {
    if (line) {
      if (line.startsWith('AudioFilename:')) {
        audio = line.split(':')[1]?.trim()
      }

      if (line.startsWith('0,0,"')) {
        picture = line.split('"')[1]
      }
    }
  }

  return { audio: audio ?? '', picture: picture ?? '' }
}
