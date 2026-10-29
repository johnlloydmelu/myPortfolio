import { profile } from '../config.js'
import { GithubIcon, LinkedinIcon } from './Icons.jsx'

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

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-20 sm:pb-16 sm:pt-24">
        <div className="grid items-center gap-2 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:gap-6">
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
              <a href="#projects" className="btn-primary">View Projects</a>
              <a href="#contact" className="btn-ghost">Contact Me</a>
              {(profile.github || profile.linkedin) && <div className="ml-1 flex items-center gap-3 text-slate-400">
                {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"><GithubIcon /></a>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"><LinkedinIcon /></a>}
              </div>}
            </div>
          </div>

          <div className="mx-auto my-5 aspect-square w-64 overflow-hidden rounded-full border-4 border-cyan-300/70 bg-slate-900 shadow-xl shadow-cyan-500/10 ring-4 ring-cyan-400/10 sm:w-72 md:my-0 md:w-[22rem]">
            <img
              src="/john-lloyd-melu.png"
              alt={`Portrait of ${profile.name}`}
              className="h-full w-full rounded-full object-cover object-top"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
