export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-12 max-w-2xl">
      {eyebrow && (
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-cyan-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-slate-400">{subtitle}</p>}
    </div>
  )
}