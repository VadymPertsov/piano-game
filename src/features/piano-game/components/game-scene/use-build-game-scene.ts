import { useEffect, useMemo, useRef, useState } from 'react'

import { GameConfig } from '../../stores/game-config-store'
import {
  ColumnNote,
  GameResults,
  RegisterJudge,
} from '../../types/beatmap-data'

export const useBuildGameScene = (audioUrl: string, config: GameConfig) => {
  const [isGameStart, setIsGameStart] = useState<boolean>(false)

  const startTimeRef = useRef<number>(0)

  const gameResults = useRef<GameResults>({
    currentCombo: 0,
    maxCombo: 0,
    score: 0,
    summary: { '320': 0, '300': 0, '200': 0, '100': 0, '50': 0, '0': 0 },
  })

  const audio = useMemo(() => new Audio(audioUrl), [audioUrl])

  const registerJudge = (value: RegisterJudge) => {
    gameResults.current.summary[value]++
    gameResults.current.currentCombo++
    gameResults.current.maxCombo = Math.max(
      gameResults.current.maxCombo,
      gameResults.current.currentCombo
    )
    gameResults.current.score += value * gameResults.current.currentCombo
  }

  const registerMiss = (note: ColumnNote, isTail: boolean = false) => {
    if (note.missed) return

    if (isTail) {
      note.tailHit = true
    } else {
      note.hit = true
    }

    note.missed = true

    gameResults.current.summary[0]++
    gameResults.current.currentCombo = 0
  }

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
    gameResults,
    registerMiss,
    registerJudge,
  }
}
