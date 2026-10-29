import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useTable } from './hooks/useTable.js'
import { fallbackProjects } from './libs/fallbackData.js'

export default function App() {
  const projects = useTable('projects', fallbackProjects)
  const visibleProjects = projects.data.filter((p) =>
    !/carewatch/i.test(`${p.title || ''} ${p.slug || ''} ${p.summary || ''} ${p.description || ''}`),
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects
          projects={visibleProjects}
          loading={projects.loading}
        />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
