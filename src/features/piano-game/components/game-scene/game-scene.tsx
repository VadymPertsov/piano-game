import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useState, useRef, useMemo, useEffect } from 'react'

import { drawNotes } from './draw-notes'
import { updateNotes } from './update-notes'
import { useGameConfigStore } from '../../stores/game-config-store'
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

    updateNotes({
      t,
      config,
      columnNotes: columnNotes.current,
      columnIndex: columnIndex.current,
    })

    g.clear()

    drawNotes({
      g,
      t,
      columnNotes: columnNotes.current,
      columnIndex: columnIndex.current,
      config,
      getDistanceFromHitline,
    })
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
