import axios from 'axios'
import { unzip } from 'fflate'

import { BeatmapFile, PreparedBeatmap } from '@src/shared/types/beatmap'

import { prepareBeatmapData } from './utils/prepare-beatmap-data'

// TODO: add IndexedDB save logic (idb-keyval)
export const downloadBeatmapById = async (
  id: number,
  setDownloadPercent?: (percent: number) => void
): Promise<PreparedBeatmap> => {
  const response = await axios.get(`https://catboy.best/d/${id}?noVideo=true`, {
    responseType: 'arraybuffer',
    onDownloadProgress: progressEvent => {
      if (!setDownloadPercent) return
      const { loaded, total } = progressEvent
      if (total) setDownloadPercent(Math.round((loaded / total) * 100))
    },
  })

  return new Promise((resolve, reject) => {
    unzip(new Uint8Array(response.data), (err, unzipped) => {
      if (err) {
        reject(err)
        return
      }

      const files: BeatmapFile[] = Object.entries(unzipped).map(
        ([name, data]) => ({ name, data })
      )

      const preparedFiles = prepareBeatmapData(files)

      if (!preparedFiles) {
        reject(err)
        return
      }

      resolve(preparedFiles)
    })
  })
}
