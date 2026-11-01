import { useCallback, useEffect, useRef, useState } from 'react'
import SectionHeading from './SectionHeading.jsx'
import { GithubIcon, ExternalIcon } from './Icons.jsx'

const projectArtwork = {
  cabrent: { src: '/projects/cabrent.jpg', alt: 'CabRent logo', className: 'cabrent-artwork' },
  'smart-campus-companion': { src: '/projects/smart-campus-companion.png', alt: 'Smart Campus Companion logo', className: 'campus-artwork' },
  carewatch: { src: '/projects/carewatch.jpg', alt: 'CareWatch logo', className: 'carewatch-artwork' },
}

function SkeletonProject() {
  return <div className="project-skeleton" aria-label="Loading projects"><span /></div>
}

function Project({ project, index }) {
  const tech = Array.isArray(project.tech_stack) ? project.tech_stack : []
  const monogram = project.title.split(/\s+/).filter(Boolean).slice(0, 3).map((part) => part[0]).join('').toUpperCase()
  const normalize = (value) => (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const artwork = projectArtwork[normalize(project.slug)] || projectArtwork[normalize(project.title)] || (project.image_url
    ? { src: project.image_url, alt: project.image_alt || `${project.title} project image`, className: '' }
    : null)
  const codeLinks = [
    project.github_url && { href: project.github_url, title: project.github_label === 'Mobile Code' ? 'Mobile code' : project.github_label || 'Source code' },
    project.website_code_url && { href: project.website_code_url, title: 'Website code' },
    project.mobile_code_url && { href: project.mobile_code_url, title: 'Mobile & Wearwatch code' },
  ].filter(Boolean)

  function trackSpotlight(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return <article className="project-row" aria-label={`Project ${index + 1}: ${project.title}`}>
    <div className={`project-visual${artwork?.className ? ` ${artwork.className}` : ''}${artwork ? ' is-logo' : ''}`} onPointerMove={trackSpotlight}>
      {artwork ? <img src={artwork.src} alt={artwork.alt} loading="lazy" /> : <div className="project-placeholder" aria-hidden="true"><span>{monogram}<i>.</i></span><small>{project.title} <b>/</b> PROJECT 0{index + 1}</small></div>}
      <span className="project-number">0{index + 1}</span>
    </div>
    <div className="project-details">
      <p className="eyebrow">Selected project <span>— 0{index + 1}</span></p>
      <h3>{project.title}</h3>
      <p className="project-summary">{project.summary}</p>
      {tech.length > 0 && <ul className="project-tech" aria-label="Technologies used">{tech.map((item) => <li key={item}>{item}</li>)}</ul>}
      <div className="project-links">
        {codeLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"><GithubIcon />{link.title}<span aria-hidden="true">↗</span></a>)}
        {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer"><ExternalIcon />Live project<span aria-hidden="true">↗</span></a>}
      </div>
    </div>
  </article>
}

export default function Projects({ projects = [], loading }) {
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, projects.findIndex((project) => (project.slug || project.title || '').toLowerCase().includes('carewatch'))))
  const [isPaused, setIsPaused] = useState(false)
  const stageRef = useRef(null)
  const touchStart = useRef(null)
  const active = projects.length ? activeIndex % projects.length : 0

  useEffect(() => setActiveIndex((index) => projects.length ? index % projects.length : 0), [projects.length])

  const goTo = useCallback((index) => {
    if (!projects.length) return
    const next = (index + projects.length) % projects.length
    if (next === active) return
    setActiveIndex(next)
  }, [active, projects.length])

  useEffect(() => {
    if (projects.length < 2 || isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveIndex((index) => (index + 1) % projects.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [isPaused, projects.length])

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1) }
  }

  function handleTouchStart(event) {
    touchStart.current = event.touches[0]?.clientX ?? null
  }

  function handleTouchEnd(event) {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 48) goTo(active + (distance < 0 ? 1 : -1))
    touchStart.current = null
  }

  return <section id="projects" className="projects-section">
    <div className="section-wrap">
      <div className="section-kicker"><span>03 / SELECTED WORK</span><span>Built to solve real needs</span></div>
      <div className="projects-heading"><SectionHeading eyebrow="Projects" title="Previous projects." /><span className="project-count">{String(projects.length).padStart(2, '0')} / WORKS</span></div>
      {loading ? <div className="projects-list"><SkeletonProject /></div> : projects.length === 0 ? <p className="empty-projects">More projects coming soon.</p> : <div className="project-carousel" onFocus={() => setIsPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false) }}>
        <div ref={stageRef} className="carousel-stage" role="region" aria-roledescription="carousel" aria-label="Previous projects" tabIndex={0} onKeyDown={handleKeyDown} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <Project key={projects[active].id || projects[active].slug || projects[active].title} project={projects[active]} index={active} />
        </div>
        <div className="carousel-controls" aria-label="Project carousel controls">
          <div className="carousel-position"><span>{String(active + 1).padStart(2, '0')}</span><i /><small>{String(projects.length).padStart(2, '0')} PROJECTS</small></div>
          <div className="carousel-dots" role="group" aria-label="Choose a project">{projects.map((project, index) => <button key={project.id || project.slug || project.title} type="button" className={index === active ? 'is-current' : ''} aria-label={`Show project ${index + 1}: ${project.title}`} aria-current={index === active ? 'true' : undefined} onClick={() => goTo(index)} />)}</div>
          <div className="carousel-arrows">
            <button type="button" aria-label="Previous project" onClick={() => goTo(active - 1)}>←</button>
            <button type="button" aria-label="Next project" onClick={() => goTo(active + 1)}>→</button>
          </div>
        </div>
        <p className="swipe-hint" aria-hidden="true"><span>Swipe</span><b>↔</b></p>
      </div>}
    </div>
  </section>
}
