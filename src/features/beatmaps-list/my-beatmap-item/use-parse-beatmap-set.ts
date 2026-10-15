import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { unzipSync } from 'fflate'

import { BEATMAP_SET_QUERY_KEY } from '@src/shared/constants/query-keys'
import {
  ImportedBeatmap,
  ImportedBeatmapSet,
  ImportedItem,
} from '@src/shared/types/beatmap-prepare'

const audioFormats = ['.mp3', '.ogg', '.wav', '.flac', '.aac']
const imageFormats = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp']

export const useParseBeatmapSet = ({ title, urlFn }: ImportedBeatmap) => {
  return useQuery({
    queryKey: [BEATMAP_SET_QUERY_KEY, { title }],
    queryFn: async (): Promise<ImportedBeatmapSet> => {
      const url = await urlFn()
      const response = await axios(url, { responseType: 'arraybuffer' })
      const buffer = new Uint8Array(response.data)

      const files = unzipSync(buffer)

      const beatmaps: ImportedItem[] = []
      const audios: ImportedItem[] = []
      const pictures: ImportedItem[] = []

      for (const [fileName, data] of Object.entries(files)) {
        const lower = fileName.toLowerCase()

        if (lower.endsWith('.osu')) {
          beatmaps.push({ title: fileName.replace('.osu', ''), data })
        } else if (audioFormats.some(ext => lower.endsWith(ext))) {
          audios.push({ title: fileName, data })
        } else if (imageFormats.some(ext => lower.endsWith(ext))) {
          pictures.push({ title: fileName, data })
        }
      }

      return {
        beatmaps,
        audios,
        pictures,
      }
    },
  })
}
