import { Container, Sprite } from 'pixi.js'
import { useEffect, useRef } from 'react'

import { SIDE_PADDING, GAP } from '@src/features/piano-game/game-constants'
import { WHITE } from '@src/features/piano-game/utils/white-texture'
import { ColumnNote } from '@src/shared/types/beatmap-prepare'

import { holdNote } from '../hold-note'
import { tapNote } from '../tap-note'
import { GameState, GameNote } from '../types'

export const useInitSprites = (
  dataNotes: ColumnNote[][],
  gameState: GameState,
  canvasHeight: number
) => {
  const columnNotesRef = useRef<GameNote[][]>([])
  const notesContainerRef = useRef<Container | null>(null)

  const highlightsContainerRef = useRef<Container<Sprite> | null>(null)

  useEffect(() => {
    const stage = highlightsContainerRef.current
    if (!stage) return

    stage.removeChildren()

    if (dataNotes.length === 0) return

    for (let i = 0; i < dataNotes.length; i++) {
      const sprite = Sprite.from(WHITE)
      sprite.width = gameState.colWidth
      sprite.height = canvasHeight - gameState.hitLineY
      sprite.tint = 0xffffff
      sprite.alpha = 0.4
      sprite.zIndex = 2
      sprite.x = SIDE_PADDING + i * (gameState.colWidth + GAP)
      sprite.y = gameState.hitLineY

      stage.addChild(sprite)
    }
  }, [
    canvasHeight,
    dataNotes.length,
    gameState.colWidth,
    gameState.hitLineY,
    gameState.noteHeight,
  ])

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
                highlightsContainerRef.current?.children[noteData.column]
              )
            : tapNote(
                gameState,
                {
                  column: noteData.column,
                  startTime: noteData.startTime,
                },
                highlightsContainerRef.current?.children[noteData.column]
              )

        stage.addChild(note.view)
        return note
      })
    )
  }, [dataNotes, gameState])

  return {
    notesContainerRef,
    columnNotesRef,
    highlightsContainerRef,
  }
}
