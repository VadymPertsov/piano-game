import { NoteHighlight } from './types'

export const HOLD_NOTE = 128
export const TAB_NOTE = 1

export const KEYS = ['d', 'f', 'j', 'k']

export const OFFSET = 0
export const SIDE_PADDING = 0
export const GAP = 0

export const SCROLL_SCALE = 0.45

export const NOTE_HIGHLIGHT_COLORS: Record<NoteHighlight, number | null> = {
  transparent: null,
  click: 0x1a5a6a,
  tap: 0x006633,
  miss: 0x661111,
}
