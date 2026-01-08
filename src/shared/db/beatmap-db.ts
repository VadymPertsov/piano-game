import { openDB } from 'idb'

export const beatmapDB = openDB('beatmap-db', 1, {
  upgrade(db) {
    db.createObjectStore('raw')
    db.createObjectStore('parsed')
  },
})
