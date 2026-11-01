import SectionHeading from './SectionHeading.jsx'

function iconUrl(skill) {
  if (skill.image_url) return skill.image_url
  if (!skill.icon) return null
  if (skill.icon.startsWith('local:')) return `/${skill.icon.slice(6)}`
  if (skill.icon.startsWith('devicon:')) {
    const slug = skill.icon.slice(8)
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`
  }
  const colors = { php: '777BB4', javascript: 'F7DF1E', html5: 'E34F26', css3: '1572B6', kotlin: '7F52FF', flutter: '54C5F8', mysql: '4479A1', postgresql: '4169E1', supabase: '3FCF8E', firebase: 'FFCA28', linux: 'FCC624', github: 'F5F5F5', react: '61DAFB', vercel: 'FFFFFF', render: '46E3B7' }
  return `https://cdn.simpleicons.org/${skill.icon}/${colors[skill.icon] || 'A78BFA'}`
}

export default function Skills({ skills = [] }) {
  const excludedSkills = new Set(['node.js', 'css frameworks', 'networking basics'])
  const visibleSkills = [...skills].filter((skill) => (
    skill.published !== false && !excludedSkills.has(skill.name.trim().toLowerCase())
  ))
  if (!visibleSkills.some((skill) => skill.name.trim().toLowerCase() === 'firebase')) {
    visibleSkills.push({ id: 'firebase', name: 'Firebase', category: 'Backend', level: 75, icon: 'firebase', sort_order: 999 })
  }
  for (const [name, icon] of [['Vercel', 'vercel'], ['Render', 'render']]) {
    if (!visibleSkills.some((skill) => skill.name.trim().toLowerCase() === name.toLowerCase())) {
      visibleSkills.push({ id: name.toLowerCase(), name, category: 'DevOps & Tools', icon, sort_order: 999 })
    }
  }
  visibleSkills.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
  const groups = visibleSkills.reduce((result, skill) => {
    const rawCategory = skill.category?.trim() || 'Other'
    const category = ['tools', 'devops & tools'].includes(rawCategory.toLowerCase()) ? 'DevOps & Tools' : rawCategory
    result[category] ||= []
    result[category].push(skill)
    return result
  }, {})
  const tickerSkills = visibleSkills.map((skill) => skill.name)
  const frontendAndLanguages = [...(groups.Frontend || []), ...(groups.Languages || [])]
  const displayGroups = [
    ...(frontendAndLanguages.length ? [['Frontend & Languages', frontendAndLanguages]] : []),
    ...Object.entries(groups).filter(([category]) => category !== 'Frontend' && category !== 'Languages'),
  ]

  return (
    <section id="skills" className="skills-section">
      <div className="section-wrap skills-inner">
        <div className="section-kicker"><span>02 / TOOLKIT</span><span>Things I work with</span></div>
        <div className="skills-heading"><SectionHeading eyebrow="A growing toolkit" title="Technologies I use." /><p>Tools and technologies I’ve explored across coursework and personal projects.</p></div>
        {tickerSkills.length > 0 && <div className="skills-marquee" aria-hidden="true"><div className="skills-marquee-track">{[0, 1].map((copy) => <div className="skills-marquee-group" key={copy}>{tickerSkills.map((name, index) => <span key={`${copy}-${index}`}>{name}</span>)}</div>)}</div></div>}
        <div className="skill-groups" aria-label="Tech stack">
          {displayGroups.map(([category, items], index) => <section className="skill-group" key={category} aria-labelledby={`skill-${index}`}>
            <h3 id={`skill-${index}`}><span>0{index + 1}</span>{category}</h3>
            <ul>{items.map((skill) => {
              const src = iconUrl(skill)
              return <li key={skill.id || skill.name}>{src && <img src={src} alt="" aria-hidden="true" loading="lazy" />}<span>{skill.name}</span><i aria-hidden="true">↗</i></li>
            })}</ul>
          </section>)}
        </div>
      </div>
    </section>
  )
}
