import { useParams } from 'react-router-dom'

import { GameScene } from '@src/features/game-scene'

export const GamePage = () => {
  const { title } = useParams<{ title?: string }>()

  return <GameScene title={title} />
}
