import { animated, useSpring } from '@react-spring/web'
import { ReactNode } from 'react'
import useMeasure from 'react-use-measure'

import { usePrevious } from '@/lib/hooks/use-previous'

type AnimatedContainerProps = {
  isOpen: boolean
  children: ReactNode
}

export function CollapseTree({
  isOpen,
  children,
}: AnimatedContainerProps) {
  const [ref, { height: viewHeight }] = useMeasure()
  const previous = usePrevious(isOpen)

  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
    config: { tension: 300, friction: 30 },
  })

  return (
    <animated.div
      style={{
        opacity,
        height: isOpen && previous === isOpen ? 'auto' : height,
        overflow: 'hidden',
      }}
    >
      <animated.div ref={ref} style={{ y }}>
        {children}
      </animated.div>
    </animated.div>
  )
}
