import { BitmapText } from 'pixi.js'
import { RefObject } from 'react'

import { JudgeReturn } from '../core/judge'

export const updateCombo = (
  ref: RefObject<BitmapText | null>,
  currentCombo: JudgeReturn['judge']['currentCombo']
) => {
  const value = String(currentCombo)

  if (ref.current && ref.current.text !== value) {
    ref.current.text = value
  }
}
