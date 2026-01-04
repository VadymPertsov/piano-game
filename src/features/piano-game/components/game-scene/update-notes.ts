import { GameConfig } from '../../stores/game-config-store'
import { ColumnNote } from '../../types/beatmap-data'

export const updateNotes = ({
  t,
  config,
  columnIndex,
  columnNotes,
  registerMiss,
}: {
  t: number
  config: GameConfig
  columnNotes: ColumnNote[][]
  columnIndex: number[]
  registerMiss: (note: ColumnNote, isTail?: boolean) => void
}) => {
  const hitWindow = config.judgeWindows[0]

  for (let col = 0; col < config.cols; col++) {
    const index = columnIndex[col] ?? 0
    const note = columnNotes[col]?.[index]

    if (!note) continue

    if (
      !note.hit &&
      !note.holding &&
      !note.missed &&
      t > note.startTime + hitWindow
    ) {
      registerMiss(note)
      note.missed = true
      if (note.endTime === undefined) {
        columnIndex[col] = index + 1
        continue
      }
    }

    if (note.endTime !== undefined) {
      if (t > note.endTime + hitWindow) {
        if (note.hit && !note.tailHit) {
          registerMiss(note, true)
        }

        columnIndex[col] = index + 1
      }
    }
  }
}
