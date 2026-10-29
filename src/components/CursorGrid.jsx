import { useEffect, useRef } from 'react'

export default function CursorGrid() {
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!grid || !canHover || reduceMotion) return

    let targetX = -200
    let targetY = -200
    let currentX = targetX
    let currentY = targetY
    let frame = 0

    const animate = () => {
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18
      grid.style.setProperty('--cursor-x', `${currentX}px`)
      grid.style.setProperty('--cursor-y', `${currentY}px`)

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frame = requestAnimationFrame(animate)
      } else {
        frame = 0
      }
    }

    const onPointerMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      grid.dataset.active = 'true'
      if (!frame) frame = requestAnimationFrame(animate)
    }

    const onPointerLeave = () => {
      grid.dataset.active = 'false'
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={gridRef} className="cursor-grid" aria-hidden="true" />
}
