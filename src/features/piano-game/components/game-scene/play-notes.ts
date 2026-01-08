import { RefObject } from 'react'

import { ColumnNote } from '@src/shared/types/beatmap-prepare'

import { JudgeWindows, NoteHighlight, RegisterJudge } from '../../types'
import { getJudgement } from '../../utils/game-math'

export const pressNote = ({
  activeHold,
  column,
  columnHighlight,
  columnIndex,
  columnNotes,
  judgeWindows,
  registerJudge,
  registerMiss,
  timeRef,
}: {
  column: number
  activeHold: (ColumnNote | null)[]
  columnNotes: ColumnNote[][]
  columnIndex: number[]
  columnHighlight: NoteHighlight[]
  judgeWindows: JudgeWindows
  timeRef: RefObject<number>
  registerMiss: (note: ColumnNote, isTail?: boolean) => void
  registerJudge: (value: RegisterJudge) => void
}) => {
  if (activeHold[column]) return

  const index = columnIndex[column] ?? 0
  const note = columnNotes[column]?.[index]

  if (!note) {
    columnHighlight[column] = 'click'
    return
  }

  const delta = timeRef.current - note.startTime
  const hitWindow = judgeWindows[0]

  if (delta < -hitWindow) {
    columnHighlight[column] = 'click'
    return
  }

  if (delta > hitWindow) {
    registerMiss(note)
    note.missed = true
    columnHighlight[column] = 'miss'

    if (note.endTime === undefined) {
      columnIndex[column] = index + 1
    }

    return
  }

  const judge = getJudgement(delta, judgeWindows)
  if (judge === 0) {
    registerMiss(note)
    note.missed = true
    columnHighlight[column] = 'miss'

    if (note.endTime === undefined) {
      columnIndex[column] = index + 1
    }
    return
  }

  note.hit = true
  registerJudge(judge)
  columnHighlight[column] = 'tap'

  if (note.endTime !== undefined) {
    note.holding = true
    activeHold[column] = note
  } else {
    columnIndex[column] = index + 1
  }
}

export const releaseNote = ({
  activeHold,
  column,
  judgeWindows,
  registerJudge,
  registerMiss,
  timeRef,
}: {
  column: number
  activeHold: (ColumnNote | null)[]
  judgeWindows: JudgeWindows
  timeRef: RefObject<number>
  registerMiss: (note: ColumnNote, isTail?: boolean) => void
  registerJudge: (value: RegisterJudge) => void
}) => {
  const note = activeHold[column]

  if (!note || note.endTime === undefined) return

  note.holding = false
  activeHold[column] = null

  const delta = timeRef.current - note.endTime
  const hitWindow = judgeWindows[0]

  if (Math.abs(delta) > hitWindow) {
    registerMiss(note, true)
  } else {
    const judge = getJudgement(delta, judgeWindows)
    if (judge !== 0) {
      registerJudge(judge)
      note.tailHit = true
    } else {
      registerMiss(note, true)
    }
  }
}
