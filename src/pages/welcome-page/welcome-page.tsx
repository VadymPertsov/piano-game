import { Link } from 'react-router-dom'

import { ROUTES } from '@src/shared/constants/routes'
import { MaxContainerWrapper } from '@src/shared/ui/max-container-wrapper'

import styles from './styles.module.scss'

export const WelcomePage = () => {
  return (
    <MaxContainerWrapper className={styles.root}>
      <h1 className={styles.title}>PianoMania</h1>
      <div className={styles.actions}>
        <Link to={ROUTES.play} className={styles.btn}>
          Play
        </Link>
        <Link to={ROUTES.beatmaps} className={styles.btn}>
          Browse Beatmaps
        </Link>
        <button className={styles.btn}>Settings</button>
      </div>
    </MaxContainerWrapper>
  )
}
