import { Sprite } from 'pixi.js'

import { SIDE_PADDING, GAP } from '@src/features/piano-game/game-constants'
import {
  getJudgement,
  getDistanceBetween,
} from '@src/features/piano-game/utils/game-math'
import { WHITE } from '@src/features/piano-game/utils/white-texture'

import { GameState } from '../types'

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
  sprite.tint = 0x61afff
  sprite.alpha = 0.8
  sprite.zIndex = 1
  sprite.anchor.set(0, 0)
  sprite.visible = false

  const highlight = (type: 'tap' | 'release') => {
    if (!highlightSprite) return

    if (type === 'tap') {
      highlightSprite.alpha = 0.8
    } else {
      highlightSprite.alpha = 0.4
    }
  }

  const hit = (now: number) => {
    highlight('tap')

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

  const release = () => {
    highlight('release')
  }

  const update = (now: number) => {
    sprite.visible = true

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
    view: sprite,

    get shouldRemove() {
      return shouldRemove
    },

    set shouldRemove(v: boolean) {
      shouldRemove = v
    },

    hit,
    release,
    update,
  }
}
