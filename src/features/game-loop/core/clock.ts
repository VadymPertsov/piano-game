export const createClock = (audioLeadIn: number) => {
  let startedAt = 0
  let started = false

  const start = () => {
    startedAt = performance.now()
    started = true
  }

  const reset = () => {
    started = false
    startedAt = 0
  }

  const time = () => {
    if (!started) return -audioLeadIn
    return performance.now() - startedAt - audioLeadIn
  }

  return {
    start,
    reset,
    time,
  }
}
