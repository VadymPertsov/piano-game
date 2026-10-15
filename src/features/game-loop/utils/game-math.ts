import {
  JudgePoints,
  JudgeWindows,
  SVSegment,
  TimingPoints,
} from '@src/shared/types/beatmap-prepare'

export const makeJudgeWindows = (od: number): JudgeWindows => ({
  '320': od <= 5 ? 22.4 - 0.6 * od : 24.9 - 1.1 * od,
  '300': 64 - 3 * od,
  '200': 97 - 3 * od,
  '100': 127 - 3 * od,
  '50': 151 - 3 * od,
  '0': 188 - 3 * od,
})

export const getJudgement = (
  delta: number,
  judgeWindows: JudgeWindows
): JudgePoints => {
  const d = Math.abs(delta)
  if (d <= judgeWindows[320]) return 320
  if (d <= judgeWindows[300]) return 300
  if (d <= judgeWindows[200]) return 200
  if (d <= judgeWindows[100]) return 100
  if (d <= judgeWindows[50]) return 50
  return 0
}

export const buildSVTimeline = (
  timingPoints: TimingPoints[],
  basePixelsPerMs: number,
  audioLeadIn: number
): SVSegment[] => {
  const allPoints = [...timingPoints].sort((a, b) => a.time - b.time)

  const timeline: SVSegment[] = []

  let lastTime = -audioLeadIn
  let lastSV = 1.0
  let cumulativePx = 0

  for (const tp of allPoints) {
    if (tp.time > lastTime) {
      const pxPerMs = basePixelsPerMs * lastSV

      timeline.push({
        from: lastTime,
        to: tp.time,
        sv: lastSV,
        pxPerMs,
        cumulativePx,
      })

      cumulativePx += (tp.time - lastTime) * pxPerMs
    }

    if (tp.uninherited) {
      lastSV = 1.0
    } else {
      lastSV = 100 / Math.abs(tp.beatLength)
    }

    lastTime = tp.time
  }

  timeline.push({
    from: lastTime,
    to: Infinity,
    sv: lastSV,
    pxPerMs: basePixelsPerMs * lastSV,
    cumulativePx,
  })

  return timeline
}

export const getDistanceBetween = (
  fromTime: number,
  toTime: number,
  timeline: SVSegment[]
): number => {
  if (fromTime === toTime) return 0

  const start = Math.min(fromTime, toTime)
  const end = Math.max(fromTime, toTime)

  let dist = 0

  for (const seg of timeline) {
    if (seg.to <= start) continue
    if (seg.from >= end) break

    const a = Math.max(seg.from, start)
    const b = Math.min(seg.to, end)

    dist += (b - a) * seg.pxPerMs
  }

  return fromTime < toTime ? dist : -dist
}
