import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import AdminAccess from './components/AdminAccess.jsx'
import CursorFollower from './components/CursorFollower.jsx'
import { useTable } from './hooks/useTable.js'
import { fallbackProjects, fallbackSkills } from './libs/fallbackData.js'
import { supabase } from './libs/supabase.js'
import Lenis from 'lenis'

export default function App() {
  const projects = useTable('projects', fallbackProjects)
  const skills = useTable('skills', fallbackSkills)
  const [portraitUrl, setPortraitUrl] = useState('/john-lloyd-melu.png')

  useEffect(() => {
    if (!supabase) return
    supabase.from('site_settings').select('portrait_url').eq('id', true).maybeSingle()
      .then(({ data }) => { if (data?.portrait_url) setPortraitUrl(data.portrait_url) })
  }, [])

  // Record outbound clicks without delaying navigation. Only coarse browser and
  // referrer details are stored; visitor identity and IP addresses are not.
  useEffect(() => {
    if (!supabase) return undefined
    const recordLinkClick = (event) => {
      const anchor = event.target.closest?.('a[href]')
      if (!anchor) return
      let destination
      try { destination = new URL(anchor.href, window.location.href) } catch { return }
      if (!['http:', 'https:'].includes(destination.protocol)) return
      const current = new URL(window.location.href)
      if (destination.origin === current.origin && !destination.pathname.toLowerCase().endsWith('.pdf')) return
      const ua = navigator.userAgent || ''
      const browser = /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Other'
      const device = /tablet|ipad/i.test(ua) ? 'Tablet' : /mobile|android|iphone/i.test(ua) ? 'Mobile' : 'Desktop'
      const referrerDomain = document.referrer ? (() => { try { return new URL(document.referrer).hostname } catch { return null } })() : null
      const linkLabel = (anchor.getAttribute('aria-label') || anchor.innerText || anchor.title || destination.hostname).trim().slice(0, 120)
      supabase.from('link_clicks').insert({
        destination_url: destination.href.slice(0, 1000),
        destination_domain: destination.hostname.slice(0, 255),
        link_label: linkLabel,
        referrer_domain: referrerDomain,
        browser,
        device,
      }).then(({ error }) => { if (error) console.warn('Could not record link click:', error.message) })
    }
    document.addEventListener('click', recordLinkClick, true)
    return () => document.removeEventListener('click', recordLinkClick, true)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -90 },
      lerp: 0.1,
      smoothWheel: true,
      respectReducedMotion: true,
    })
    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    const supportsMagnetism = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches
    if (!supportsMagnetism) return undefined

    const elements = [...document.querySelectorAll('[data-magnetic]')]
    const cleanups = elements.map((element) => {
      const move = (event) => {
        const bounds = element.getBoundingClientRect()
        const dx = event.clientX - (bounds.left + bounds.width / 2)
        const dy = event.clientY - (bounds.top + bounds.height / 2)
        const strength = Math.max(0, 1 - Math.hypot(dx, dy) / 80)
        element.style.setProperty('--magnetic-x', `${dx * strength * 0.12}px`)
        element.style.setProperty('--magnetic-y', `${dy * strength * 0.12}px`)
      }
      const reset = () => {
        element.style.setProperty('--magnetic-x', '0px')
        element.style.setProperty('--magnetic-y', '0px')
      }
      element.addEventListener('pointermove', move, { passive: true })
      element.addEventListener('pointerleave', reset)
      return () => {
        element.removeEventListener('pointermove', move)
        element.removeEventListener('pointerleave', reset)
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])

  return (
    <div className="min-h-screen site-shell">
      <AdminAccess onPortraitChange={setPortraitUrl} />
      <CursorFollower />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex="-1">
        <Hero portraitUrl={portraitUrl} />
        <About />
        <Skills skills={skills.data} />
        <Projects
          projects={projects.data}
          loading={projects.loading}
        />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
