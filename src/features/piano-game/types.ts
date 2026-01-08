import { Sprite } from 'pixi.js'

export type JudgePoints = 320 | 300 | 200 | 100 | 50 | 0

export type JudgeWindows = {
  [K in JudgePoints]: number
}

export type NoteHighlight = 'transparent' | 'click' | 'miss' | 'tap'

export interface SVSegment {
  from: number
  to: number
  sv: number
  pxPerMs: number
  cumulativePx: number
}

export interface GameState {
  cols: number
  canvasWidth: number
  canvasHeight: number
  basePixelsPerMs: number
  colWidth: number
  hitLineY: number
  noteHeight: number
  preempt: number
  svTimeline: SVSegment[]
  judgeWindows: JudgeWindows
  hitWindow: number
  registerMiss: () => void
  registerJudge: (value: JudgePoints) => void
}

export interface TapNote {
  type: 'tap'
  column: number
  startTime: number
  sprite: Sprite
  shouldRemove: boolean
  hit: (now: number) => void
  update: (now: number) => void
}

export interface HoldNote {
  type: 'hold'
  column: number
  sprite: Sprite
  headSprite: Sprite
  shouldRemove: boolean
  release: (now: number) => void
  update: (now: number) => void
}

export type GameNote = TapNote | HoldNote
