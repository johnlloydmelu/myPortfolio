import { useEffect, useRef } from 'react'

export default function CursorFollower() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const canUseCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cursor = cursorRef.current
    if (!cursor || !canUseCustomCursor || reduceMotion) return undefined

    let frame = 0
    let targetX = -100
    let targetY = -100
    let currentX = targetX
    let currentY = targetY

    const animate = () => {
      currentX += (targetX - currentX) * 0.22
      currentY += (targetY - currentY) * 0.22
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      if (Math.abs(targetX - currentX) > 0.35 || Math.abs(targetY - currentY) > 0.35) {
        frame = window.requestAnimationFrame(animate)
      } else {
        frame = 0
      }
    }

    const move = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      const target = event.target instanceof Element ? event.target : null
      cursor.dataset.interactive = String(Boolean(target?.closest('a, button, [role="button"]')))
      cursor.dataset.view = String(Boolean(target?.closest('#projects .project-row')))
      cursor.dataset.active = 'true'
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const leave = () => {
      cursor.dataset.active = 'false'
      cursor.dataset.view = 'false'
      cursor.dataset.interactive = 'false'
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={cursorRef} className="cursor-follower" aria-hidden="true"><span className="cursor-ring" /><span className="cursor-dot" /><span className="cursor-label">View</span></div>
}
