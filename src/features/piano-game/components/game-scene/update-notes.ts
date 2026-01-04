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
  for (let col = 0; col < config.cols; col++) {
    const notesInColumn = columnNotes[col]
    if (!notesInColumn) continue

    const index = columnIndex[col] ?? 0

    const note = notesInColumn[index]
    if (!note) continue

    if (!note.hit && t > note.startTime + config.judgeWindows[0]) {
      registerMiss(note)
      console.log('MISS')

      if (note.endTime === undefined) {
        columnIndex[col] = (columnIndex[col] ?? 0) + 1
      } else {
        note.missed = true
      }
    }

    if (
      note.endTime !== undefined &&
      t > note.endTime + config.judgeWindows[0] &&
      !note.tailHit
    ) {
      columnIndex[col] = (columnIndex[col] ?? 0) + 1
    }
  }
}
