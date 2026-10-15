import { JudgeWindows, SVSegment } from '@src/shared/types/beatmap-prepare'

import { holdNote } from './notes/hold-note'
import { tapNote } from './notes/tap-note'

export interface GameState {
  cols: number
  basePixelsPerMs: number
  colWidth: number
  hitLineY: number
  noteHeight: number
  preempt: number
  svTimeline: SVSegment[]
  judgeWindows: JudgeWindows
  hitWindow: number
  canvasHeight: number
  canvasWidth: number
}

export type GameNote = ReturnType<typeof tapNote> | ReturnType<typeof holdNote>
