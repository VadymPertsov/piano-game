import { JudgeWindows, TimingPoints } from '../types/beatmap-data'

export const makeJudgeWindows = (od: number): JudgeWindows => ({
  '320': 16,
  '300': Math.max(1, 64 - 3 * od),
  '200': Math.max(1, 97 - 3 * od),
  '100': Math.max(1, 127 - 3 * od),
  '50': Math.max(1, 151 - 3 * od),
  '0': Math.max(1, 188 - 3 * od),
})

export const makeSVPoints = (timings: TimingPoints[]) =>
  timings.filter(tp => !tp.uninherited).sort((a, b) => a.time - b.time)
