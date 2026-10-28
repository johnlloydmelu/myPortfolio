import SectionHeading from './SectionHeading.jsx'

function groupByCategory(skills) {
  return skills.reduce((acc, skill) => {
    const key = skill.category || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(skill)
    return acc
  }, {})
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse p-6">
      <div className="mb-6 h-4 w-1/3 rounded bg-slate-800" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="mb-4 h-3 rounded bg-slate-800" />
      ))}
    </div>
  )
}

export default function Skills({ skills, loading, usingFallback }) {
  const groups = groupByCategory(skills)

  return (
    <section id="skills" className="border-y border-slate-800/70 bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="02. Skills"
          title="Tools & technologies"
          subtitle="The stack I use to design, build, and ship."
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(groups).map(([category, items]) => (
              <div key={category} className="card p-6">
                <h3 className="mb-5 font-mono text-sm font-semibold uppercase tracking-wider text-cyan-400">
                  {category}
                </h3>
                <ul className="space-y-4">
                  {items.map((skill) => (
                    <li key={skill.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-200">{skill.name}</span>
                        <span className="font-mono text-xs text-slate-500">{skill.level}%</span>
                      </div>
                      <div
                        className="h-1.5 overflow-hidden rounded-full bg-slate-800"
                        role="progressbar"
                        aria-valuenow={skill.level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${skill.name} proficiency`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                          style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {usingFallback && !loading && (
          <p className="mt-6 font-mono text-xs text-slate-600">
            Showing sample skills (Supabase not configured or empty).
          </p>
        )}
      </div>
    </section>
  )
}