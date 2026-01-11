import { JudgePoints, JudgeWindows } from '@src/shared/types/beatmap-prepare'

export const createJudge = () => {
  let maxCombo = 0
  let currentCombo = 0
  let score = 0
  let currentJudge: JudgePoints | undefined = undefined
  let lastUpdate = 0
  let summary: JudgeWindows = {
    '0': 0,
    '50': 0,
    '100': 0,
    '200': 0,
    '300': 0,
    '320': 0,
  }

  const apply = (judge: JudgePoints) => {
    summary[judge]++
    currentJudge = judge
    lastUpdate = Date.now()

    if (judge === 0) {
      currentCombo = 0
    } else {
      currentCombo++
      if (currentCombo > maxCombo) {
        maxCombo = currentCombo
      }
    }

    score += judge * (currentCombo > 0 ? currentCombo : 1)
  }

  const reset = () => {
    currentCombo = 0
    maxCombo = 0
    score = 0
    currentJudge = undefined
    summary = {
      '0': 0,
      '50': 0,
      '100': 0,
      '200': 0,
      '300': 0,
      '320': 0,
    }
  }

  return {
    apply,
    reset,

    get summary() {
      return {
        currentCombo,
        maxCombo,
        score,
        currentJudge,
        lastUpdate,
        summary: { ...summary },
      }
    },
  }
}
