import { memo, useCallback, useEffect, useState } from 'react'

import { Beatmap } from '@src/shared/types/beatmap'

import styles from './styles.module.scss'
import { useMyBeatmapList } from '../../hooks/use-my-beatmap-list'

export const MyBeatmapList = () => {
  const { data = [], isLoading } = useMyBeatmapList()

  const [selectedBeatmap, setSelectedBeatmap] = useState<Beatmap | null>(null)

  useEffect(() => {
    if (data[0] && !selectedBeatmap) {
      setSelectedBeatmap(data[0])
    }
  }, [data, selectedBeatmap])

  const handleSelectBeatmap = useCallback((beatmap: Beatmap) => {
    setSelectedBeatmap(beatmap)
  }, [])

  if (isLoading) return 'Loading...'
  if (!data.length) return 'No beatmaps found...'
  if (!selectedBeatmap) return null

  return (
    <div
      className={styles.root}
      style={{ backgroundImage: `url(${selectedBeatmap.picture})` }}
    >
      <div></div>
      <ul className={styles.list}>
        {data.map(item => (
          <BeatmapItem
            key={item.title}
            item={item}
            onClick={handleSelectBeatmap}
          />
        ))}
      </ul>
    </div>
  )
}

interface BeatmapItemProps {
  item: Beatmap
  onClick: (item: Beatmap) => void
}

const BeatmapItem = memo(({ item, onClick }: BeatmapItemProps) => {
  return (
    <li className={styles.item} onClick={() => onClick(item)}>
      {item.artist} - {item.title}
    </li>
  )
})
