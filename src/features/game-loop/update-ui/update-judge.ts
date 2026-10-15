import { BitmapText } from 'pixi.js'
import { RefObject } from 'react'

import { JudgeReturn } from '../core/judge'
import { HIT_COLORS } from '../utils/game-constants'

export const updateJudge = (
  ref: RefObject<BitmapText | null>,
  state: JudgeReturn['judge'],
  lastVisualUpdate: RefObject<number>
) => {
  const view = ref.current

  if (view && state.summary) {
    if (state.lastUpdate !== lastVisualUpdate.current) {
      lastVisualUpdate.current = state.lastUpdate

      const value = state.currentJudge
      if (value === undefined) return
      view.text = value === 0 ? 'MISS' : String(value)
      view.style.fill = HIT_COLORS[value]

      view.visible = true
      view.alpha = 1
      view.scale.set(1.5)
    }

    if (view.visible) {
      view.alpha = Math.max(0, view.alpha - 0.04)
      const scale = Math.max(1, view.scale.x - 0.03)
      view.scale.set(scale)

      if (view.alpha <= 0) {
        view.visible = false
      }
    }
  }
}
