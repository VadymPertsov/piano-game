import { BitmapText } from 'pixi.js'
import { forwardRef } from 'react'

interface HitScoreProps {
  x: number
  y: number
  color?: number
}

export const DrawJudge = forwardRef<BitmapText, HitScoreProps>(
  ({ x, y, color = 0xffffff }, ref) => {
    return (
      <pixiBitmapText
        ref={ref}
        text=""
        x={x}
        y={y}
        anchor={0.5}
        style={{
          fill: color,
          fontSize: 24,
          fontWeight: '700',
        }}
        zIndex={99}
      />
    )
  }
)
