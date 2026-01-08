// import { ColumnNote } from '@src/shared/types/beatmap-prepare'

// export const updateNotes = ({
//   t,
//   config,
//   columnIndex,
//   columnNotes,
//   registerMiss,
// }: {
//   t: number
//   config: GameConfig
//   columnNotes: ColumnNote[][]
//   columnIndex: number[]
//   registerMiss: (note: ColumnNote, isTail?: boolean) => void
// }) => {
//   const { cols, judgeWindows } = config

//   const hitWindow = judgeWindows[0]

//   for (let col = 0; col < cols; col++) {
//     const index = columnIndex[col] ?? 0
//     const note = columnNotes[col]?.[index]

//     if (!note) continue

//     if (
//       !note.hit &&
//       !note.holding &&
//       !note.missed &&
//       t > note.startTime + hitWindow
//     ) {
//       registerMiss(note)
//       note.missed = true
//       if (note.endTime === undefined) {
//         columnIndex[col] = index + 1
//         continue
//       }
//     }

//     if (note.endTime !== undefined && t > note.endTime + hitWindow) {
//       if (note.hit && !note.tailHit) {
//         registerMiss(note, true)
//       }

//       columnIndex[col] = index + 1
//     }
//   }
// }
