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
