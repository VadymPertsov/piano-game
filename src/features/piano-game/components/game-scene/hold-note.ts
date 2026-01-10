import { Container, Sprite } from 'pixi.js'

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

  const container = new Container()
  container.visible = false
  container.zIndex = 1
  container.alpha = 0.8

  const sprite = Sprite.from(WHITE)
  sprite.tint = 0x42a5f5
  sprite.width = game.colWidth

  const headSprite = Sprite.from(WHITE)
  headSprite.tint = 0xffffff
  headSprite.width = game.colWidth
  headSprite.height = game.noteHeight

  container.addChild(sprite, headSprite)

  const highlight = (type: 'tap' | 'release') => {
    if (!highlightSprite) return

    if (type === 'tap') {
      highlightSprite.alpha = 0.8
    } else {
      highlightSprite.alpha = 0.4
    }
  }

  const hit = () => {
    highlight('tap')
  }

  const release = (now: number) => {
    highlight('release')

    const delta = data.endTime - now
    if (Math.abs(delta) < game.hitWindow) {
      shouldRemove = true

      const judge = getJudgement(delta, game.judgeWindows)

      if (judge === 0) {
        game.registerMiss()
      } else {
        game.registerJudge(judge)
      }

      return
    }
  }

  const update = (now: number) => {
    container.visible = true

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
    view: container,

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
