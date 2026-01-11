import { extend, useTick } from '@pixi/react'
import { BitmapText, Container, Sprite } from 'pixi.js'
import { useRef } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { GameReturn } from './core/game'
import {
  DrawScore,
  DrawCombo,
  DrawJudge,
  DrawColumns,
  DrawHitLine,
} from './draw-ui'
import { useControls } from './hooks/use-controls'
import { useGameConfig } from './hooks/use-game-config'
import { useGenerateSprites } from './hooks/use-generate-sprites'
import { updateCombo, updateScore, updateJudge } from './update-ui'

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
  const gameRef = useRef<GameReturn>(null)

  const gameConfig = useGameConfig({ data, canvasHeight, canvasWidth })

  const comboRef = useRef<BitmapText | null>(null)
  const scoreRef = useRef<BitmapText | null>(null)
  const judgeRef = useRef<BitmapText | null>(null)

  const lastVisualUpdate = useRef<number>(0)

  const { stageHighlightRef, stageNotesRef } = useGenerateSprites(
    gameConfig,
    data,
    gameRef
  )

  useControls(gameRef)

  useTick(() => {
    if (!gameRef.current || !gameRef.current.playing) return

    gameRef.current.update()
    console.log('asd')

    if (!gameRef.current.judge.summary) return

    updateCombo(comboRef, gameRef.current.judge.currentCombo)
    updateScore(scoreRef, gameRef.current.judge.score)
    updateJudge(judgeRef, gameRef.current.judge, lastVisualUpdate)
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
