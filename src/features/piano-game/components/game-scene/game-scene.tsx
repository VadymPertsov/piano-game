import { extend, useTick } from '@pixi/react'
import { BitmapText, Container, Sprite } from 'pixi.js'
import { useRef } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { updateNotes } from './update-notes'
import { useBuildGame } from './use-build-game'
import { useInitNotes } from './use-init-notes'
import { useInputNotes } from './use-input-notes'
import { GameNote } from '../../types'
import { DrawColumns, DrawCombo, DrawHitLine, DrawScore } from '../draw-ui'

extend({
  BitmapText,
  Container,
  Sprite,
})

interface GameSceneProps {
  data: ParsedBeatmapData
}

export const GameScene = ({ data }: GameSceneProps) => {
  const {
    isGameStart,
    timeRef,
    updateTime,
    gameState,
    columnNotes: dataNotes,
    gameResults,
  } = useBuildGame({
    audioUrl: 'asda',
    config: data,
  })

  const { canvasHeight, canvasWidth, colWidth, cols, hitLineY, hitWindow } =
    gameState

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
