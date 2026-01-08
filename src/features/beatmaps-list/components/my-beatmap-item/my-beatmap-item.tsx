import * as Accordion from '@radix-ui/react-accordion'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@src/shared/constants/routes'
import { saveRawBeatmap } from '@src/shared/db/beatmap-actions'
import {
  ImportedBeatmap,
  ImportedBeatmapSet,
} from '@src/shared/types/beatmap-prepare'
import { useCurrentBeatmapStore } from '@src/store/current-beatmap-store'

import { useParseBeatmapSet } from './use-parse-beatmap-set'

import styles from './styles.module.scss'

interface BeatmapItemProps {
  item: ImportedBeatmap
}

export const BeatmapItem = memo(({ item }: BeatmapItemProps) => {
  return (
    <Accordion.Item value={String(item.title)} className={styles.root}>
      <Accordion.Trigger className={styles.item}>
        {item.title}
      </Accordion.Trigger>
      <Accordion.Content className={styles.content}>
        <AccordionItem {...item} />
      </Accordion.Content>
    </Accordion.Item>
  )
})

const AccordionItem = (item: ImportedBeatmap) => {
  const beatmapSet = useParseBeatmapSet(item)
  const setBeatmap = useCurrentBeatmapStore(s => s.setBeatmap)

  const navigate = useNavigate()

  const handlePickBeatmap = async (map: ImportedBeatmapSet) => {
    await saveRawBeatmap(map)

    setBeatmap(map.title)

    navigate(`${ROUTES.play}/${map.title}`)
  }

  if (beatmapSet.isLoading) return 'Loading...'
  if (!beatmapSet.data || !beatmapSet.data.length) return 'No maps here'

  return beatmapSet.data.map(map => (
    <button
      key={map.title}
      className={styles.item}
      onClick={() => handlePickBeatmap(map)}
    >
      {map.title}
    </button>
  ))
}
