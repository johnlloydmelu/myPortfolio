import { profile } from '../config.js'
import SectionHeading from './SectionHeading.jsx'
import { MailIcon, GithubIcon, LinkedinIcon } from './Icons.jsx'

export default function Contact() {
  const hasContact = profile.email || profile.github || profile.linkedin

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
      <div className="card relative overflow-hidden p-7 sm:p-10">
        <div className="relative mx-auto max-w-2xl">
          <SectionHeading eyebrow="04. Contacts" title="Let's connect" />
          <p className="-mt-6 text-slate-400">
            I’m open to conversations about entry-level IT opportunities, collaborations, and projects.
          </p>
          {hasContact && <div className="mt-6 flex flex-wrap gap-3">
            {profile.email && <a href={`mailto:${profile.email}`} className="btn-primary"><MailIcon className="h-4 w-4" />Email me</a>}
            {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="btn-ghost"><GithubIcon />GitHub</a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="btn-ghost"><LinkedinIcon />LinkedIn</a>}
          </div>}
        </div>
      </div>
    </section>
  )
}
