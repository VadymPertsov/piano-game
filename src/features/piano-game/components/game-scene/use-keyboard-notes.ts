import { useMemo, useEffect, RefObject } from 'react'

import { pressNote, releaseNote } from './play-notes'
import {
  ColumnNote,
  NoteHighlight,
  JudgeWindows,
  JudgePoints,
  RegisterJudge,
} from '../../types/beatmap-data'

export const useKeyboardNotes = ({
  activeHold,
  columnHighlight,
  columnIndex,
  columnNotes,
  judgeWindows,
  timeRef,
  getJudgement,
  registerJudge,
  registerMiss,
  keys = ['d', 'f', 'j', 'k'],
}: {
  activeHold: (ColumnNote | null)[]
  columnHighlight: NoteHighlight[]
  columnNotes: ColumnNote[][]
  columnIndex: number[]
  judgeWindows: JudgeWindows
  timeRef: RefObject<number>
  getJudgement: (delta: number) => JudgePoints
  registerJudge: (value: RegisterJudge) => void
  registerMiss: (note: ColumnNote, isTail?: boolean) => void
  keys?: string[]
}) => {
  const memoizedKeys = useMemo(() => keys, [keys])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return

      const col = memoizedKeys.indexOf(e.key.toLowerCase())
      if (col === -1) return

      pressNote({
        activeHold,
        column: col,
        columnHighlight,
        columnIndex,
        columnNotes,
        judgeWindows,
        getJudgement,
        registerJudge,
        registerMiss,
        currentTime: timeRef.current,
      })
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const col = memoizedKeys.indexOf(e.key.toLowerCase())
      if (col === -1) return

      releaseNote({
        activeHold,
        column: col,
        judgeWindows,
        getJudgement,
        registerJudge,
        registerMiss,
        currentTime: timeRef.current,
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    activeHold,
    columnHighlight,
    columnIndex,
    columnNotes,
    getJudgement,
    judgeWindows,
    memoizedKeys,
    registerJudge,
    registerMiss,
    timeRef,
  ])
}
