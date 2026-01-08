import { useEffect, useMemo, useRef, useState } from 'react'

import { ParsedBeatmapData } from '@src/shared/types/beatmap-prepare'

import { GAP, SCROLL_SCALE, SIDE_PADDING } from '../../game-constants'
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
    if (!isGameStart) {
      currentTimeRef.current = -audioLeadIn
      return
    }

    if (audio.currentTime > 0) {
      currentTimeRef.current = audio.currentTime * 1000
      return
    }

    currentTimeRef.current =
      performance.now() - startTimeRef.current - audioLeadIn
  }

  useEffect(() => {
    if (isGameStart) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'g') {
        setIsGameStart(true)
        startTimeRef.current = performance.now()
        audio.currentTime = 0

        setTimeout(() => audio.play(), audioLeadIn)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [audio, audioLeadIn, isGameStart])

  const COLS = difficulty.cs
  const WIDTH = COLS * 128
  const HEIGHT = 700
  const BASE_PIXELS_PER_MS =
    difficulty.sliderMultiplier * editor.distanceSpacing * SCROLL_SCALE
  const COL_WIDTH = (WIDTH - SIDE_PADDING * 2 - GAP * (COLS - 1)) / COLS
  const HIT_LINE_Y = HEIGHT - 100
  const NOTE_HEIGHT = Math.max(15, 30 * BASE_PIXELS_PER_MS)
  const PREEMPT = HIT_LINE_Y / BASE_PIXELS_PER_MS

  const svTimeline = useMemo(
    () => buildSVTimeline(timings, BASE_PIXELS_PER_MS, audioLeadIn),
    [timings, BASE_PIXELS_PER_MS, audioLeadIn]
  )

  const judgeWindows = useMemo(
    () => makeJudgeWindows(difficulty.od),
    [difficulty.od]
  )

  return {
    isGameStart,
    timeRef: currentTimeRef,
    updateTime,
    config: {
      columnNotes,
      timings,
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
    },
  }
}
