import { JudgePoints } from '@src/shared/types/beatmap-prepare'

export const KEYS = ['d', 'f', 'j', 'k']

export const OFFSET = 0
export const SIDE_PADDING = 0
export const GAP = 0

export const SCROLL_SCALE = 0.45

export const HIT_COLORS: Record<JudgePoints, number> = {
  '320': 0xffd700,
  '300': 0x00ffff,
  '200': 0x00ff00,
  '100': 0xffa500,
  '50': 0xff69b4,
  '0': 0xff0000,
}
