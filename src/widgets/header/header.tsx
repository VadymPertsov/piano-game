import { Link } from 'react-router-dom'

import { ROUTES } from '@src/shared/constants/routes'
import { MaxContainerWrapper } from '@src/shared/ui/max-container-wrapper'

import styles from './styles.module.scss'

export const Header = () => {
  return (
    <header className={styles.root}>
      <MaxContainerWrapper className={styles.wrapper}>
        <Link to={ROUTES.home} className={styles.logo}>
          PianoMania
        </Link>
        <nav>
          <ul className={styles.list}>
            {Object.entries(ROUTES).map(([label, path]) => (
              <li key={path}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </MaxContainerWrapper>
    </header>
  )
}
