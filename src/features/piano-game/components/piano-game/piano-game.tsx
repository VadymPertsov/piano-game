import { Application } from '@pixi/react'
import { useNavigate, useParams } from 'react-router-dom'

import { useCurrentBeatmapStore } from '@src/store/current-beatmap-store'

import { GameScene } from '../game-scene'
import { useLoadParsedBeatmap } from './use-load-parsed-beatmap'

import styles from './styles.module.scss'

export const PianoGame = () => {
  const { title } = useParams<{ title?: string }>()

  const beatmap = useCurrentBeatmapStore(s => s.beatmap)

  const navigate = useNavigate()

  const { data, isLoading } = useLoadParsedBeatmap(title)

  if (beatmap !== title) {
    navigate('*', { replace: true })
  }

  if (isLoading) return 'Loading...'
  if (!data) return 'Loading beatmap...'

  return (
    <div className={styles.root}>
      <Application
        antialias
        autoDensity
        width={500}
        height={700}
        backgroundAlpha={0.5}
        eventFeatures={{
          move: true,
          globalMove: false,
          click: true,
          wheel: false,
        }}
      >
        <GameScene data={data} />
      </Application>
    </div>
  )
}
