import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CursorGrid from './components/CursorGrid.jsx'
import AdminAccess from './components/AdminAccess.jsx'
import { useTable } from './hooks/useTable.js'
import { fallbackProjects, fallbackSkills } from './libs/fallbackData.js'
import { supabase } from './libs/supabase.js'

export default function App() {
  const projects = useTable('projects', fallbackProjects)
  const skills = useTable('skills', fallbackSkills)
  const [portraitUrl, setPortraitUrl] = useState('/john-lloyd-melu.png')

  useEffect(() => {
    if (!supabase) return
    supabase.from('site_settings').select('portrait_url').eq('id', true).maybeSingle()
      .then(({ data }) => { if (data?.portrait_url) setPortraitUrl(data.portrait_url) })
  }, [])

  return (
    <div className="min-h-screen">
      <CursorGrid />
      <AdminAccess onPortraitChange={setPortraitUrl} />
      <Navbar />
      <main>
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
