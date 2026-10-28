import { profile } from '../config.js'
import { GithubIcon, LinkedinIcon, ArrowDownIcon } from './Icons.jsx'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:pt-44">
        <div className="animate-fade-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 font-mono text-xs text-slate-300">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400" />
            Open to opportunities
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>
          <h2 className="mt-3 text-xl font-semibold text-slate-300 sm:text-2xl">
            {profile.role}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            {profile.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#carewatch" className="btn-primary">
              View CareWatch
              <ArrowDownIcon />
            </a>
            <a href="#projects" className="btn-ghost">
              All projects
            </a>
            <div className="ml-1 flex items-center gap-3 text-slate-400">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"
              >
                <GithubIcon />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}