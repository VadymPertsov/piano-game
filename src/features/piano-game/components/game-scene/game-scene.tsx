import { extend, useTick } from '@pixi/react'
import { Graphics, Text } from 'pixi.js'
import { useRef } from 'react'

import { drawNotes } from './draw-notes'
import { updateNotes } from './update-notes'
import { useBuildGameScene } from './use-build-game-scene'
import { useKeyboardNotes } from './use-keyboard-notes'
import { useGameConfigStore } from '../../stores/game-config-store'
import { ColumnNote, NoteHighlight } from '../../types/beatmap-data'

extend({
  Graphics,
  Text,
})

export const GameScene = () => {
  const graphicsRef = useRef<Graphics>(null)

  const config = useGameConfigStore(s => s.config)
  const audioUrl = useGameConfigStore(s => s.audioUrl)
  const getDistanceFromHitline = useGameConfigStore(
    s => s.getDistanceFromHitline
  )
  const dataNotes = useGameConfigStore(s => s.notes)
  const getJudgement = useGameConfigStore(s => s.getJudgement)

  const columnNotes = useRef<ColumnNote[][]>(dataNotes)
  const columnIndex = useRef<number[]>(Array(config.cols).fill(0))

  const activeHold = useRef<(ColumnNote | null)[]>(
    Array(config.cols).fill(null)
  )
  const columnHighlight = useRef<NoteHighlight[]>(
    Array(config.cols).fill('transparent')
  )

  const comboRef = useRef<Text | null>(null)
  const scoreRef = useRef<Text | null>(null)

  const {
    isGameStart,
    updateTime,
    timeRef,
    registerMiss,
    registerJudge,
    gameResults,
  } = useBuildGameScene(audioUrl, config)

  useKeyboardNotes({
    activeHold: activeHold.current,
    columnHighlight: columnHighlight.current,
    columnIndex: columnIndex.current,
    columnNotes: columnNotes.current,
    judgeWindows: config.judgeWindows,
    timeRef,
    getJudgement,
    registerJudge,
    registerMiss,
  })

  useTick(() => {
    if (!isGameStart) return

    const g = graphicsRef.current
    if (!g) return

    updateTime()
    const t = timeRef.current

    g.clear()

    updateNotes({
      t,
      config,
      columnNotes: columnNotes.current,
      columnIndex: columnIndex.current,
      registerMiss,
    })

    drawNotes({
      g,
      t,
      columnNotes: columnNotes.current,
      columnIndex: columnIndex.current,
      config,
      getDistanceFromHitline,
    })

    if (
      comboRef.current &&
      comboRef.current.text !== String(gameResults.current.currentCombo)
    ) {
      comboRef.current.text = String(gameResults.current.currentCombo)
    }

    if (
      scoreRef.current &&
      scoreRef.current.text !== String(gameResults.current.score)
    ) {
      scoreRef.current.text = String(gameResults.current.score)
    }
  })

  return (
    <>
      <pixiText
        ref={comboRef}
        text="0"
        x={config.canvasWidth / 2}
        y={config.canvasHeight / 2}
        style={{ fill: 'white' }}
      />
      <pixiText
        ref={scoreRef}
        text="0"
        x={10}
        y={10}
        style={{ fill: 'white' }}
      />
      <pixiGraphics ref={graphicsRef} draw={() => {}} />
    </>
  )
}
