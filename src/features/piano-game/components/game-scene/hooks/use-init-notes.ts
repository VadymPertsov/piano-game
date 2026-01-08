import { Container } from 'pixi.js'
import { RefObject, useEffect, useRef } from 'react'

import { GameNote, GameState } from '@src/features/piano-game/types'
import { ColumnNote } from '@src/shared/types/beatmap-prepare'

import { holdNote } from '../hold-note'
import { tapNote } from '../tap-note'

export const useInitNotes = (
  columnNotesRef: RefObject<GameNote[][]>,
  dataNotes: ColumnNote[][],
  gameState: GameState
) => {
  const notesRef = useRef<Container>(null)

  useEffect(() => {
    const stage = notesRef.current
    if (!stage) return

    stage.removeChildren()
    columnNotesRef.current = []

    if (dataNotes.length === 0) return

    columnNotesRef.current = dataNotes.map(col =>
      col.map(noteData => {
        const note =
          noteData.endTime !== undefined
            ? holdNote(gameState, {
                column: noteData.column,
                startTime: noteData.startTime,
                endTime: noteData.endTime,
              })
            : tapNote(gameState, {
                column: noteData.column,
                startTime: noteData.startTime,
              })

        stage.addChild(note.sprite)
        if ('headSprite' in note) {
          stage.addChild(note.headSprite)
        }
        return note
      })
    )
  }, [dataNotes, columnNotesRef, gameState])

  return notesRef
}
