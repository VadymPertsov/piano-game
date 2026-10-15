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
  let finished = false

  const start = () => {
    if (playing) return

    playing = true
    finished = false

    clock.start()
  }

  const reset = () => {
    playing = false
    finished = false

    clock.reset()
    judge.reset()
    audio.reset()
  }

  const restart = () => {
    reset()

    notes = createNotesManager(createNotes())

    start()
  }

  const update = () => {
    if (!playing || finished) return

    const time = clock.time()
    audio.tryPlay(time)

    const result = notes.update(time)
    if (result !== undefined) {
      judge.apply(result)
    }

    if (audio.ended) {
      finish()
    }
  }

  const finish = () => {
    playing = false
    finished = true
  }

  const hit = (column: number) => {
    if (!playing || finished) return

    const result = notes.hit(column, clock.time())
    if (result !== undefined) {
      judge.apply(result.judge)
    }
  }

  const release = (column: number) => {
    if (!playing || finished) return

    const result = notes.release(column, clock.time())
    if (result !== undefined) {
      judge.apply(result.judge)
    }
  }

  return {
    start,
    reset,
    restart,
    update,
    hit,
    release,

    get judge() {
      return judge.judge
    },
    get playing() {
      return playing
    },
    get finished() {
      return finished
    },
  }
}

export type GameReturn = ReturnType<typeof createGame> | null
