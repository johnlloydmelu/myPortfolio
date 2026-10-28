import { profile } from '../config.js'
import SectionHeading from './SectionHeading.jsx'
import { MailIcon, GithubIcon, LinkedinIcon } from './Icons.jsx'

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <div className="card relative overflow-hidden p-8 text-center sm:p-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-xl">
          <SectionHeading eyebrow="05. Contact" title="Let's work together" />
          <p className="-mt-6 mb-8 text-slate-400">
            Have a role, project, or idea in mind? My inbox is always open.
          </p>

          <a href={`mailto:${profile.email}`} className="btn-primary">
            <MailIcon className="h-4 w-4" /> {profile.email}
          </a>

          <div className="mt-8 flex justify-center gap-4 text-slate-400">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"
            >
              <GithubIcon className="h-6 w-6" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="rounded-lg p-2 transition hover:bg-slate-800 hover:text-white"
            >
              <LinkedinIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}