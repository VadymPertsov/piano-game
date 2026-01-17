import { Container, Graphics, Sprite } from 'pixi.js'

import { GameState } from '../types'
import { WHITE } from '../utils/white-texture'

export const highlightView = (game: GameState) => {
  const container = new Container()
  container.zIndex = 2

  const sprite = Sprite.from(WHITE)
  sprite.width = game.colWidth
  sprite.height = game.noteHeight
  sprite.tint = 0x61afff
  sprite.alpha = 0

  const border = new Graphics()
  border.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 1 })
  border.rect(1, 1, game.colWidth - 2, game.noteHeight - 2)
  border.stroke()

  container.addChild(sprite, border)

  const tap = () => {
    sprite.alpha = 0.8
  }

  const release = () => {
    sprite.alpha = 0
  }

  const tapHold = () => {
    sprite.alpha = 0.8
    sprite.tint = 0xffffff
  }

  const releaseHold = () => {
    sprite.alpha = 0
    sprite.tint = 0x61afff
  }

  return {
    view: container,
    tap,
    tapHold,
    release,
    releaseHold,
  }
}

export type HighlightView = ReturnType<typeof highlightView>
