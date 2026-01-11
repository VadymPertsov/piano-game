import { useMemo } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { GameState } from '../types'
import { SCROLL_SCALE, SIDE_PADDING, GAP } from '../utils/game-constants'
import { buildSVTimeline, makeJudgeWindows } from '../utils/game-math'

interface UseBuildGameProps {
  data: ParsedBeatmapData
  canvasHeight: number
  canvasWidth: number
}

export const useGameConfig = ({
  data,
  canvasHeight,
  canvasWidth,
}: UseBuildGameProps) => {
  const {
    timings,
    settings: { difficulty, audioLeadIn, editor },
  } = data

  const COLS = difficulty.cs
  const BASE_PIXELS_PER_MS =
    difficulty.sliderMultiplier * editor.distanceSpacing * SCROLL_SCALE
  const COL_WIDTH = (canvasWidth - SIDE_PADDING * 2 - GAP * (COLS - 1)) / COLS
  const HIT_LINE_Y = canvasHeight - 100
  const NOTE_HEIGHT = Math.max(30, 60 * BASE_PIXELS_PER_MS)
  const PREEMPT = HIT_LINE_Y / BASE_PIXELS_PER_MS

  const svTimeline = useMemo(
    () => buildSVTimeline(timings, BASE_PIXELS_PER_MS, audioLeadIn),
    [timings, BASE_PIXELS_PER_MS, audioLeadIn]
  )

  const judgeWindows = useMemo(
    () => makeJudgeWindows(difficulty.od),
    [difficulty.od]
  )

  const gameState: GameState = {
    cols: COLS,
    basePixelsPerMs: BASE_PIXELS_PER_MS,
    colWidth: COL_WIDTH,
    hitLineY: HIT_LINE_Y,
    noteHeight: NOTE_HEIGHT,
    preempt: PREEMPT,
    svTimeline,
    judgeWindows,
    hitWindow: judgeWindows[0],
    canvasHeight,
    canvasWidth,
  }

  return gameState
}
