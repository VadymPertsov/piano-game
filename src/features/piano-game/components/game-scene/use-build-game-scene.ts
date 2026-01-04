import { useEffect, useMemo, useRef, useState } from 'react'

import { GameConfig } from '../../stores/game-config-store'

export const useBuildGameScene = (audioUrl: string, config: GameConfig) => {
  const [isGameStart, setIsGameStart] = useState<boolean>(false)

  const startTimeRef = useRef<number>(0)

  const audio = useMemo(() => new Audio(audioUrl), [audioUrl])

  const timeNow = () => {
    if (!audio) return 0

    if (!isGameStart) return -config.audioLeadIn

    if (audio.currentTime > 0) return audio.currentTime * 1000

    return startTimeRef.current
      ? performance.now() - startTimeRef.current - config.audioLeadIn
      : 0
  }

  useEffect(() => {
    if (isGameStart) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'g') return

      setIsGameStart(true)

      startTimeRef.current = performance.now()

      audio.currentTime = 0

      setTimeout(() => {
        audio.play()
      }, config.audioLeadIn)

      window.removeEventListener('keydown', onKeyDown)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [audio, config.audioLeadIn, isGameStart])

  return {
    isGameStart,
    timeNow,
  }
}
