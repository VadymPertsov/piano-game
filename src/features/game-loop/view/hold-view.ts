import { Container, Sprite } from 'pixi.js'

import { GameState } from '../types'
import { WHITE } from '../utils/white-texture'

export const holdView = (game: GameState) => {
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

  const visible = () => {
    container.visible = true
  }

  const update = (x: number, y: number, top: number, bottom: number) => {
    sprite.x = x
    sprite.y = top
    sprite.height = bottom - top

    headSprite.x = x
    headSprite.y = y - game.noteHeight
  }

  return {
    view: container,

    visible,
    update,
  }
}
