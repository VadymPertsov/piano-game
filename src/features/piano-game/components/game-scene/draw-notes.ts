import { Graphics } from 'pixi.js'

import { SIDE_PADDING, GAP } from '../../constants/game'
import { GameConfig, GameState } from '../../stores/game-config-store'
import { ColumnNote } from '../../types/beatmap-data'

export const drawNotes = ({
  g,
  t,
  config,
  columnIndex,
  columnNotes,
  getDistanceFromHitline,
}: {
  g: Graphics
  t: number
  config: GameConfig
  columnNotes: ColumnNote[][]
  columnIndex: number[]
  getDistanceFromHitline: GameState['getDistanceFromHitline']
}) => {
  for (let col = 0; col < config.cols; col++) {
    const notes = columnNotes[col]
    const start = columnIndex[col]

    if (!notes || start === undefined) continue

    for (let i = notes.length - 1; i >= start; i--) {
      const note = notes[i]
      if (!note) continue

      const timeDiff = note.startTime - t
      if (timeDiff > config.preempt) continue

      const exitTime = note.endTime ?? note.startTime
      if (exitTime < t - 300) continue

      const headOffset = getDistanceFromHitline(note.startTime, t)
      const headY = config.hitLineY - headOffset

      const x = SIDE_PADDING + note.column * (config.colWidth + GAP)

      const noteParams = {
        colWidth: config.colWidth,
        noteHeight: config.noteHeight,
      }

      if (note.endTime) {
        const tailOffset = getDistanceFromHitline(note.endTime, t)

        const tailY = config.hitLineY - tailOffset

        const top = Math.min(headY, tailY)
        const bottom = Math.max(headY, tailY)

        if (
          bottom < -config.noteHeight ||
          top > config.canvasHeight + config.noteHeight
        )
          continue

        drawHoldNote(g, x, headY, top, bottom, noteParams)
      } else {
        if (
          headY < -config.noteHeight ||
          headY > config.canvasHeight + config.noteHeight
        )
          continue

        drawTapNote(g, x, headY, noteParams)
      }
    }
  }
}

const drawHoldNote = (
  g: Graphics,
  x: number,
  y: number,
  top: number,
  bottom: number,
  config: Pick<GameConfig, 'colWidth' | 'noteHeight'>
) => {
  g.rect(x, top, config.colWidth, bottom - top)
  g.fill({ color: 0x42a5f5, alpha: 0.6 })

  g.rect(x, y - config.noteHeight, config.colWidth, config.noteHeight)
  g.fill({ color: 0x555 })
}

const drawTapNote = (
  g: Graphics,
  x: number,
  y: number,
  config: Pick<GameConfig, 'colWidth' | 'noteHeight'>
) => {
  g.rect(x, y - config.noteHeight, config.colWidth, config.noteHeight)
  g.fill({ color: 0x42a5f5 })
}
