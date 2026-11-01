import { useEffect, useRef, useState } from 'react'
import { profile } from '../config.js'
import { MenuIcon, CloseIcon } from './Icons.jsx'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Tech stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const menuButtonRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const sections = links.map(({ href }) => document.querySelector(href)).filter(Boolean)
    const updateActiveSection = () => {
      const marker = window.innerHeight * .38
      const activeSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect()
        return bounds.top <= marker && bounds.bottom > marker
      }) || sections.filter((section) => section.getBoundingClientRect().top <= marker).at(-1)

      if (activeSection) setActive(`#${activeSection.id}`)
    }
    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: '-32% 0px -56% 0px',
      threshold: 0,
    })
    sections.forEach((section) => observer.observe(section))
    updateActiveSection()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        const progress = total > 0 ? Math.min(1, window.scrollY / total) : 0
        progressRef.current?.style.setProperty('--progress', String(progress))
        frame = 0
      })
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    updateProgress()
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a href="#home" className="wordmark" aria-label={`${profile.name}, home`}><span>whoami</span><i>—</i></a>
        <ul className="desktop-nav">
          {links.map((link) => <li key={link.href}><a className={active === link.href ? 'is-active' : ''} aria-current={active === link.href ? 'location' : undefined} href={link.href} data-label={link.label}><span className="nav-link-text" data-label={link.label}>{link.label}</span></a></li>)}
        </ul>
        <a className="nav-contact" href="#contact" data-magnetic>Let’s talk <span aria-hidden="true">↗</span></a>
        <button ref={menuButtonRef} type="button" className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>
      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} hidden={!open}>
        {links.map((link, index) => <a key={link.href} href={link.href} data-label={link.label} onClick={() => setOpen(false)}><span className="mobile-link-index">0{index + 1}</span><span className="nav-link-text" data-label={link.label}>{link.label}</span><b aria-hidden="true">↗</b></a>)}
      </div>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
    </header>
  )
}
