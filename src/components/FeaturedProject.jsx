import SectionHeading from './SectionHeading.jsx'
import { GithubIcon, ExternalIcon, PulseIcon } from './Icons.jsx'

const highlights = [
  'Live patient vitals overview with trend charts',
  'Prioritised alerts so critical events are never missed',
  'Role-based access for caregivers and administrators',
  'Responsive, accessible interface for desktop and mobile',
]

const patients = [
  { name: 'Room 101', status: 'Stable', color: 'bg-emerald-400' },
  { name: 'Room 104', status: 'Review', color: 'bg-amber-400' },
  { name: 'Room 108', status: 'Stable', color: 'bg-emerald-400' },
]

function DashboardMock() {
  return (
    <div className="card relative overflow-hidden p-5 shadow-2xl shadow-cyan-500/10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <PulseIcon className="h-5 w-5 text-cyan-400" />
          <span className="font-semibold">CareWatch</span>
        </div>
        <span className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Heart rate', value: '72', unit: 'bpm' },
          { label: 'SpO₂', value: '98', unit: '%' },
          { label: 'Alerts', value: '1', unit: 'open' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-white">
              {s.value}
              <span className="ml-1 text-xs font-normal text-slate-500">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
          Heart rate (last hour)
        </p>
        <svg viewBox="0 0 300 70" className="h-20 w-full" role="img" aria-label="Heart rate trend chart">
          <defs>
            <linearGradient id="cwFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 45 L30 40 L60 48 L90 30 L120 36 L150 22 L180 34 L210 26 L240 38 L270 24 L300 30 L300 70 L0 70 Z"
            fill="url(#cwFill)"
          />
          <path
            d="M0 45 L30 40 L60 48 L90 30 L120 36 L150 22 L180 34 L210 26 L240 38 L270 24 L300 30"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <ul className="mt-4 space-y-2">
        {patients.map((p) => (
          <li
            key={p.name}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm"
          >
            <span className="text-slate-300">{p.name}</span>
            <span className="flex items-center gap-2 text-xs text-slate-400">
              <span className={`h-2 w-2 rounded-full ${p.color}`} />
              {p.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function FeaturedProject({ project }) {
  const tech = Array.isArray(project.tech_stack) ? project.tech_stack : []

  return (
    <section id="carewatch" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading eyebrow="03. Featured project" title={project.title} />

      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-lg leading-relaxed text-slate-300">{project.summary}</p>
          {project.description && (
            <p className="mt-4 leading-relaxed text-slate-400">{project.description}</p>
          )}

          <ul className="mt-6 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                {h}
              </li>
            ))}
          </ul>

          {tech.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies used">
              {tech.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Live demo <ExternalIcon />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <GithubIcon className="h-4 w-4" /> Source code
              </a>
            )}
          </div>
        </div>

        <DashboardMock />
      </div>
    </section>
  )
}