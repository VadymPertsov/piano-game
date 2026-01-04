import { extend, useTick } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useRef } from 'react'

import { useCurrentBeatmapStore } from '@src/store/current-beatmap-store'

import { drawNotes } from './draw-notes'
import { updateNotes } from './update-notes'
import { useBuildGameScene } from './use-build-game-scene'
import { useGameConfigStore } from '../../stores/game-config-store'
import { ColumnNote } from '../../types/beatmap-data'

extend({
  Graphics,
})

export const GameScene = () => {
  const graphicsRef = useRef<Graphics>(null)

  const config = useGameConfigStore(s => s.config)
  const audioUrl = useGameConfigStore(s => s.audioUrl)
  const getDistanceFromHitline = useGameConfigStore(
    s => s.getDistanceFromHitline
  )
  const dataNotes = useGameConfigStore(s => s.notes)

  const registerMiss = useCurrentBeatmapStore(s => s.registerMiss)

  const { isGameStart, timeNow } = useBuildGameScene(audioUrl, config)

  const columnNotes = useRef<ColumnNote[][]>(dataNotes)
  const columnIndex = useRef<number[]>(Array(config.cols).fill(0))

  useTick(() => {
    if (!isGameStart) return

    const g = graphicsRef.current
    if (!g) return

    const t = timeNow()

    updateNotes({
      t,
      config,
      columnNotes: columnNotes.current,
      columnIndex: columnIndex.current,
      registerMiss,
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

  return <pixiGraphics ref={graphicsRef} draw={() => {}} />
}
