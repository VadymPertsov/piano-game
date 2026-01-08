import { RefObject } from 'react'

import { GameNote } from '../../types'

export const updateNotes = ({
  columnNotesRef,
  time,
}: {
  columnNotesRef: RefObject<GameNote[][]>
  hitWindow: number
  time: number
}) => {
  for (const col of columnNotesRef.current) {
    let i = 0

    while (i < col.length) {
      const hitObject = col[i]

      if (!hitObject) continue

      hitObject.update(time)

      if (hitObject.shouldRemove) {
        // hitObject.sprite.parent?.removeChild(hitObject.sprite)
        // // hitObject.sprite.destroy()
        // col.shift()
        // i = 0
        hitObject.sprite.parent?.removeChild(hitObject.sprite)
        hitObject.sprite.destroy({ children: true })
        col.splice(i, 1)
        continue
      }

      if (hitObject.sprite.y < 0) {
        break
      }

      i++
    }
  }
}
