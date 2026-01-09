import { Sprite } from 'pixi.js'

import { GameState } from './types'
import { GAP, SIDE_PADDING } from '../../game-constants'
import { getDistanceBetween, getJudgement } from '../../utils/game-math'
import { WHITE } from '../../utils/white-texture'

export const tapNote = (
  game: GameState,
  data: {
    startTime: number
    column: number
  },
  highlightSprite: Sprite | undefined
) => {
  let shouldRemove: boolean = false

  const sprite = Sprite.from(WHITE)
  sprite.width = game.colWidth
  sprite.height = game.noteHeight
  sprite.tint = 'hsl(212, 80%, 69%)'
  sprite.alpha = 0.8
  sprite.zIndex = 1

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

  const hit = (now: number) => {
    highlight('click')
    const delta = data.startTime - now

    if (Math.abs(delta) > game.hitWindow) return

    const judge = getJudgement(delta, game.judgeWindows)
    if (judge === 0) {
      highlight('miss')
      game.registerMiss()
    } else {
      highlight('tap')
      game.registerJudge(judge)
    }

    shouldRemove = true
  }

  const update = (now: number) => {
    const delta = data.startTime - now

    if (delta < -game.hitWindow) {
      highlight('miss')
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
