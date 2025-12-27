import cn from 'classnames'
import { PropsWithChildren } from 'react'

import styles from './styles.module.scss'

interface MaxContainerWrapperProps {
  className?: string
}

export const MaxContainerWrapper = ({
  children,
  className,
}: PropsWithChildren<MaxContainerWrapperProps>) => {
  return <div className={cn(styles.root, className)}>{children}</div>
}
