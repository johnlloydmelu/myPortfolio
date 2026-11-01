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
