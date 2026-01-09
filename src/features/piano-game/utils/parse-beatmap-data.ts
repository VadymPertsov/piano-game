import {
  ParsedBeatmapData,
  TimingPoints,
  ColumnNote,
  SavedRawBeatmap,
} from '@src/shared/types/beatmap-prepare'

import { HOLD_NOTE } from '../game-constants'

type Sections =
  | 'Metadata'
  | 'Difficulty'
  | 'General'
  | 'Editor'
  | 'TimingPoints'
  | 'HitObjects'

interface ParseBeatmapData extends Omit<SavedRawBeatmap, 'beatmap'> {
  rawBeatmap: string
  canvasWidth?: number
}

export const parseBeatmapData = ({
  localTitle,
  rawBeatmap,
  audios,
  canvasWidth = 500,
  pictures,
}: ParseBeatmapData): ParsedBeatmapData => {
  const sections = parseRawSections(rawBeatmap)

  const metadata = parseSectionToMap(sections['Metadata'])
  const difficulty = parseSectionToMap(sections['Difficulty'])
  const general = parseSectionToMap(sections['General'])

  const COLS = Number(difficulty.CircleSize)

  return {
    localTitle,
    audios,
    pictures,
    title: metadata.Title ?? '',
    artist: metadata.Artist ?? '',
    version: metadata.Version ?? '',
    settings: {
      audioLeadIn: Number(general.AudioLeadIn),
      difficulty: {
        cs: COLS,
        ar: Number(difficulty.ApproachRate),
        od: Number(difficulty.OverallDifficulty),
        sliderMultiplier: Number(difficulty.SliderMultiplier),
      },
      editor: {
        distanceSpacing: Number(
          parseSectionToMap(sections['Editor']).DistanceSpacing
        ),
      },
    },
    timings: parseTimings(sections['TimingPoints']),
    columnNotes: parseNotes(sections['HitObjects'], canvasWidth, COLS),
  }
}

const parseRawSections = (text: string): Record<Sections, string> => {
  const parts = text.split(/^\[(.+)\]/gm)

  return parts.slice(1).reduce((acc, curr, i, array) => {
    if (i % 2 === 0) {
      const sectionName = curr.trim() as Sections
      const sectionBody = array[i + 1]?.trim() ?? ''

      acc[sectionName] = sectionBody
    }

    return acc
  }, {} as Record<Sections, string>)
}

const parseSectionToMap = (sectionText: string = '') => {
  return sectionText.split('\n').reduce((acc, line) => {
    const [key, ...val] = line.split(':')
    if (key) acc[key.trim()] = val.join(':').trim()
    return acc
  }, {} as Record<string, string>)
}

const parseTimings = (text: string = ''): TimingPoints[] => {
  return text.split('\n').map(line => {
    const p = line.split(',')

    const time = Number(p[0])
    const beatLength = Number(p[1])
    const uninherited = Number(p[6])

    return {
      time,
      beatLength,
      uninherited: uninherited === 1,
    }
  })
}

const parseNotes = (
  text: string = '',
  canvasWidth: number,
  columns: number
): ColumnNote[][] => {
  const columnNotes: ColumnNote[][] = Array.from({ length: columns }, () => [])

  text.split('\n').forEach(line => {
    const p = line.split(',')
    const x = Number(p[0])
    const startTime = Number(p[2])
    const type = Number(p[3])

    const calcColumns = Math.floor(x / (canvasWidth / columns))

    const column = Math.max(0, Math.min(columns - 1, calcColumns))

    const currentColumn = columnNotes[column]
    if (!currentColumn) return

    if (type & HOLD_NOTE) {
      const endTime = p[5] ? Number(p[5].split(':')[0]) : undefined
      currentColumn.push({
        column,
        startTime,
        endTime,
      })
    } else {
      currentColumn.push({
        column,
        startTime,
      })
    }
  })

  return columnNotes
}
