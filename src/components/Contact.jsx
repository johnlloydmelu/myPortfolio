import { useRef, useState } from 'react'
import { profile } from '../config.js'
import SectionHeading from './SectionHeading.jsx'
import { MailIcon, GithubIcon, LinkedinIcon, CopyIcon } from './Icons.jsx'

export default function Contact() {
  const [copyState, setCopyState] = useState('idle')
  const emailRef = useRef(null)
  const hasContact = profile.email || profile.github || profile.linkedin

  async function copyEmail() {
    if (!profile.email) return
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopyState('copied')
    } catch {
      emailRef.current?.focus()
      emailRef.current?.select()
      setCopyState('fallback')
    }
  }

  return <section id="contact" className="section-wrap contact-section">
    <div className="section-kicker"><span>04 / CONTACT</span><span>Start a conversation</span></div>
    <div className="contact-panel">
      <div className="contact-main"><SectionHeading eyebrow="Have a project or opportunity?" title="Let’s make something useful." /><p>I’m open to conversations about entry-level IT opportunities, collaborations, and projects.</p></div>
      {hasContact && <div className="contact-actions">
        {profile.email && <>
          <div className="email-actions">
            <a href={`mailto:${profile.email}`} className="button button-primary" data-magnetic><MailIcon />Email me <span aria-hidden="true">&#8599;</span></a>
            <div className="copy-email-wrap">
              <button type="button" className="copy-email-button" onClick={copyEmail} aria-label={copyState === 'copied' ? 'Email address copied' : 'Copy email address'} aria-describedby="copy-email-tooltip" title="Copy email address"><CopyIcon /></button>
              <span id="copy-email-tooltip" className="copy-tooltip" role="tooltip">Copy email address</span>
            </div>
          </div>
          <div className="email-copy">
            <input ref={emailRef} className="sr-only" tabIndex="-1" aria-label="Email address selected for manual copy" readOnly value={profile.email} onClick={(event) => event.currentTarget.select()} />
            <span className="copy-status" role="status" aria-live="polite">{copyState === 'copied' ? 'Email already copied!' : copyState === 'fallback' ? 'Clipboard unavailable. Press Ctrl+C to copy.' : ''}</span>
          </div>
        </>}
        <div className="contact-social">{profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer"><GithubIcon /> GitHub <span aria-hidden="true">↗</span></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon /> LinkedIn <span aria-hidden="true">↗</span></a>}</div>
      </div>}
    </div>
  </section>
}
