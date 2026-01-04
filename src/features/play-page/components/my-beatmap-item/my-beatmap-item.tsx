import * as Accordion from '@radix-ui/react-accordion'
import { memo, useCallback } from 'react'
import { To, useNavigate } from 'react-router-dom'

import { ROUTES } from '@src/shared/constants/routes'
import { Beatmap } from '@src/shared/types/beatmap'
import { useCurrentBeatmapStore } from '@src/store/current-beatmap-store'

import styles from './styles.module.scss'

interface BeatmapItemProps {
  item: Beatmap
  onClick: (item: Beatmap) => void
}

export const BeatmapItem = memo(({ item, onClick }: BeatmapItemProps) => {
  const setBeatmap = useCurrentBeatmapStore(s => s.setBeatmap)

  const navigate = useNavigate()

  const handlePickBeatmap = useCallback(
    ({ beatmap, path }: { beatmap: Beatmap; path: To }) => {
      setBeatmap(beatmap)
      navigate(path)
    },
    [setBeatmap, navigate]
  )

  return (
    <Accordion.Item value={String(item.title)} className={styles.root}>
      <Accordion.Trigger className={styles.item} onClick={() => onClick(item)}>
        {item.artist} - {item.title}
      </Accordion.Trigger>
      <Accordion.Content className={styles.content}>
        {item.beatmapSet.map(set => (
          <button
            key={set.version}
            onClick={() =>
              handlePickBeatmap({
                beatmap: item,
                path: `${ROUTES.play}/${set.beatmapsetId}/${formatVersion(
                  set.version
                )}`,
              })
            }
            className={styles.item}
          >
            {set.version}
          </button>
        ))}
      </Accordion.Content>
    </Accordion.Item>
  )
})

const formatVersion = (version: string) => {
  return version.replace(/^\[.*?\]\s*/, '')
}
