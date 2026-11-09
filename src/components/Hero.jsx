import { profile } from '../config.js'
import { GithubIcon, LinkedinIcon } from './Icons.jsx'

export default function Hero({ portraitUrl = '/john-lloyd-melu.png' }) {
  return (
    <section id="home" className="hero section-wrap">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span>IT graduate</span><span className="eyebrow-rule" /> Developer in progress</p>
          <h1 aria-label="John Lloyd E. Melu.">
            <span className="hero-line"><span>John Lloyd</span></span>
            <span className="hero-line"><span><em>E. Melu</em><span className="hero-period">.</span></span></span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-intro">{profile.tagline}</p>
            <div className="hero-actions">
              <a className="resume-button" data-magnetic href="/resume.pdf" target="_blank" rel="noopener noreferrer" title="Open resume PDF in a new tab"><span aria-hidden="true">↗</span>Resume</a>
              {profile.github && <a href={profile.github} className="social-button" data-magnetic target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><GithubIcon /></a>}
              {profile.linkedin && <a href={profile.linkedin} className="social-button" data-magnetic target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><LinkedinIcon /></a>}
            </div>
          </div>
        </div>
        <figure className="portrait-frame">
          <img src={portraitUrl} alt={`Portrait of ${profile.name}`} fetchPriority="high" />
          <figcaption><span>Curious by nature.</span><span>Building with purpose.</span></figcaption>
        </figure>
      </div>
    </section>
  )
}
