import { extend, useTick } from '@pixi/react'
import { BitmapText, Container, Sprite } from 'pixi.js'
import { useRef, useEffect, useCallback } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { createGame } from './core/game'
import {
  DrawScore,
  DrawCombo,
  DrawJudge,
  DrawColumns,
  DrawHitLine,
} from './draw-ui'
import { useGameConfig } from './hooks/use-game-config'
import { holdNote } from './notes/hold-note'
import { tapNote } from './notes/tap-note'
import { GameNote } from './types'
import { SIDE_PADDING, GAP } from './utils/game-constants'
import { HighlightView, highlightView } from './view/highlight-view'

extend({
  BitmapText,
  Container,
  Sprite,
})

interface GameSceneProps {
  data: ParsedBeatmapData
  canvasHeight: number
  canvasWidth: number
}

export const GameLoop = ({
  data,
  canvasHeight,
  canvasWidth,
}: GameSceneProps) => {
  const gameConfig = useGameConfig({ data, canvasHeight, canvasWidth })

  const stageNotesRef = useRef<Container>(null)
  const gameRef = useRef<ReturnType<typeof createGame> | null>(null)

  const comboRef = useRef<BitmapText | null>(null)
  const scoreRef = useRef<BitmapText | null>(null)
  const judgeRef = useRef<BitmapText | null>(null)

  const stageHighlightRef = useRef<Container>(null)
  const highlightRefs = useRef<HighlightView[]>([])

  useEffect(() => {
    const stage = stageHighlightRef.current
    if (!stage) return

    stage.removeChildren()
    highlightRefs.current = []

    for (let i = 0; i < gameConfig.cols; i++) {
      const highlight = highlightView(gameConfig)
      highlight.view.x = SIDE_PADDING + i * (gameConfig.colWidth + GAP)
      highlight.view.y = gameConfig.hitLineY
      stage.addChild(highlight.view)
      highlightRefs.current.push(highlight)
    }
  }, [gameConfig])

  const generateNotes = useCallback((): GameNote[][] => {
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
                highlightRefs.current?.[noteData.column]
              )
            : tapNote(
                gameConfig,
                {
                  column: noteData.column,
                  startTime: noteData.startTime,
                },
                highlightRefs.current?.[noteData.column]
              )

        stage.addChild(note.view)
        return note
      })
    )
  }, [data.columnNotes, gameConfig])

  useEffect(() => {
    gameRef.current = createGame(
      generateNotes,
      data.settings.audioLeadIn,
      data.audioUrl
    )

    return () => {
      gameRef.current = null
    }
  }, [data.audioUrl, data.settings.audioLeadIn, generateNotes])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!gameRef.current) return

      const key = e.key.toLowerCase()

      if (key === 'g') {
        console.log('Game Started')
        gameRef.current.start()
      }

      if (key === 't') {
        console.log('Game Restarted')
        gameRef.current.restart()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const keyMap: Record<string, number> = {
      d: 0,
      f: 1,
      j: 2,
      k: 3,
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const col = keyMap[e.key.toLowerCase()]
      if (col !== undefined && gameRef.current) {
        gameRef.current.hit(col)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.repeat) return
      const col = keyMap[e.key.toLowerCase()]
      if (col !== undefined && gameRef.current) {
        gameRef.current.release(col)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const lastVisualUpdate = useRef<number>(0)

  const colors: Record<number, number> = {
    320: 0xffcc00,
    300: 0xffff00,
    0: 0xff0000,
  }

  useTick(() => {
    if (!gameRef.current || !gameRef.current.playing) return

    gameRef.current.update()
    console.log('asd')

    if (
      comboRef.current &&
      comboRef.current.text !== String(gameRef.current?.summary.currentCombo)
    ) {
      comboRef.current.text = String(gameRef.current?.summary.currentCombo)
    }

    if (
      scoreRef.current &&
      scoreRef.current.text !== String(gameRef.current?.summary.score)
    ) {
      scoreRef.current.text = String(gameRef.current?.summary.score)
    }

    if (judgeRef.current && gameRef.current?.summary) {
      const summary = gameRef.current.summary

      if (summary.lastUpdate !== lastVisualUpdate.current) {
        lastVisualUpdate.current = summary.lastUpdate

        const value = summary.currentJudge
        judgeRef.current.text = value === 0 ? 'MISS' : String(value)
        judgeRef.current.style.fill = colors[value ?? -1] || 0xffffff

        judgeRef.current.visible = true
        judgeRef.current.alpha = 1
        judgeRef.current.scale.set(1.5)
      }

      if (judgeRef.current.visible) {
        judgeRef.current.alpha = Math.max(0, judgeRef.current.alpha - 0.04)
        const scale = Math.max(1, judgeRef.current.scale.x - 0.03)
        judgeRef.current.scale.set(scale)

        if (judgeRef.current.alpha <= 0) {
          judgeRef.current.visible = false
        }
      }
    }
  })

  return (
    <pixiContainer>
      <pixiContainer ref={stageNotesRef} />
      <pixiContainer ref={stageHighlightRef} />
      <pixiContainer>
        <DrawScore ref={scoreRef} />
        <DrawCombo ref={comboRef} x={canvasWidth / 2} y={canvasHeight / 2} />
        <DrawJudge
          ref={judgeRef}
          x={canvasWidth / 2}
          y={canvasHeight / 2 + 50}
        />
        <DrawColumns
          cols={gameConfig.cols}
          canvasHeight={canvasHeight}
          colWidth={gameConfig.colWidth}
        />
        <DrawHitLine canvasWidth={canvasWidth} hitLineY={gameConfig.hitLineY} />
      </pixiContainer>
    </pixiContainer>
  )
}
