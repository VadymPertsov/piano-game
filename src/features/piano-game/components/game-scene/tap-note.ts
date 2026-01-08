import { Sprite } from 'pixi.js'

import { GAP, SIDE_PADDING } from '../../game-constants'
import { GameState, TapNote } from '../../types'
import { getDistanceBetween, getJudgement } from '../../utils/game-math'
import { WHITE } from '../../utils/white-texture'

export const tapNote = (
  game: GameState,
  data: {
    startTime: number
    column: number
  }
): TapNote => {
  let shouldRemove: boolean = false

  const sprite = Sprite.from(WHITE)

  sprite.tint = 0x42a5f5
  sprite.width = game.colWidth
  sprite.height = game.noteHeight

  const hit = (now: number) => {
    const delta = data.startTime - now

    if (Math.abs(delta) > game.hitWindow) return

    const judge = getJudgement(delta, game.judgeWindows)
    if (judge === 0) {
      game.registerMiss()
    } else {
      game.registerJudge(judge)
    }

    shouldRemove = true
  }

  const update = (now: number) => {
    const delta = data.startTime - now

    if (delta < -game.hitWindow) {
      game.registerMiss()
      shouldRemove = true
    }

    const x = SIDE_PADDING + data.column * (game.colWidth + GAP)
    const y =
      game.hitLineY -
      getDistanceBetween(now, data.startTime, game.svTimeline) -
      game.noteHeight

    sprite.x = x
    sprite.y = y
  }

  return {
    type: 'tap',
    column: data.column,
    startTime: data.startTime,
    sprite,

    get shouldRemove() {
      return shouldRemove
    },

    set shouldRemove(v: boolean) {
      shouldRemove = v
    },

    hit,
    update,
  }
}
