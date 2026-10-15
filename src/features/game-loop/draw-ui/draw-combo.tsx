import { BitmapText } from 'pixi.js'
import { forwardRef } from 'react'

interface DrawComboProps {
  x?: number
  y?: number
}

export const DrawCombo = forwardRef<BitmapText, DrawComboProps>(
  ({ x = 0, y = 0 }, ref) => {
    return (
      <pixiBitmapText
        ref={ref}
        text="0"
        x={x}
        y={y}
        anchor={0.5}
        style={{
          fill: 0xdddddd,
          fontSize: 30,
          fontWeight: '800',
        }}
        zIndex={99}
      />
    )
  }
)
