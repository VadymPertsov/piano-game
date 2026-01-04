import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useState, useRef, useMemo, useEffect } from 'react'

import { SIDE_PADDING, GAP } from '../../constants/game'
import { GameConfig, useGameConfigStore } from '../../stores/game-config-store'
import { ColumnNote } from '../../types/beatmap-data'

extend({
  Graphics,
})

interface GameSceneProps {
  audioUrl?: string
}

export const GameScene = ({ audioUrl }: GameSceneProps) => {
  const [isGameStart, setIsGameStart] = useState<boolean>(false)

  const graphicsRef = useRef<Graphics>(null)

  const startTimeRef = useRef<number>(0)

  const config = useGameConfigStore(s => s.config)
  const getDistanceFromHitline = useGameConfigStore(
    s => s.getDistanceFromHitline
  )
  const dataNotes = useGameConfigStore(s => s.notes)

  const columnNotes = useRef<ColumnNote[][]>(dataNotes)
  const columnIndex = useRef<number[]>(Array(config.cols).fill(0))

  const audio = useMemo(() => new Audio(audioUrl), [audioUrl])

  const now = () => {
    if (!audio) return 0

    if (!isGameStart) return -config.audioLeadIn

    if (audio.currentTime > 0) return audio.currentTime * 1000

    return startTimeRef.current
      ? performance.now() - startTimeRef.current - config.audioLeadIn
      : 0
  }

  useTick(() => {
    if (!isGameStart) return

    const t = now()

    const g = graphicsRef.current
    if (!g) return

    g.clear()

    for (let col = 0; col < config.cols; col++) {
      const notes = columnNotes.current[col]
      const start = columnIndex.current[col]

      if (!notes || start === undefined) continue

      for (let i = notes.length - 1; i >= start; i--) {
        const note = notes[i]
        if (!note) continue

        const timeDiff = note.startTime - t
        if (timeDiff > config.preempt) continue

        const exitTime = note.endTime ?? note.startTime
        if (exitTime < t - 300) continue

        const headOffset = getDistanceFromHitline(note.startTime, t)
        const headY = config.hitLineY - headOffset

        const x = SIDE_PADDING + note.column * (config.colWidth + GAP)

        const noteParams = {
          colWidth: config.colWidth,
          noteHeight: config.noteHeight,
        }

        if (note.endTime) {
          const tailOffset = getDistanceFromHitline(note.endTime, t)

          const tailY = config.hitLineY - tailOffset

          const top = Math.min(headY, tailY)
          const bottom = Math.max(headY, tailY)

          if (
            bottom < -config.noteHeight ||
            top > config.canvasHeight + config.noteHeight
          )
            continue

          drawHoldNote(g, x, headY, top, bottom, noteParams)
        } else {
          if (
            headY < -config.noteHeight ||
            headY > config.canvasHeight + config.noteHeight
          )
            continue

          drawTapNote(g, x, headY, noteParams)
        }
      }
    }
  })

  useEffect(() => {
    if (isGameStart) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'g') return

      setIsGameStart(true)

      startTimeRef.current = performance.now()

      audio.currentTime = 0

      setTimeout(() => {
        audio.play()
      }, config.audioLeadIn)

      window.removeEventListener('keydown', onKeyDown)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [audio, config.audioLeadIn, isGameStart])

  return <pixiGraphics ref={graphicsRef} draw={() => {}} />
}

const drawHoldNote = (
  g: Graphics,
  x: number,
  y: number,
  top: number,
  bottom: number,
  config: Pick<GameConfig, 'colWidth' | 'noteHeight'>
) => {
  g.rect(x, top, config.colWidth, bottom - top)
  g.fill({ color: 0x42a5f5, alpha: 0.6 })

  g.rect(x, y - config.noteHeight, config.colWidth, config.noteHeight)
  g.fill({ color: 0x555 })
}

const drawTapNote = (
  g: Graphics,
  x: number,
  y: number,
  config: Pick<GameConfig, 'colWidth' | 'noteHeight'>
) => {
  g.rect(x, y - config.noteHeight, config.colWidth, config.noteHeight)
  g.fill({ color: 0x42a5f5 })
}
