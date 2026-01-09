export interface ColumnNote {
  column: number
  startTime: number
  endTime?: number
}

export interface TimingPoints {
  time: number
  beatLength: number
  uninherited: boolean
}

export interface ParsedBeatmapData {
  audioUrl: string
  bgUrl: string
  title: string
  artist: string
  version: string
  settings: {
    audioLeadIn: number
    difficulty: {
      cs: number
      ar: number
      od: number
      sliderMultiplier: number
    }
    editor: {
      distanceSpacing: number
    }
  }
  timings: TimingPoints[]
  columnNotes: ColumnNote[][]
}

export interface ImportedBeatmap {
  title: string
  urlFn: () => Promise<string>
}

export interface ImportedItem {
  title: string
  data: Uint8Array<ArrayBufferLike>
}

export interface ImportedBeatmapSet {
  beatmaps: ImportedItem[]
  audios: ImportedItem[]
  pictures: ImportedItem[]
}

export interface SavedRawBeatmap {
  localTitle: string
  beatmap: Uint8Array<ArrayBufferLike>
  audios: ImportedItem[]
  pictures: ImportedItem[]
}
