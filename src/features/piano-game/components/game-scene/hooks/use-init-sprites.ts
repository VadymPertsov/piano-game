import { Container, Sprite } from 'pixi.js'
import { RefObject, useEffect, useRef } from 'react'

import { ColumnNote } from '@src/shared/types/beatmap-prepare'

import { holdNote } from '../hold-note'
import { tapNote } from '../tap-note'
import { GameState, GameNote } from '../types'

export const useInitSprites = (
  dataNotes: ColumnNote[][],
  gameState: GameState,
  highlightsRef: RefObject<Container<Sprite> | null>
) => {
  const columnNotesRef = useRef<GameNote[][]>([])
  const notesContainerRef = useRef<Container>(null)

  useEffect(() => {
    const stage = notesContainerRef.current
    if (!stage) return

    stage.removeChildren()
    columnNotesRef.current = []

    if (dataNotes.length === 0) return

    columnNotesRef.current = dataNotes.map(col =>
      col.map(noteData => {
        const note =
          noteData.endTime !== undefined
            ? holdNote(
                gameState,
                {
                  column: noteData.column,
                  startTime: noteData.startTime,
                  endTime: noteData.endTime,
                },
                highlightsRef.current?.children[noteData.column]
              )
            : tapNote(
                gameState,
                {
                  column: noteData.column,
                  startTime: noteData.startTime,
                },
                highlightsRef.current?.children[noteData.column]
              )

        stage.addChild(note.sprite)
        if ('headSprite' in note) {
          stage.addChild(note.headSprite)
        }
        return note
      })
    )
  }, [dataNotes, columnNotesRef, gameState, highlightsRef])

  return {
    notesContainerRef,
    columnNotesRef,
  }
}
