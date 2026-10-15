import { JudgePoints } from '@src/shared/types/beatmap-prepare'

import { GameState } from '../types'
import { SIDE_PADDING, GAP } from '../utils/game-constants'
import { getJudgement, getDistanceBetween } from '../utils/game-math'
import { HighlightView } from '../view/highlight-view'
import { tapView } from '../view/tap-view'

export const tapNote = (
  game: GameState,
  data: {
    startTime: number
    column: number
  },
  highlight?: HighlightView
) => {
  let shouldRemove: boolean = false

  const sprite = tapView(game)

  const hit = (now: number) => {
    highlight?.tap()
    const delta = data.startTime - now

    if (Math.abs(delta) > game.hitWindow) return

    const judge = getJudgement(delta, game.judgeWindows)

    shouldRemove = true

    return { judge }
  }

  const release = () => {
    highlight?.release()
  }

  const update = (now: number) => {
    sprite.visible()

    const delta = data.startTime - now

    if (delta < -game.hitWindow) {
      shouldRemove = true
      return { judge: 0 as JudgePoints }
    }

    const x = SIDE_PADDING + data.column * (game.colWidth + GAP)
    const y =
      game.hitLineY -
      getDistanceBetween(now, data.startTime, game.svTimeline) -
      game.noteHeight

    sprite.update(x, y)
  }

  return {
    type: 'tap',
    column: data.column,
    startTime: data.startTime,
    view: sprite.view,

    get shouldRemove() {
      return shouldRemove
    },

    hit,
    release,
    update,
  }
}
