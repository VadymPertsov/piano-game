import { BitmapText } from 'pixi.js'
import { forwardRef } from 'react'

interface DrawScoreProps {
  x?: number
  y?: number
  initialText?: string
}

export const DrawScore = forwardRef<BitmapText, DrawScoreProps>(
  ({ x = 10, y = 0, initialText = '0' }, ref) => {
    return (
      <pixiBitmapText
        ref={ref}
        text={initialText}
        x={x}
        y={y}
        style={{
          fill: 0xdddddd,
          fontSize: 50,
          dropShadow: {
            alpha: 0.8,
            angle: 0,
            blur: 5,
            color: 0x000000,
            distance: 0,
          },
        }}
        zIndex={99}
      />
    )
  }
)
