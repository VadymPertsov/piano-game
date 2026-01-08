import { WHITE } from '../../utils/white-texture'

interface DrawHitLineProps {
  canvasWidth: number
  hitLineY: number
}

export const DrawHitLine = ({ canvasWidth, hitLineY }: DrawHitLineProps) => (
  <pixiSprite
    texture={WHITE}
    x={0}
    y={hitLineY}
    width={canvasWidth}
    height={2}
    tint={0xff0000}
    alpha={0.5}
  />
)
