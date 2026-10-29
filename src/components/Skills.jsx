import SectionHeading from './SectionHeading.jsx'

function iconUrl(skill) {
  if (skill.name.toLowerCase() === 'css frameworks') return null
  if (skill.name.toLowerCase() === 'node.js') return '/node-js.png'
  if (skill.image_url) return skill.image_url
  if (!skill.icon) return null
  if (skill.icon.startsWith('local:')) return `/${skill.icon.slice(6)}`
  if (skill.icon.startsWith('devicon:')) {
    const slug = skill.icon.slice(8)
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`
  }
  const colors = { php: '777BB4', javascript: 'F7DF1E', html5: 'E34F26', css3: '1572B6', kotlin: '7F52FF', flutter: '54C5F8', mysql: '4479A1', postgresql: '4169E1', supabase: '3FCF8E', firebase: 'FFCA28', linux: 'FCC624', github: 'F5F5F5', react: '61DAFB', nodejs: '339933' }
  return `https://cdn.simpleicons.org/${skill.icon}/${colors[skill.icon] || 'A78BFA'}`
}

export default function Skills({ skills = [] }) {
  const visibleSkills = [...skills]
    .filter((skill) => skill.published !== false)
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))

  return (
    <section id="skills" className="border-y border-slate-800/70 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <SectionHeading eyebrow="02. Tech Stack" title="Technologies I use" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-label="Tech stack">
          {visibleSkills.map((skill) => {
            const src = iconUrl(skill)
            return (
              <li key={skill.id || skill.name} className="card flex min-h-16 items-center gap-3 rounded-xl px-4 py-3 transition hover:-translate-y-0.5 hover:border-cyan-400/40">
                {src && <img src={src} alt="" aria-hidden="true" loading="lazy" className="h-7 w-7 shrink-0 object-contain" />}
                <span className="text-sm font-medium text-slate-200">{skill.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
