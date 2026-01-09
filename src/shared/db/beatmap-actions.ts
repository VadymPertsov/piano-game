import { beatmapDB } from './beatmap-db'
import { ParsedBeatmapData, SavedRawBeatmap } from '../types/beatmap-prepare'

export const saveRawBeatmap = async (item: SavedRawBeatmap) => {
  const db = await beatmapDB
  await db.put('raw', item, item.localTitle)
}

export const loadRawBeatmap = async (
  title: SavedRawBeatmap['localTitle']
): Promise<SavedRawBeatmap | undefined> => {
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
