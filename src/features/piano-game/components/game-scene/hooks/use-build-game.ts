import { useEffect, useMemo, useRef, useState } from 'react'

import {
  GAP,
  SCROLL_SCALE,
  SIDE_PADDING,
} from '@src/features/piano-game/game-constants'
import {
  buildSVTimeline,
  makeJudgeWindows,
} from '@src/features/piano-game/utils/game-math'
import {
  ParsedBeatmapData,
  RegisterJudge,
} from '@src/shared/types/beatmap-prepare'

import { GameState } from '../types'

interface UseBuildGameProps {
  audioUrl: string
  config: ParsedBeatmapData
  canvasHeight: number
  canvasWidth: number
}

export const useBuildGame = ({
  audioUrl,
  config,
  canvasHeight,
  canvasWidth,
}: UseBuildGameProps) => {
  const {
    columnNotes,
    timings,
    settings: { difficulty, audioLeadIn, editor },
  } = config

  const [isGameStart, setIsGameStart] = useState<boolean>(false)

  const startTimeRef = useRef<number>(0)
  const currentTimeRef = useRef<number>(0)
  const gameResults = useRef({
    currentCombo: 0,
    maxCombo: 0,
    score: 0,
    summary: { '320': 0, '300': 0, '200': 0, '100': 0, '50': 0, '0': 0 },
  })

  const COLS = difficulty.cs
  const BASE_PIXELS_PER_MS =
    difficulty.sliderMultiplier * editor.distanceSpacing * SCROLL_SCALE
  const COL_WIDTH = (canvasWidth - SIDE_PADDING * 2 - GAP * (COLS - 1)) / COLS
  const HIT_LINE_Y = canvasHeight - 100
  const NOTE_HEIGHT = Math.max(15, 30 * BASE_PIXELS_PER_MS)
  const PREEMPT = HIT_LINE_Y / BASE_PIXELS_PER_MS

  const audioRef = useRef<HTMLAudioElement | undefined>(undefined)

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audio.preload = 'auto'
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.currentTime = 0
      URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  useEffect(() => {
    if (isGameStart) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'g' && audioRef.current) {
        setIsGameStart(true)

        startTimeRef.current = performance.now()
        audioRef.current.currentTime = 0

        setTimeout(() => audioRef.current?.play(), audioLeadIn)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isGameStart, audioLeadIn])

  const updateTime = () => {
    if (!isGameStart) {
      currentTimeRef.current = -audioLeadIn
      return
    }

    if (
      audioRef.current &&
      audioRef.current.currentTime > 0 &&
      currentTimeRef.current < audioRef.current.currentTime * 1000
    ) {
      currentTimeRef.current = audioRef.current.currentTime * 1000
      return
    }

    currentTimeRef.current =
      performance.now() - startTimeRef.current - audioLeadIn
  }

  const registerJudge = (value: RegisterJudge) => {
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
