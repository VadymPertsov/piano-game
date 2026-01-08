export type JudgePoints = 320 | 300 | 200 | 100 | 50 | 0

export type JudgeWindows = {
  [K in JudgePoints]: number
}

export type RegisterJudge = Exclude<JudgePoints, 0>

export type NoteHighlight = 'transparent' | 'click' | 'miss' | 'tap'

export interface SVSegment {
  from: number
  to: number
  sv: number
  pxPerMs: number
  cumulativePx: number
}
