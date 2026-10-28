import { profile } from '../config.js'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="font-mono text-xs">Built with React, Tailwind, Supabase &amp; Vercel</p>
      </div>
    </footer>
  )
}