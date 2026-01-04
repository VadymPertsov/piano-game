import * as Accordion from '@radix-ui/react-accordion'
import { useCallback, useEffect, useState } from 'react'

import { useBodyBackground } from '@src/shared/hooks/use-body-background'
import { Beatmap } from '@src/shared/types/beatmap'

import { useMyBeatmapList } from '../../hooks/use-my-beatmap-list'
import { BeatmapItem } from '../my-beatmap-item'

import styles from './styles.module.scss'

export const MyBeatmapList = () => {
  const { data = [], isLoading } = useMyBeatmapList()

  const [selectedBeatmap, setSelectedBeatmap] = useState<Beatmap | null>(null)

  useEffect(() => {
    if (data[0] && !selectedBeatmap) {
      setSelectedBeatmap(data[0])
    }
  }, [data, selectedBeatmap])

  useBodyBackground(selectedBeatmap?.picture)

  const handleSelectBeatmap = useCallback((beatmap: Beatmap) => {
    setSelectedBeatmap(beatmap)
  }, [])

  if (isLoading) return 'Loading...'
  if (!data.length) return 'No beatmaps found...'
  if (!selectedBeatmap) return null

  return (
    <div className={styles.root}>
      <div></div>
      <Accordion.Root type="single" collapsible className={styles.list}>
        {data.map(item => (
          <BeatmapItem
            key={item.title}
            item={item}
            onClick={handleSelectBeatmap}
          />
        ))}
      </Accordion.Root>
    </div>
  )
}
