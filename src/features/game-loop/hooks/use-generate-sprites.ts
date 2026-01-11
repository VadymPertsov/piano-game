import { Container } from 'pixi.js'
import { useRef, useEffect, useCallback, RefObject } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { createGame, GameReturn } from '../core/game'
import { holdNote } from '../notes/hold-note'
import { tapNote } from '../notes/tap-note'
import { GameState } from '../types'
import { SIDE_PADDING, GAP } from '../utils/game-constants'
import { HighlightView, highlightView } from '../view/highlight-view'

export const useGenerateSprites = (
  gameConfig: GameState,
  data: ParsedBeatmapData,
  gameRef: RefObject<GameReturn>
) => {
  // Highlights
  const stageHighlightRef = useRef<Container | null>(null)
  const highlightRef = useRef<HighlightView[]>([])

  const generateHighlights = useCallback(() => {
    const stage = stageHighlightRef.current
    if (!stage) return []

    stage.removeChildren()

    for (let i = 0; i < gameConfig.cols; i++) {
      const highlight = highlightView(gameConfig)
      highlight.view.x = SIDE_PADDING + i * (gameConfig.colWidth + GAP)
      highlight.view.y = gameConfig.hitLineY
      stage.addChild(highlight.view)
      highlightRef.current.push(highlight)
    }
  }, [gameConfig])

  // Notes
  const stageNotesRef = useRef<Container | null>(null)

  const generateNotes = useCallback(() => {
    const stage = stageNotesRef.current
    if (!stage) return []

    stage.removeChildren()

    return data.columnNotes.map(col =>
      col.map(noteData => {
        const note =
          noteData.endTime !== undefined
            ? holdNote(
                gameConfig,
                {
                  column: noteData.column,
                  startTime: noteData.startTime,
                  endTime: noteData.endTime,
                },
                highlightRef.current?.[noteData.column]
              )
            : tapNote(
                gameConfig,
                {
                  column: noteData.column,
                  startTime: noteData.startTime,
                },
                highlightRef.current?.[noteData.column]
              )

        stage.addChild(note.view)
        return note
      })
    )
  }, [data.columnNotes, gameConfig])

  useEffect(() => {
    generateHighlights()

    gameRef.current = createGame(
      generateNotes,
      data.settings.audioLeadIn,
      data.audioUrl
    )

    return () => {
      gameRef.current = null
      highlightRef.current = []
    }
  }, [
    data.audioUrl,
    data.settings.audioLeadIn,
    gameRef,
    generateHighlights,
    generateNotes,
  ])

  return {
    stageHighlightRef,
    stageNotesRef,
  }
}
