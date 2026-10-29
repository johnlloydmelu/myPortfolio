import { profile } from '../config.js'
import { GithubIcon, LinkedinIcon } from './Icons.jsx'

export default function Hero({ portraitUrl = '/john-lloyd-melu.png' }) {
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

      <div className="mx-auto max-w-6xl px-5 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:gap-8">
          <div className="animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 font-mono text-xs text-slate-300">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400" />
              Open to opportunities
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hi, I&apos;m{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </h1>
            <h2 className="mt-3 text-xl font-semibold text-slate-300 sm:text-2xl">
              {profile.role}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {profile.tagline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn-primary">View Previous Projects</a>
              <a href="#contact" className="btn-ghost">Contact Me</a>
              {(profile.github || profile.linkedin) && <div className="ml-1 flex items-center gap-3 text-slate-400">
                {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"><GithubIcon /></a>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"><LinkedinIcon /></a>}
              </div>}
            </div>
          </div>

          <div className="group relative order-first mx-auto my-1 h-64 w-60 overflow-hidden rounded-[2rem] border border-cyan-200/30 bg-gradient-to-br from-cyan-300/20 via-slate-900 to-slate-950 shadow-2xl shadow-cyan-950/50 ring-1 ring-white/10 sm:my-3 sm:h-80 sm:w-72 md:order-none md:my-0 md:h-[22rem] md:w-[22rem]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-white/10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
            <img
              src={portraitUrl}
              alt={`Portrait of ${profile.name}`}
              className="relative z-10 h-full w-full object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              fetchPriority="high"
            />
            <div className="absolute bottom-4 left-5 z-30">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">Portfolio</p>
              <p className="mt-1 text-sm font-semibold text-white">{profile.name}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
