import SectionHeading from './SectionHeading.jsx'

const techStack = [
  ['JavaScript', 'javascript', 'F7DF1E'],
  ['Java', 'devicon:java'],
  ['HTML & CSS', 'html5', 'E34F26'],
  ['C#', 'devicon:csharp'],
  ['Kotlin', 'kotlin', '7F52FF'],
  ['Flutter', 'flutter', '54C5F8'],
  ['MySQL', 'mysql', '4479A1'],
  ['PostgreSQL', 'postgresql', '4169E1'],
  ['Supabase', 'supabase', '3FCF8E'],
  ['API', null, 'A78BFA'],
  ['Firebase', 'firebase', 'FFCA28'],
  ['Linux', 'linux', 'FCC624'],
  ['Git & GitHub', 'github', 'F5F5F5'],
  ['React', 'react', '61DAFB'],
]

export default function Skills() {
  return (
    <section id="skills" className="border-y border-slate-800/70 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <SectionHeading eyebrow="02. Tech Stack" title="Technologies I use" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-label="Tech stack">
          {techStack.map(([name, slug, color]) => (
            <li key={name} className="card flex min-h-16 items-center gap-3 rounded-xl px-4 py-3 transition hover:-translate-y-0.5 hover:border-cyan-400/40">
              {slug ? <img src={slug.startsWith('devicon:') ? `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug.slice(8)}/${slug.slice(8)}-original.svg` : `https://cdn.simpleicons.org/${slug}/${color}`} alt="" aria-hidden="true" loading="lazy" className="h-7 w-7 shrink-0 object-contain" /> : <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-violet-300/40 text-[9px] font-bold text-violet-300">API</span>}
              <span className="text-sm font-medium text-slate-200">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
