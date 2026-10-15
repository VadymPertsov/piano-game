import { BitmapText } from 'pixi.js'
import { RefObject } from 'react'

import { JudgeReturn } from '../core/judge'

export const updateScore = (
  ref: RefObject<BitmapText | null>,
  score: JudgeReturn['judge']['score']
) => {
  const value = String(score)

  if (ref.current && ref.current.text !== value) {
    ref.current.text = value
  }
}
