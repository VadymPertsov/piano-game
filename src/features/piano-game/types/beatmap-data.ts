export interface ColumnNotes {
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
