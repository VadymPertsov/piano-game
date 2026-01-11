import { Container, Sprite } from 'pixi.js'

import { GameState } from '../types'
import { WHITE } from '../utils/white-texture'

export const highlightView = (game: GameState) => {
  const container = new Container()
  container.zIndex = 2

  const sprite = Sprite.from(WHITE)
  sprite.width = game.colWidth
  sprite.height = game.canvasHeight - game.hitLineY
  sprite.tint = 0x42a5f5
  sprite.alpha = 0.3

  const headSprite = Sprite.from(WHITE)
  headSprite.tint = 0xffffff
  headSprite.width = game.colWidth
  headSprite.height = -game.noteHeight
  headSprite.alpha = 0

  container.addChild(sprite, headSprite)

  const tap = () => {
    sprite.alpha = 0.8

    console.log('tap')
  }

  const release = () => {
    sprite.alpha = 0.3
    console.log('release')
  }

  const tapHold = () => {
    sprite.alpha = 0.8
    headSprite.alpha = 0.8
    console.log('tapHold')
  }

  const releaseHold = () => {
    sprite.alpha = 0.3
    headSprite.alpha = 0
    console.log('releaseHold')
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
