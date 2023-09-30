import { DebounceSettings, debounce } from 'lodash'
import { useState, useEffect } from 'react'

type Props = {
  delay?: number
  delaySetting?: DebounceSettings
  smallSize?: number
  options?: {
    needWindowSize?: boolean
    needSmallSize?: boolean
  }
}

// Hook
export default function useWindowSize(props?: Props) {
  const { delay, delaySetting, smallSize, options } = props || {
    delay: undefined,
    delaySetting: undefined,
    smallSize: undefined,
    options: undefined,
  }

  const [windowSize, setWindowSize] = useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: undefined,
    height: undefined,
  })
  const [isSmallSize, setIsSmallSize] = useState(false)

  const { needWindowSize, needSmallSize } = options || {
    needWindowSize: true,
    needSmallSize: true,
  }

  const handleGetIsSmallSize = () => {
    if (!!window.innerWidth && window.innerWidth <= (smallSize || 576)) {
      setIsSmallSize(true)
    } else {
      setIsSmallSize(false)
    }
  }

  useEffect(() => {
    const handleUpdate = () => {
      if (needWindowSize !== undefined ? needWindowSize : true) {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      if (needSmallSize !== undefined ? needSmallSize : true) {
        handleGetIsSmallSize()
      }
    }

    const handleDebounceUpdate = debounce(
      () => handleUpdate(),
      delay,
      delaySetting
    )

    const handleResize = () => {
      if (delay) {
        handleDebounceUpdate()
      } else {
        handleUpdate()
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { windowSize, isSmallSize }
}
