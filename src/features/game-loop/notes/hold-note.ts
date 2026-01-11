import { JudgePoints } from '@src/shared/types/beatmap-prepare'

import { GameState } from '../types'
import { SIDE_PADDING, GAP } from '../utils/game-constants'
import { getJudgement, getDistanceBetween } from '../utils/game-math'
import { HighlightView } from '../view/highlight-view'
import { holdView } from '../view/hold-view'

export const holdNote = (
  game: GameState,
  data: { startTime: number; endTime: number; column: number },
  highlight?: HighlightView
) => {
  let shouldRemove: boolean = false

  const sprite = holdView(game)

  const hit = () => {
    highlight?.tapHold()
  }

  const release = (now: number) => {
    highlight?.releaseHold()

    const delta = data.endTime - now
    if (Math.abs(delta) < game.hitWindow) {
      shouldRemove = true

      const judge = getJudgement(delta, game.judgeWindows)

      return { judge }
    }
  }

  const update = (now: number) => {
    sprite.visible()

    const delta = data.endTime - now

    if (delta < -game.hitWindow) {
      shouldRemove = true
      return { judge: 0 as JudgePoints }
    }

    const headY =
      game.hitLineY - getDistanceBetween(now, data.startTime, game.svTimeline)
    const tailY =
      game.hitLineY - getDistanceBetween(now, data.endTime, game.svTimeline)

    const top = Math.min(headY, tailY)
    const bottom = Math.max(headY, tailY)

    const x = SIDE_PADDING + data.column * (game.colWidth + GAP)

    sprite.update(x, headY, top, bottom)
  }

  return {
    type: 'hold',
    column: data.column,
    view: sprite.view,

    get shouldRemove() {
      return shouldRemove
    },

    hit,
    release,
    update,
  }
}
