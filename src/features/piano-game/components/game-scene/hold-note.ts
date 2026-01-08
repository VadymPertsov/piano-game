import { Sprite } from 'pixi.js'

import { GAP, SIDE_PADDING } from '../../game-constants'
import { GameState, HoldNote } from '../../types'
import { getDistanceBetween, getJudgement } from '../../utils/game-math'
import { WHITE } from '../../utils/white-texture'

export const holdNote = (
  game: GameState,
  data: { startTime: number; endTime: number; column: number }
): HoldNote => {
  let shouldRemove: boolean = false

  const sprite = Sprite.from(WHITE)

  sprite.tint = 0x42a5f5
  sprite.width = game.colWidth

  const headSprite = Sprite.from(WHITE)

  headSprite.tint = 0xff0000
  headSprite.width = game.colWidth
  headSprite.height = game.noteHeight

  const release = (now: number) => {
    const delta = data.endTime - now
    if (Math.abs(delta) < game.hitWindow) {
      shouldRemove = true

      const judge = getJudgement(delta, game.judgeWindows)

      if (judge === 0) {
        game.registerMiss()
        console.log('miss miss')
      } else {
        game.registerJudge(judge)
      }

      return
    }
  }

  const update = (now: number) => {
    const delta = data.endTime - now

    if (delta < -game.hitWindow) {
      game.registerMiss()
      shouldRemove = true
    }

    const headY =
      game.hitLineY - getDistanceBetween(now, data.startTime, game.svTimeline)
    const tailY =
      game.hitLineY - getDistanceBetween(now, data.endTime, game.svTimeline)

    const top = Math.min(headY, tailY)
    const bottom = Math.max(headY, tailY)

    const x = SIDE_PADDING + data.column * (game.colWidth + GAP)

    sprite.x = x
    sprite.y = top
    sprite.height = bottom - top

    headSprite.x = x
    headSprite.y = headY - game.noteHeight
  }

  return {
    type: 'hold',
    column: data.column,
    sprite,
    headSprite,

    get shouldRemove() {
      return shouldRemove
    },

    set shouldRemove(v: boolean) {
      shouldRemove = v
    },

    release,
    update,
  }
}
