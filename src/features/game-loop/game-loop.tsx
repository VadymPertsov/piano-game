import { extend, useTick } from '@pixi/react'
import { BitmapText, Container, Graphics, Sprite } from 'pixi.js'
import { useRef, useState } from 'react'

import {
  JudgePoints,
  ParsedBeatmapData,
} from '@src/shared/types/beatmap-prepare'

import { GameReturn } from './core/game'
import { JudgeReturn } from './core/judge'
import { DrawScore, DrawCombo, DrawJudge, DrawColumns } from './draw-ui'
import { useControls } from './hooks/use-controls'
import { useGameConfig } from './hooks/use-game-config'
import { useGenerateSprites } from './hooks/use-generate-sprites'
import { updateCombo, updateScore, updateJudge } from './update-ui'
import { HIT_COLORS } from './utils/game-constants'

extend({
  BitmapText,
  Container,
  Sprite,
  Graphics,
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

  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [finalSummary, setFinalSummary] = useState<JudgeReturn['judge'] | null>(
    null
  )

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

    if (!gameRef.current.judge.summary) return

    updateCombo(comboRef, gameRef.current.judge.currentCombo)
    updateScore(scoreRef, gameRef.current.judge.score)
    updateJudge(judgeRef, gameRef.current.judge, lastVisualUpdate)

    if (gameRef.current.finished) {
      setIsFinished(true)
      setFinalSummary({ ...gameRef.current.judge })
    }
  })
  console.log(isFinished)

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
        {/* <DrawHitLine canvasWidth={canvasWidth} hitLineY={gameConfig.hitLineY} /> */}
      </pixiContainer>
      {isFinished && finalSummary && (
        <pixiContainer
          width={canvasWidth}
          height={canvasHeight}
          sortableChildren
        >
          <pixiGraphics
            draw={g => {
              g.clear()
              g.fill({ color: 0x000000, alpha: 0.8 })
              g.rect(0, 0, canvasWidth, canvasHeight)
              g.fill()
            }}
            zIndex={99}
          />
          {Object.keys(finalSummary).map(key => {
            switch (key) {
              case 'score':
                return (
                  <pixiBitmapText
                    key={key}
                    ref={scoreRef}
                    x={canvasWidth / 2}
                    y={50}
                    anchor={0.5}
                    style={{
                      fill: 0x00ff00,
                      fontSize: 30,
                      fontWeight: '800',
                    }}
                    text={`Score: ${finalSummary?.score}`}
                    zIndex={100}
                  />
                )
              case 'summary':
                return Object.entries(HIT_COLORS)
                  .reverse()
                  .map(([judge, color], index) => (
                    <pixiBitmapText
                      key={judge}
                      x={canvasWidth / 2}
                      y={50 * index + 100}
                      anchor={0.5}
                      style={{
                        fill: color,
                        fontSize: 24,
                        fontWeight: '800',
                      }}
                      text={
                        judge === '0'
                          ? `Misses: ${finalSummary.summary[0]}`
                          : `${judge}: ${finalSummary.summary[Number(judge) as JudgePoints]}`
                      }
                      zIndex={100}
                    />
                  ))
            }
          })}
        </pixiContainer>
      )}
    </pixiContainer>
  )
}
