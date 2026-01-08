import { useEffect, useMemo, useRef, useState } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { GAP, SCROLL_SCALE, SIDE_PADDING } from '../../game-constants'
import { GameState, JudgePoints } from '../../types'
import { buildSVTimeline, makeJudgeWindows } from '../../utils/game-math'

interface UseBuildGameProps {
  audioUrl: string
  config: ParsedBeatmapData
}

export const useBuildGame = ({ audioUrl, config }: UseBuildGameProps) => {
  const {
    columnNotes,
    timings,
    settings: { difficulty, audioLeadIn, editor },
  } = config

  const [isGameStart, setIsGameStart] = useState<boolean>(false)

  const startTimeRef = useRef<number>(0)
  const currentTimeRef = useRef<number>(0)

  const audio = useMemo(() => new Audio(audioUrl), [audioUrl])

  const updateTime = () => {
    if (isGameStart) {
      if (audio.currentTime > 0) {
        currentTimeRef.current = audio.currentTime * 1000
        return
      }

      currentTimeRef.current =
        performance.now() - startTimeRef.current - audioLeadIn
    }
  }

  useEffect(() => {
    if (isGameStart) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'g') {
        setIsGameStart(true)

        startTimeRef.current = performance.now()

        audio.currentTime = 0
        audio.play()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [audio, audioLeadIn, isGameStart])

  const gameResults = useRef({
    currentCombo: 0,
    maxCombo: 0,
    score: 0,
    summary: { '320': 0, '300': 0, '200': 0, '100': 0, '50': 0, '0': 0 },
  })

  const COLS = difficulty.cs
  const WIDTH = COLS * 128
  const HEIGHT = 700
  const BASE_PIXELS_PER_MS =
    difficulty.sliderMultiplier * editor.distanceSpacing * SCROLL_SCALE
  const COL_WIDTH = (WIDTH - SIDE_PADDING * 2 - GAP * (COLS - 1)) / COLS
  const HIT_LINE_Y = HEIGHT - 100
  const NOTE_HEIGHT = Math.max(15, 30 * BASE_PIXELS_PER_MS)
  const PREEMPT = HIT_LINE_Y / BASE_PIXELS_PER_MS

  const registerJudge = (value: JudgePoints) => {
    // console.log(value)

    gameResults.current.summary[value]++
    gameResults.current.currentCombo++
    gameResults.current.maxCombo = Math.max(
      gameResults.current.maxCombo,
      gameResults.current.currentCombo
    )
    gameResults.current.score += value * gameResults.current.currentCombo
  }

  const registerMiss = () => {
    // console.log('miss')

    gameResults.current.summary[0]++
    gameResults.current.currentCombo = 0
  }

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
    canvasWidth: WIDTH,
    canvasHeight: HEIGHT,
    basePixelsPerMs: BASE_PIXELS_PER_MS,
    colWidth: COL_WIDTH,
    hitLineY: HIT_LINE_Y,
    noteHeight: NOTE_HEIGHT,
    preempt: PREEMPT,
    svTimeline,
    judgeWindows,
    hitWindow: judgeWindows[0],
    registerJudge,
    registerMiss,
  }

  return {
    isGameStart,
    timeRef: currentTimeRef,
    updateTime,
    columnNotes,
    timings,
    gameState,
    gameResults,
  }
}
