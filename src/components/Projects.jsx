import SectionHeading from './SectionHeading.jsx'
import { GithubIcon, ExternalIcon } from './Icons.jsx'

function SkeletonProject() {
  return (
    <div className="card animate-pulse p-6">
      <div className="mb-4 h-5 w-2/3 rounded bg-slate-800" />
      <div className="mb-2 h-3 rounded bg-slate-800" />
      <div className="mb-6 h-3 w-5/6 rounded bg-slate-800" />
      <div className="h-6 w-1/2 rounded bg-slate-800" />
    </div>
  )
}

function ProjectCard({ project }) {
  const tech = Array.isArray(project.tech_stack) ? project.tech_stack : []
  const codeLinks = [
    project.github_url && {
      href: project.github_url,
      title: project.github_label === 'Mobile Code' ? 'Mobile' : project.github_label || 'Code',
      subtitle: project.github_label === 'Mobile Code' ? 'Code' : null,
    },
    project.website_code_url && { href: project.website_code_url, title: 'Website', subtitle: 'Code' },
    project.mobile_code_url && { href: project.mobile_code_url, title: 'Mobile & Wearwatch', subtitle: 'Code' },
  ].filter(Boolean)

  return (
    <article className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:border-cyan-400/40">
      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{project.summary}</p>

      {tech.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
          {tech.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className={`mt-6 grid gap-2 text-sm font-medium ${codeLinks.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {codeLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-2.5 text-slate-300 transition hover:border-cyan-400/40 hover:bg-slate-800 hover:text-white"
          >
            <GithubIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-snug">
              <span className="block">{link.title}</span>
              {link.subtitle && <span className="block text-xs text-slate-400">{link.subtitle}</span>}
            </span>
          </a>
        ))}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white"
          >
            <ExternalIcon /> Live
          </a>
        )}
      </div>
    </article>
  )
}

export default function Projects({ projects, loading, usingFallback }) {
  return (
    <section id="projects" className="border-y border-slate-800/70 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <SectionHeading
          eyebrow="03. Previous Projects"
          title="Previous Projects"
        />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonProject />
            <SkeletonProject />
            <SkeletonProject />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-slate-500">More projects coming soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
