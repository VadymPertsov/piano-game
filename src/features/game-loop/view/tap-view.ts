import { Sprite } from 'pixi.js'

import { GameState } from '../types'
import { WHITE } from '../utils/white-texture'

export const tapView = (game: GameState) => {
  const sprite = Sprite.from(WHITE)
  sprite.width = game.colWidth
  sprite.height = game.noteHeight
  sprite.tint = 0x61afff
  sprite.alpha = 0.8
  sprite.zIndex = 1
  sprite.anchor.set(0, 0)
  sprite.visible = false

  const visible = () => {
    sprite.visible = true
  }

  const update = (x: number, y: number) => {
    sprite.x = x
    sprite.y = y
  }

  return {
    view: sprite,

    visible,
    update,
  }
}
