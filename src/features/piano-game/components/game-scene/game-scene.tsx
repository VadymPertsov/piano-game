import { extend, useTick } from '@pixi/react'
import { Container, Graphics, Text } from 'pixi.js'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import {
  ParsedBeatmapData,
  ColumnNote,
} from '@src/shared/types/beatmap-prepare'

import { pressNote, releaseNote } from './play-notes'
import { useBuildGame } from './use-build-game'
import {
  GAP,
  KEYS,
  NOTE_HIGHLIGHT_COLORS,
  SIDE_PADDING,
} from '../../game-constants'
import { NoteHighlight, RegisterJudge } from '../../types'
import { getDistanceBetween } from '../../utils/game-math'
import { WHITE } from '../../utils/white-texture'

extend({
  Graphics,
  Text,
  Container,
})

interface GameSceneProps {
  data: ParsedBeatmapData
}

export const GameScene = ({ data }: GameSceneProps) => {
  const graphicsRef = useRef<Graphics>(null)

  const { isGameStart, timeRef, updateTime, config } = useBuildGame({
    audioUrl: 'asda',
    config: data,
  })

  const {
    canvasHeight,
    canvasWidth,
    colWidth,
    cols,
    columnNotes: dataNotes,
    hitLineY,
    noteHeight,
    preempt,
    svTimeline,
    judgeWindows,
    hitWindow,
  } = config

  const gameResults = useRef({
    currentCombo: 0,
    maxCombo: 0,
    score: 0,
    summary: { '320': 0, '300': 0, '200': 0, '100': 0, '50': 0, '0': 0 },
  })

  const comboRef = useRef<Text | null>(null)
  const scoreRef = useRef<Text | null>(null)

  const activeHold = useRef<(ColumnNote | null)[]>(
    Array(config.cols).fill(null)
  )
  const columnHighlight = useRef<NoteHighlight[]>(
    Array(config.cols).fill('transparent')
  )

  const columnNotes = useRef<ColumnNote[][]>([...dataNotes])
  const columnIndex = useRef<number[]>(Array(cols).fill(0))

  const memoizedKeys = useMemo(() => KEYS, [])

  const registerJudge = (value: RegisterJudge) => {
    console.log(value)

    gameResults.current.summary[value]++
    gameResults.current.currentCombo++
    gameResults.current.maxCombo = Math.max(
      gameResults.current.maxCombo,
      gameResults.current.currentCombo
    )
    gameResults.current.score += value * gameResults.current.currentCombo
  }

  const registerMiss = (note: ColumnNote, isTail: boolean = false) => {
    if (note.missed) return

    if (isTail) {
      note.tailHit = true
    } else {
      note.hit = true
    }

    note.missed = true

    gameResults.current.summary[0]++
    gameResults.current.currentCombo = 0
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return

      const col = memoizedKeys.indexOf(e.key.toLowerCase())
      if (col === -1) return
      console.log('press')

      pressNote({
        column: col,
        columnHighlight: columnHighlight.current,
        activeHold: activeHold.current,
        columnIndex: columnIndex.current,
        columnNotes: columnNotes.current,
        timeRef,
        judgeWindows,
        registerJudge,
        registerMiss,
      })
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const col = memoizedKeys.indexOf(e.key.toLowerCase())
      if (col === -1) return

      releaseNote({
        column: col,
        activeHold: activeHold.current,
        timeRef,
        judgeWindows,
        registerJudge,
        registerMiss,
      })

      columnHighlight.current[col] = 'transparent'
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [cols, judgeWindows, memoizedKeys, timeRef])

  useTick(() => {
    if (!isGameStart) return

    const g = graphicsRef.current
    if (!g) return

    g.clear()

    updateTime()
    const t = timeRef.current

    for (let col = 0; col < cols; col++) {
      const index = columnIndex.current[col] ?? 0
      const notes = columnNotes.current[col]

      if (!notes) continue

      const note = notes[index]

      if (!note) continue

      if (
        !note.hit &&
        !note.holding &&
        !note.missed &&
        t > note.startTime + hitWindow
      ) {
        registerMiss(note)
        note.missed = true
        if (note.endTime === undefined) {
          columnIndex.current[col] = index + 1
          continue
        }
      }

      if (note.endTime !== undefined && t > note.endTime + hitWindow) {
        if (note.hit && !note.tailHit) {
          registerMiss(note, true)
        }

        columnIndex.current[col] = index + 1
      }

      if (index === undefined) continue

      for (let i = notes.length - 1; i >= index; i--) {
        const note = notes[i]
        if (!note) continue

        const startDt = note.startTime - t
        const endDt =
          note.endTime !== undefined
            ? note.endTime - t
            : startDt + 2 * noteHeight

        if (startDt > preempt || endDt < 0) continue

        // if (t > note.startTime) {
        //   missCount.current++
        //   columnIndex.current[col] = start + 1
        //   continue
        // }

        const headY =
          hitLineY - getDistanceBetween(t, note.startTime, svTimeline)
        const x = SIDE_PADDING + note.column * (colWidth + GAP)

        if (note.endTime !== undefined) {
          const tailY =
            hitLineY - getDistanceBetween(t, note.endTime, svTimeline)

          const top = Math.min(headY, tailY)
          const bottom = Math.max(headY, tailY)

          if (bottom < -noteHeight || top > canvasHeight + noteHeight) continue

          g.texture(WHITE, 0x555, x, top, colWidth, bottom - top)
          g.texture(
            WHITE,
            0x42a5f5,
            x,
            headY - noteHeight,
            colWidth,
            noteHeight
          )
        } else {
          if (headY < -noteHeight || headY > canvasHeight + noteHeight) continue
          g.texture(
            WHITE,
            0x42a5f5,
            x,
            headY - noteHeight,
            colWidth,
            noteHeight
          )
        }
      }

      const highlightType = columnHighlight.current[col]

      // Если колонка не подсвечена, просто пропускаем
      if (!highlightType) continue

      const color = NOTE_HIGHLIGHT_COLORS[highlightType]
      if (!color) continue

      const x = SIDE_PADDING + col * (colWidth + GAP)

      g.texture(WHITE, color, x, hitLineY, colWidth, canvasHeight)
    }

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
    <pixiContainer>
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
      <DrawColumns
        cols={cols}
        canvasHeight={canvasHeight}
        colWidth={colWidth}
      />
      <DrawHitLine canvasWidth={canvasWidth} hitLineY={hitLineY} />
    </pixiContainer>
  )
}

const DrawColumns = ({
  canvasHeight,
  colWidth,
  cols,
}: {
  cols: number
  colWidth: number
  canvasHeight: number
}) => {
  const draw = useCallback(
    (g: Graphics) => {
      // g.clear()

      for (let i = 0; i < cols - 1; i++) {
        const x = SIDE_PADDING + i * (colWidth + GAP)

        g.texture(WHITE, 0x000000, x + colWidth - 1, 0, 1, canvasHeight)
      }
    },
    [canvasHeight, colWidth, cols]
  )
  return <pixiGraphics draw={draw} />
}

const DrawHitLine = ({
  canvasWidth,
  hitLineY,
}: {
  canvasWidth: number
  hitLineY: number
}) => {
  const draw = useCallback(
    (g: Graphics) => {
      // g.clear()

      g.texture(WHITE, 0xaaaaaa, 0, hitLineY, canvasWidth, 4)
    },
    [canvasWidth, hitLineY]
  )

  return <pixiGraphics draw={draw} />
}
