import { Sprite } from 'pixi.js'

import { GameState } from './types'
import { GAP, SIDE_PADDING } from '../../game-constants'
import { getDistanceBetween, getJudgement } from '../../utils/game-math'
import { WHITE } from '../../utils/white-texture'

export const holdNote = (
  game: GameState,
  data: { startTime: number; endTime: number; column: number },
  highlightSprite: Sprite | undefined
) => {
  let shouldRemove: boolean = false

  const sprite = Sprite.from(WHITE)

  sprite.tint = 'hsl(212, 80%, 69%)'
  sprite.width = game.colWidth

  const headSprite = Sprite.from(WHITE)

  headSprite.tint = 'hsl(212, 8%, 98.45%)'
  headSprite.width = game.colWidth
  headSprite.height = game.noteHeight

  const highlight = (type: 'click' | 'miss' | 'tap') => {
    if (highlightSprite) {
      highlightSprite.tint =
        type === 'click' ? 0xffffff : type === 'miss' ? 0xff0000 : 0x00ff00
      highlightSprite.alpha = 0.5

      setTimeout(() => {
        highlightSprite.tint = 0xffffff
        highlightSprite.alpha = 0.1
      }, 200)
    }
  }

  const release = (now: number) => {
    const delta = data.endTime - now
    if (Math.abs(delta) < game.hitWindow) {
      shouldRemove = true

      const judge = getJudgement(delta, game.judgeWindows)

      if (judge === 0) {
        highlight('miss')
        game.registerMiss()
      } else {
        highlight('tap')
        game.registerJudge(judge)
      }

      return
    }
  }

  const update = (now: number) => {
    const delta = data.endTime - now

    if (delta < -game.hitWindow) {
      highlight('miss')
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
