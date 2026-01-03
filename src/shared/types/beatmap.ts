export interface Beatmap {
  title: string
  artist: string
  creator: string
  picture: string // url
  previewAudio: string // url
  beatmapSet: BeatmapsSetItem[]
}

export interface BeatmapsSetItem {
  beatmapsetId: number
  url: string
  version: string
  difficultyRating: number
  maxCombo: number
}

export interface BeatmapFile {
  name: string
  data: Uint8Array
}

export interface PreparedBeatmap {
  beatmapsSet: Array<{
    data: string
    version: string
  }>
  audioUrl: string
}
