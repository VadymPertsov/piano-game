import * as Accordion from '@radix-ui/react-accordion'

import { useParseBeatmapSet } from './use-parse-beatmaps-list'
import { BeatmapItem } from '../my-beatmap-item'

import styles from './styles.module.scss'

export const MyBeatmapList = () => {
  const beatmaps = useParseBeatmapSet()

  if (beatmaps.isLoading) return 'Loading ...'
  if (!beatmaps.data || !beatmaps.data.length) return 'No beatmaps found...'

  return (
    <div className={styles.root}>
      <div></div>
      <Accordion.Root type="single" collapsible className={styles.list}>
        {beatmaps.data.map(item => (
          <BeatmapItem key={item.title} item={item} />
        ))}
      </Accordion.Root>
    </div>
  )
}
