export const createAudio = (url: string) => {
  const audio = new Audio(url)
  audio.preload = 'auto'
  audio.volume = 0.5

  let started = false

  const tryPlay = (time: number) => {
    if (started) return
    if (time >= 0) {
      started = true
      audio.currentTime = 0
      audio.play()
    }
  }

  const reset = () => {
    started = false
    audio.pause()
    audio.currentTime = 0
    URL.revokeObjectURL(url)
  }

  return {
    tryPlay,
    reset,

    get time() {
      return audio.currentTime * 1000
    },
  }
}
