import { createNotesManager } from '../notes/notes-manager'
import { GameNote } from '../types'
import { createAudio } from './audio'
import { createClock } from './clock'
import { createJudge } from './judge'

export const createGame = (
  createNotes: () => GameNote[][],
  audioLeadIn: number,
  audioUrl: string
) => {
  const audio = createAudio(audioUrl)
  const clock = createClock(audioLeadIn)
  const judge = createJudge()

  let notes = createNotesManager(createNotes())

  let playing = false

  const start = () => {
    if (playing) return
    playing = true

    clock.start()
  }

  const restart = () => {
    playing = false

    clock.reset()
    judge.reset()
    audio.reset()

    notes = createNotesManager(createNotes())

    start()
  }

  const update = () => {
    if (!playing) return

    const time = clock.time()
    audio.tryPlay(time)

    const result = notes.update(time)
    if (result === undefined) return
    judge.apply(result)
  }

  const hit = (column: number) => {
    const result = notes.hit(column, clock.time())
    if (result === undefined) return
    judge.apply(result.judge)
  }

  const release = (column: number) => {
    const result = notes.release(column, clock.time())
    if (result === undefined) return
    judge.apply(result.judge)
  }

  return {
    start,
    restart,
    update,
    hit,
    release,

    get summary() {
      return judge.summary
    },
  }
}
