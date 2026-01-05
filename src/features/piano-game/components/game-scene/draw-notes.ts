import { Graphics } from 'pixi.js'

import { SIDE_PADDING, GAP } from '../../constants/game'
import { GameConfig, GameState } from '../../stores/game-config-store'
import { ColumnNote } from '../../types/beatmap-data'
import { white } from '../../utils/white-texture'

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
  const {
    canvasHeight,
    colWidth,
    cols,
    hitLineY,
    judgeWindows,
    noteHeight,
    preempt,
  } = config

  const hitWindow = judgeWindows[0]

  for (let col = 0; col < cols; col++) {
    const notes = columnNotes[col]
    const start = columnIndex[col]

    if (!notes || start === undefined) continue

    for (let i = notes.length - 1; i >= start; i--) {
      const note = notes[i]
      if (!note) continue

      if (note.hit && note.endTime === undefined) continue

      const dt = note.startTime - t
      if (dt > preempt) continue

      if (
        (note.endTime !== undefined && t > note.endTime + hitWindow) ||
        (note.endTime === undefined &&
          t > note.startTime + hitWindow &&
          !note.missed)
      )
        continue

      const headY = hitLineY - getDistanceFromHitline(note.startTime, t)
      const x = SIDE_PADDING + note.column * (colWidth + GAP)

      if (note.endTime !== undefined) {
        const tailY = hitLineY - getDistanceFromHitline(note.endTime, t)

        const top = Math.min(headY, tailY)
        const bottom = Math.max(headY, tailY)

        if (bottom < -noteHeight || top > canvasHeight + noteHeight) continue

        drawHoldNote(g, x, headY, top, bottom, colWidth, noteHeight)
      } else {
        if (headY < -noteHeight || headY > canvasHeight + noteHeight) continue

        drawTapNote(g, x, headY, colWidth, noteHeight)
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
  colWidth: number,
  noteHeight: number
) => {
  g.texture(white, 0x555, x, top, colWidth, bottom - top)
  g.texture(white, 0x42a5f5, x, y - noteHeight, colWidth, noteHeight)
}

const drawTapNote = (
  g: Graphics,
  x: number,
  y: number,
  colWidth: number,
  noteHeight: number
) => {
  g.texture(white, 0x42a5f5, x, y - noteHeight, colWidth, noteHeight)
}
