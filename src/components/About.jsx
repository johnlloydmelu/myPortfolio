import { profile } from '../config.js'
import SectionHeading from './SectionHeading.jsx'

export default function About() {
  return (
    <section id="about" className="section-wrap about-section">
      <div className="section-kicker"><span>01 / ABOUT</span><span>Profile</span></div>
      <div className="about-layout">
        <SectionHeading eyebrow="A little context" title="Learning by making." />
        <div className="about-copy">
          {profile.about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  )
}
