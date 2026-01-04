import { useEffect } from 'react'

import { SCROLL_SCALE, SIDE_PADDING, GAP } from '../../constants/game'
import { useGameConfigStore } from '../../stores/game-config-store'
import { ParsedBeatmapData } from '../../types/beatmap-data'
import { makeJudgeWindows, makeSVPoints } from '../../utils/game-helpers'

export const useGameSettings = (data: ParsedBeatmapData, audioUrl: string) => {
  const {
    settings: { difficulty, editor, audioLeadIn },
    columnNotes,
    timings,
  } = data

  const initGame = useGameConfigStore(s => s.initGame)

  const COLS = difficulty.cs

  const CANVAS = {
    width: COLS * 128,
    height: 700,
  }

  const canvasHeight = CANVAS.height
  const canvasWidth = CANVAS.width
  const cols = COLS
  const basePixelsPerMs =
    difficulty.sliderMultiplier * editor.distanceSpacing * SCROLL_SCALE
  const colWidth = (CANVAS.width - SIDE_PADDING * 2 - GAP * (cols - 1)) / cols
  const hitLineY = CANVAS.height - 100
  const noteHeight = Math.max(15, 30 * basePixelsPerMs)
  const preempt = hitLineY / basePixelsPerMs

  useEffect(() => {
    initGame({
      config: {
        colWidth,
        hitLineY,
        basePixelsPerMs,
        noteHeight,
        canvasHeight,
        canvasWidth,
        cols,
        preempt,
        judgeWindows: makeJudgeWindows(difficulty.od),
        audioLeadIn,
      },
      notes: columnNotes,
      timings,
      filteredSVPoints: makeSVPoints(timings),
      audioUrl,
    })
  }, [
    audioLeadIn,
    audioUrl,
    basePixelsPerMs,
    canvasHeight,
    canvasWidth,
    colWidth,
    cols,
    columnNotes,
    difficulty.od,
    hitLineY,
    initGame,
    noteHeight,
    preempt,
    timings,
  ])

  return CANVAS
}
