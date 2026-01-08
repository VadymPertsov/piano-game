import { RefObject, useCallback, useEffect } from 'react'

import { KEYS } from '@src/features/piano-game/game-constants'
import { GameNote } from '@src/features/piano-game/types'

export const useInputNotes = (
  columnNotesRef: RefObject<GameNote[][]>,
  timeRef: RefObject<number>
) => {
  const pressNote = useCallback((notes: GameNote[], now: number) => {
    if (!notes || notes.length === 0) return

    const note = notes[0]
    if (!note) return

    if ('hit' in note) {
      note.hit(now)
    }
  }, [])

  const releaseNote = useCallback((notes: GameNote[], now: number) => {
    if (!notes || notes.length === 0) return

    const note = notes[0]
    if (!note) return

    if ('release' in note) {
      note.release(now)
    }
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const col = KEYS.indexOf(e.key)
      if (col === -1 || !columnNotesRef.current[col]) return

      pressNote(columnNotesRef.current[col], timeRef.current)
    }

    const up = (e: KeyboardEvent) => {
      const col = KEYS.indexOf(e.key)
      if (col === -1 || !columnNotesRef.current[col]) return

      releaseNote(columnNotesRef.current[col], timeRef.current)
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [columnNotesRef, pressNote, releaseNote, timeRef])
}
