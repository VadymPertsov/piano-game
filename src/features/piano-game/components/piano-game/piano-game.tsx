import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useCallback } from 'react'

import { useGameSettings } from './use-game-settings'
import { GAP, SIDE_PADDING } from '../../constants/game'
import { useGameConfigStore } from '../../stores/game-config-store'
import { ParsedBeatmapData } from '../../types/beatmap-data'
import { GameScene } from '../game-scene'

import styles from './styles.module.scss'

extend({
  Container,
  Graphics,
})

interface PianoGameProps {
  data: ParsedBeatmapData
  audioUrl?: string
}

export const PianoGame = ({ data, audioUrl }: PianoGameProps) => {
  const { width, height } = useGameSettings(data)

  return (
    <div className={styles.root}>
      <Application
        antialias
        width={width}
        height={height}
        background="rgba(10, 10, 15, 1)"
        backgroundAlpha={0.7}
      >
        <pixiContainer>
          <DrawColumns />
          <DrawHitLine />
          <GameScene audioUrl={audioUrl} />
        </pixiContainer>
      </Application>
    </div>
  )
}

const DrawColumns = () => {
  const { cols, colWidth, canvasHeight } = useGameConfigStore(s => s.config)

  const draw = useCallback(
    (g: Graphics) => {
      g.clear()

      for (let i = 0; i < cols; i++) {
        const x = SIDE_PADDING + i * (colWidth + GAP)

        g.rect(Math.round(x), 0, colWidth, canvasHeight)
        g.fill({ color: 0x333333, alpha: 0.2 })

        g.stroke({ width: 1, color: 0x000000 })
      }
    },
    [canvasHeight, colWidth, cols]
  )
  return <pixiGraphics draw={draw} />
}

const DrawHitLine = () => {
  const { hitLineY, canvasWidth } = useGameConfigStore(s => s.config)

  const draw = useCallback(
    (g: Graphics) => {
      g.clear()

      g.rect(0, hitLineY, canvasWidth, 4)
      g.fill({ color: 0xaaaaaa, alpha: 0.2 })
    },
    [canvasWidth, hitLineY]
  )

  return <pixiGraphics draw={draw} />
}
