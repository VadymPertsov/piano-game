import { GAP, SIDE_PADDING } from '../../game-constants'
import { WHITE } from '../../utils/white-texture'

interface DrawHighlightsProps {
  index: number
  colWidth: number
  noteHeight: number
  hitLineY: number
}

export const DrawHighlights = ({
  colWidth,
  index,
  hitLineY,
  noteHeight,
}: DrawHighlightsProps) => (
  <pixiSprite
    texture={WHITE}
    width={colWidth}
    height={noteHeight}
    tint={0xffffff}
    alpha={0.1}
    zIndex={2}
    x={SIDE_PADDING + index * (colWidth + GAP)}
    y={hitLineY - noteHeight}
  />
)
