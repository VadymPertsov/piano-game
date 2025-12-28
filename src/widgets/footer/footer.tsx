import { MaxContainerWrapper } from '@src/shared/ui/max-container-wrapper'

import styles from './styles.module.scss'

export const Footer = () => {
  return (
    <footer className={styles.root}>
      <MaxContainerWrapper>
        © {new Date().getFullYear()} Piano Mania
      </MaxContainerWrapper>
    </footer>
  )
}
