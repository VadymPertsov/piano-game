import { JudgePoints } from '@src/shared/types/beatmap-prepare'

import { GameNote } from '../types'

export const createNotesManager = (gameNotes: GameNote[][]) => {
  let columns = gameNotes

  const update = (now: number) => {
    let judge: JudgePoints | undefined

    for (const col of columns) {
      let i = 0

      while (i < col.length) {
        const hitObject = col[i]

        if (!hitObject) continue

        const result = hitObject.update(now)

        if (result !== undefined) {
          judge = result.judge
        }

        if (hitObject.shouldRemove) {
          // hitObject.sprite.parent?.removeChild(hitObject.sprite)
          // // hitObject.sprite.destroy()
          // col.shift()
          // i = 0

          hitObject.view.parent?.removeChild(hitObject.view)
          hitObject.view.destroy({ children: true })
          col.splice(i, 1)
          continue
        }

        if (hitObject.view.y < 0) {
          break
        }

        i++
      }
    }

    return judge
  }

  const hit = (column: number, now: number) => {
    const note = columns[column]?.[0]
    if (!note) return

    if ('hit' in note) {
      return note.hit(now)
    }
  }

  const release = (column: number, now: number) => {
    const note = columns[column]?.[0]
    if (!note) return

    if ('release' in note) {
      return note.release(now)
    }
  }

  const reset = (newNotes: GameNote[][]) => {
    columns = newNotes
  }

  return {
    update,
    hit,
    release,
    reset,
  }
}
