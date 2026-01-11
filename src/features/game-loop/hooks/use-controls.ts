import { RefObject, useEffect } from 'react'

import { GameReturn } from '../core/game'

export const useControls = (gameRef: RefObject<GameReturn>) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!gameRef.current) return

      const key = e.key.toLowerCase()

      if (key === 'g') {
        gameRef.current.start()
      }

      if (key === 't') {
        gameRef.current.restart()
      }
    }

    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [gameRef])

  useEffect(() => {
    const keyMap: Record<string, number> = {
      d: 0,
      f: 1,
      j: 2,
      k: 3,
    }

    const down = (e: KeyboardEvent) => {
      if (e.repeat) return
      const col = keyMap[e.key.toLowerCase()]
      if (col !== undefined && gameRef.current) {
        gameRef.current.hit(col)
      }
    }

    const up = (e: KeyboardEvent) => {
      if (e.repeat) return
      const col = keyMap[e.key.toLowerCase()]
      if (col !== undefined && gameRef.current) {
        gameRef.current.release(col)
      }
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [gameRef])
}
