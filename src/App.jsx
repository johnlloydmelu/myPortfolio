import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import FeaturedProject from './components/FeaturedProject.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useTable } from './hooks/useTable.js'
import { fallbackProjects, fallbackSkills } from './lib/fallbackData.js'

export default function App() {
  const projects = useTable('projects', fallbackProjects)
  const skills = useTable('skills', fallbackSkills)

  const featured =
    projects.data.find((p) => p.slug === 'carewatch' && p.featured) ||
    projects.data.find((p) => p.featured) ||
    null
  const others = projects.data.filter((p) => !featured || p.id !== featured.id)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills
          skills={skills.data}
          loading={skills.loading}
          usingFallback={skills.usingFallback}
        />
        {featured && <FeaturedProject project={featured} />}
        <Projects
          projects={others}
          loading={projects.loading}
          usingFallback={projects.usingFallback}
        />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}