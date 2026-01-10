import {
  JudgeWindows,
  RegisterJudge,
  SVSegment,
} from '@src/shared/types/beatmap-prepare'

import { holdNote } from './engine/hold-note'
import { tapNote } from './engine/tap-note'

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
  registerMiss: () => void
  registerJudge: (value: RegisterJudge) => void
}

export type GameNote = ReturnType<typeof tapNote> | ReturnType<typeof holdNote>
