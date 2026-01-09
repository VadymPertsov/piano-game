import { extend, useTick } from '@pixi/react'
import { BitmapText, Container, Sprite } from 'pixi.js'
import { useRef } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { DrawColumns, DrawCombo, DrawHitLine, DrawScore } from '../draw-ui'
import { useBuildGame } from './hooks/use-build-game'
import { useInitNotes } from './hooks/use-init-notes'
import { useInputNotes } from './hooks/use-input-notes'
import { updateNotes } from './update-notes'
import { GameNote } from '../../types'

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

export const GameScene = ({
  data,
  canvasHeight,
  canvasWidth,
}: GameSceneProps) => {
  const {
    isGameStart,
    timeRef,
    updateTime,
    gameState,
    columnNotes: dataNotes,
    gameResults,
  } = useBuildGame({
    audioUrl: data.audioUrl,
    config: data,
    canvasHeight,
    canvasWidth,
  })

  const { colWidth, cols, hitLineY, hitWindow } = gameState

  const columnNotesRef = useRef<GameNote[][]>([])

  const comboRef = useRef<BitmapText | null>(null)
  const scoreRef = useRef<BitmapText | null>(null)

  const notesRef = useInitNotes(columnNotesRef, dataNotes, gameState)

  useInputNotes(columnNotesRef, timeRef)

  useTick(() => {
    if (!isGameStart) return

    updateTime()

    const t = timeRef.current

    updateNotes({
      columnNotesRef,
      hitWindow,
      time: t,
    })

    if (
      comboRef.current &&
      comboRef.current.text !== String(gameResults.current.currentCombo)
    ) {
      comboRef.current.text = String(gameResults.current.currentCombo)
    }

    if (
      scoreRef.current &&
      scoreRef.current.text !== String(gameResults.current.score)
    ) {
      scoreRef.current.text = String(gameResults.current.score)
    }
  })

  return (
    <pixiContainer>
      <pixiContainer ref={notesRef} />
      <DrawScore ref={scoreRef} />
      <DrawCombo ref={comboRef} x={canvasWidth / 2} y={canvasHeight / 2} />
      <DrawColumns
        cols={cols}
        canvasHeight={canvasHeight}
        colWidth={colWidth}
      />
      <DrawHitLine canvasWidth={canvasWidth} hitLineY={hitLineY} />
    </pixiContainer>
  )
}
