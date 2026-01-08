import { GAP, SIDE_PADDING } from '../../game-constants'
import { WHITE } from '../../utils/white-texture'

interface DrawColumnsProps {
  cols: number
  colWidth: number
  canvasHeight: number
}

export const DrawColumns = ({
  canvasHeight,
  colWidth,
  cols,
}: DrawColumnsProps) => {
  return (
    <>
      {Array.from({ length: cols - 1 }).map((_, index) => {
        const x = SIDE_PADDING + index * (colWidth + GAP)
        return (
          <pixiSprite
            key={index}
            texture={WHITE}
            x={x + colWidth - 1}
            y={0}
            width={1}
            height={canvasHeight}
            tint={0xffffff}
            alpha={0.1}
          />
        )
      })}
    </>
  )
}
