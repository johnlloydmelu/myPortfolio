import { profile } from '../config.js'
import SectionHeading from './SectionHeading.jsx'

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading eyebrow="01. About" title="A bit about me" />

      <div className="grid gap-10 md:grid-cols-5">
        <div className="space-y-5 text-lg leading-relaxed text-slate-400 md:col-span-3">
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="font-mono text-sm text-slate-500">📍 {profile.location}</p>
        </div>

        <dl className="grid grid-cols-3 gap-4 md:col-span-2 md:grid-cols-1">
          {profile.stats.map((s) => (
            <div key={s.label} className="card p-5">
              <dt className="text-xs uppercase tracking-wider text-slate-500">{s.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-white">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}