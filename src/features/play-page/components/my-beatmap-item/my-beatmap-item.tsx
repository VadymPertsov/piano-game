import * as Accordion from '@radix-ui/react-accordion'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@src/shared/constants/routes'
import { Beatmap } from '@src/shared/types/beatmap'

import styles from './styles.module.scss'

interface BeatmapItemProps {
  item: Beatmap
  onClick: (item: Beatmap) => void
}

export const BeatmapItem = memo(({ item, onClick }: BeatmapItemProps) => (
  <Accordion.Item value={String(item.title)} className={styles.root}>
    <Accordion.Trigger className={styles.item} onClick={() => onClick(item)}>
      {item.artist} - {item.title}
    </Accordion.Trigger>
    <Accordion.Content className={styles.content}>
      {item.beatmapSet.map(set => (
        <Link
          key={set.version}
          to={`${ROUTES.play}/${set.beatmapsetId}/${formatVersion(
            set.version
          )}`}
          className={styles.item}
        >
          {set.version}
        </Link>
      ))}
    </Accordion.Content>
  </Accordion.Item>
))

const formatVersion = (version: string) => {
  return version.replace(/^\[.*?\]\s*/, '')
}
