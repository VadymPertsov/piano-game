import { create } from 'zustand'

import { ColumnNote, JudgeWindows, TimingPoints } from '../types/beatmap-data'

export interface GameConfig {
  colWidth: number
  hitLineY: number
  noteHeight: number
  basePixelsPerMs: number
  canvasHeight: number
  canvasWidth: number
  cols: number
  preempt: number
  judgeWindows: JudgeWindows
  audioLeadIn: number
}

interface InitGameConfig {
  config: GameConfig
  notes: ColumnNote[][]
  timings: TimingPoints[]
  filteredSVPoints: TimingPoints[]
  audioUrl: string
}

interface GameState {
  notes: ColumnNote[][]
  timings: TimingPoints[]

  filteredSVPoints: TimingPoints[]

  audioUrl: string

  config: GameConfig

  initGame: ({
    config,
    notes,
    timings,
    filteredSVPoints,
    audioUrl,
  }: InitGameConfig) => void

  getDistanceFromHitline: (noteTime: number, currentTime: number) => number

  getSV: (time: number) => number

  getSVSegments: (
    start: number,
    end: number
  ) => { from: number; to: number; sv: number }[]

  getJudgement: (delta: number) => number
}

export const useGameConfigStore = create<GameState>((set, get) => ({
  notes: [],
  timings: [],

  filteredSVPoints: [],

  audioUrl: '',

  config: {
    colWidth: 0,
    hitLineY: 0,
    noteHeight: 0,
    basePixelsPerMs: 0,
    canvasHeight: 0,
    canvasWidth: 0,
    cols: 0,
    preempt: 0,
    audioLeadIn: 0,
    judgeWindows: {
      max: 16,
      w300: 0,
      w200: 0,
      w100: 0,
      w50: 0,
      miss: 0,
    },
  },

  initGame: ({
    config,
    notes,
    timings,
    filteredSVPoints,
    audioUrl,
  }: InitGameConfig) =>
    set({ config, notes, timings, filteredSVPoints, audioUrl }),

  getDistanceFromHitline: (noteTime, currentTime) => {
    if (noteTime === currentTime) return 0

    const {
      getSVSegments,
      config: { basePixelsPerMs },
    } = get()

    const from = Math.min(noteTime, currentTime)
    const to = Math.max(noteTime, currentTime)

    const segments = getSVSegments(from, to)
    let distance = 0

    for (const seg of segments) {
      distance += (seg.to - seg.from) * basePixelsPerMs * seg.sv
    }

    return currentTime <= noteTime ? distance : -distance
  },

  getSV: time => {
    const { timings } = get()
    let sv = 1.0

    for (let i = timings.length - 1; i >= 0; i--) {
      const tp = timings[i]

      if (tp && tp.time <= time) {
        if (!tp.uninherited) {
          sv = 100 / Math.abs(tp.beatLength)
        }
        break
      }
    }

    return sv
  },

  getSVSegments: (start, end) => {
    if (start >= end) return []

    const { filteredSVPoints, getSV } = get()

    const segments = []

    let currentTime = start
    let currentSV = getSV(start)

    let i = 0

    while (i < filteredSVPoints.length) {
      const svPoint = filteredSVPoints[i]
      if (!svPoint || svPoint.time > start) break
      i++
    }

    while (currentTime < end) {
      let nextTime = end

      const svPoint = filteredSVPoints[i]

      if (i < filteredSVPoints.length && svPoint && svPoint.time < end) {
        nextTime = svPoint.time
      }

      segments.push({ from: currentTime, to: nextTime, sv: currentSV })

      currentTime = nextTime

      if (currentTime < end) {
        currentSV = getSV(currentTime)

        if (
          i < filteredSVPoints.length &&
          svPoint &&
          svPoint.time === currentTime
        )
          i++
      }
    }

    return segments
  },

  getJudgement: delta => {
    const {
      config: { judgeWindows },
    } = get()

    const d = Math.abs(delta)
    if (d <= judgeWindows.max) return 320
    if (d <= judgeWindows.w300) return 300
    if (d <= judgeWindows.w200) return 200
    if (d <= judgeWindows.w100) return 100
    if (d <= judgeWindows.w50) return 50
    return 0
  },
}))
