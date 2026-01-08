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

export interface ImportedBeatmapSet {
  title: string
  data: Uint8Array<ArrayBufferLike>
}
