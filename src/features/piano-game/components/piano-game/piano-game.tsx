import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import { useCallback } from 'react'

import { useGameSettings } from './use-game-settings'
import { GAP, SIDE_PADDING } from '../../constants/game'
import { useGameConfigStore } from '../../stores/game-config-store'
import { ParsedBeatmapData } from '../../types/beatmap-data'
import { white } from '../../utils/white-texture'
import { GameScene } from '../game-scene'

import styles from './styles.module.scss'

extend({
  Container,
  Graphics,
})

interface PianoGameProps {
  data: ParsedBeatmapData
  audioUrl: string
}

export const PianoGame = ({ data, audioUrl }: PianoGameProps) => {
  const { width, height } = useGameSettings(data, audioUrl)

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
          <GameScene />
        </pixiContainer>
      </Application>
    </div>
  )
}

const DrawColumns = () => {
  const { cols, colWidth, canvasHeight } = useGameConfigStore(s => s.config)

  const draw = useCallback(
    (g: Graphics) => {
      // g.clear()

      for (let i = 0; i < cols - 1; i++) {
        const x = SIDE_PADDING + i * (colWidth + GAP)

        g.alpha = 0.1
        g.texture(white, 0x000000, x + colWidth - 1, 0, 1, canvasHeight)
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
      // g.clear()

      g.texture(white, 0xaaaaaa, 0, hitLineY, canvasWidth, 4)
    },
    [canvasWidth, hitLineY]
  )

  return <pixiGraphics draw={draw} />
}
