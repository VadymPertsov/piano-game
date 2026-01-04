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

export type JudgePoints = 320 | 300 | 200 | 100 | 50 | 0

export type JudgeWindows = {
  [K in JudgePoints]: number
}

export type NoteHighlight = 'transparent' | 'click' | 'miss' | 'tap'

export type RegisterJudge = Exclude<JudgePoints, 0>

export interface GameResults {
  score: number
  currentCombo: number
  maxCombo: number
  summary: JudgeWindows
}
