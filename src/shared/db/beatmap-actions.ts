import { beatmapDB } from './beatmap-db'
import { ImportedBeatmapSet, ParsedBeatmapData } from '../types/beatmap-prepare'

export const saveRawBeatmap = async (item: ImportedBeatmapSet) => {
  const db = await beatmapDB
  await db.put('raw', item.data.buffer, item.title)
}

export const loadRawBeatmap = async (
  title: ImportedBeatmapSet['title']
): Promise<ImportedBeatmapSet['data'] | undefined> => {
  const db = await beatmapDB
  return db.get('raw', title)
}

export const saveParsedBeatmap = async (item: ParsedBeatmapData) => {
  const db = await beatmapDB
  await db.put('parsed', item, item.title)
}

export const loadParsedBeatmap = async (
  title: ParsedBeatmapData['title']
): Promise<ParsedBeatmapData | undefined> => {
  const db = await beatmapDB
  return db.get('parsed', title)
}
