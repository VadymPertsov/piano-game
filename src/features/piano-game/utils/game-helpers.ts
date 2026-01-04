import { JudgeWindows, TimingPoints } from '../types/beatmap-data'

export const makeJudgeWindows = (od: number): JudgeWindows => ({
  max: 16,
  w300: Math.max(1, 64 - 3 * od),
  w200: Math.max(1, 97 - 3 * od),
  w100: Math.max(1, 127 - 3 * od),
  w50: Math.max(1, 151 - 3 * od),
  miss: Math.max(1, 188 - 3 * od),
})

export const makeSVPoints = (timings: TimingPoints[]) =>
  timings.filter(tp => !tp.uninherited).sort((a, b) => a.time - b.time)
