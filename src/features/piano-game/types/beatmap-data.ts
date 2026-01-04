export interface ColumnNote {
  column: number
  startTime: number
  hit: boolean
  missed: boolean
  endTime?: number
  tailHit?: boolean
  holding?: boolean
}

export interface TimingPoints {
  time: number
  beatLength: number
  uninherited: boolean
}

export type BeatmapSections =
  | 'Metadata'
  | 'Difficulty'
  | 'General'
  | 'Editor'
  | 'TimingPoints'
  | 'HitObjects'

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

export interface JudgeWindows {
  max: number
  w300: number
  w200: number
  w100: number
  w50: number
  miss: number
}

export interface GameResults {
  score: number
  maxCombo: number
  summary: JudgeWindows
}
