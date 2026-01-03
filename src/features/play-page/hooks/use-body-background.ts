import { useEffect } from 'react'

export const useBodyBackground = (bgUrl?: string) => {
  useEffect(() => {
    if (!bgUrl) return

    const prevBgImage = document.body.style.backgroundImage
    const prevBgRepeat = document.body.style.backgroundRepeat
    const prevBgSize = document.body.style.backgroundSize

    document.body.style.backgroundImage = `url(${bgUrl})`
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.transition = 'background-image 0.3s ease'

    return () => {
      document.body.style.backgroundImage = prevBgImage
      document.body.style.backgroundSize = prevBgSize
      document.body.style.backgroundRepeat = prevBgRepeat
    }
  }, [bgUrl])
}
