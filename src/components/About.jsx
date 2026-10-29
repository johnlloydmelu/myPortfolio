import { profile } from '../config.js'
import SectionHeading from './SectionHeading.jsx'

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
      <SectionHeading eyebrow="01. About" title="A bit about me" />
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-slate-400">
        {profile.about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </section>
  )
}
