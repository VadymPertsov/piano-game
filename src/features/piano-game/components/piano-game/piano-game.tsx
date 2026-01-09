import { Application } from '@pixi/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useBodyBackground } from '@src/shared/hooks/use-body-background'
import { useCurrentBeatmapStore } from '@src/store/current-beatmap-store'

import { GameScene } from '../game-scene'
import { useLoadParsedBeatmap } from './use-load-parsed-beatmap'

import styles from './styles.module.scss'

export const PianoGame = () => {
  const { title } = useParams<{ title?: string }>()

  const beatmap = useCurrentBeatmapStore(s => s.beatmap)

  const navigate = useNavigate()

  const [canvasHeight, setCanvasHeight] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading } = useLoadParsedBeatmap(title)

  useBodyBackground(data?.bgUrl)

  useEffect(() => {
    if (beatmap !== title) {
      navigate('*', { replace: true })
    }
  }, [beatmap, title, navigate])

  useLayoutEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasHeight(canvasRef.current.clientHeight)
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const canvasWidth = data ? data.settings.difficulty.cs * 128 : 0

  return (
    <div className={styles.root} ref={canvasRef}>
      {isLoading || !data || !canvasHeight ? (
        <>Loading beatmap and preparing canvas...</>
      ) : (
        <Application
          antialias
          autoDensity
          width={canvasWidth}
          height={canvasHeight}
          backgroundAlpha={0.5}
          eventFeatures={{
            move: true,
            globalMove: false,
            click: true,
            wheel: false,
          }}
        >
          <GameScene
            data={data}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
        </Application>
      )}
    </div>
  )
}
