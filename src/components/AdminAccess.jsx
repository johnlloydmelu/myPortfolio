import { useEffect, useState } from 'react'
import { supabase } from '../libs/supabase.js'

const inputClass = 'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400'
const labelClass = 'block text-sm font-medium text-slate-300'
const buttonClass = 'rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50'
const lockoutStorageKey = 'portfolio_admin_lockout_v1'
const notifyPortfolioUpdate = () => window.dispatchEvent(new Event('portfolio-data-changed'))

function readLockout() {
  try {
    const stored = JSON.parse(localStorage.getItem(lockoutStorageKey) || '{}')
    if (stored.lockedUntil > Date.now()) return { attempts: 0, lockedUntil: stored.lockedUntil }
    return { attempts: Number(stored.attempts) || 0, lockedUntil: 0 }
  } catch {
    return { attempts: 0, lockedUntil: 0 }
  }
}

function makeSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminAccess({ onPortraitChange }) {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [projectEdit, setProjectEdit] = useState(null)
  const [skillEdit, setSkillEdit] = useState(null)
  const [notice, setNotice] = useState('')
  const [lockout, setLockout] = useState(readLockout)
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Math.ceil((readLockout().lockedUntil - Date.now()) / 1000)))

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!lockout.lockedUntil) return undefined
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((lockout.lockedUntil - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining === 0) {
        localStorage.removeItem(lockoutStorageKey)
        setLockout({ attempts: 0, lockedUntil: 0 })
      }
    }
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [lockout.lockedUntil])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
        event.preventDefault()
        setError('')
        setNotice('')
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open || !session || !supabase) return
    let cancelled = false
    Promise.all([
      supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('skills').select('*').order('sort_order', { ascending: true }),
    ]).then(([projectResult, skillResult]) => {
      if (cancelled) return
      if (projectResult.error) setError(projectResult.error.message)
      else setProjects(projectResult.data || [])
      if (skillResult.error) setError(skillResult.error.message)
      else setSkills(skillResult.data || [])
    })
    return () => { cancelled = true }
  }, [open, session])

  const signIn = async (event) => {
    event.preventDefault()
    if (lockout.lockedUntil > Date.now()) return
    if (!supabase) {
      setError('Supabase is not configured for this site.')
      return
    }
    setBusy(true)
    setError('')
    const { data, error: invokeError } = await supabase.functions.invoke('admin-login', { body: { password } })
    if (invokeError) {
      setBusy(false)
      setError(invokeError.context?.status === 404
        ? 'Admin sign-in is not set up yet. The login service needs to be deployed in Supabase.'
        : 'I could not check your password right now. Please try again later.')
      return
    }
    if (data?.ok && data.session) {
      localStorage.removeItem(lockoutStorageKey)
      setLockout({ attempts: 0, lockedUntil: 0 })
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
      setBusy(false)
      if (sessionError) {
        setError('Password accepted, but the session could not be started. Please try again.')
        return
      }
      setSession(sessionData.session)
      setPassword('')
      return
    }

    const lockedUntil = Number(data?.lockedUntil) || 0
    const attempts = lockedUntil ? 0 : 3 - (Number(data?.attemptsRemaining) || 0)
    const nextLockout = { attempts, lockedUntil }
    localStorage.setItem(lockoutStorageKey, JSON.stringify(nextLockout))
    setLockout(nextLockout)
    if (lockedUntil) setSecondsLeft(Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)))
    setBusy(false)
    setPassword('')
    const remaining = Math.max(0, Number(data?.attemptsRemaining) || 0)
    setError(lockedUntil
      ? 'Wrong password. You have used all 3 attempts. Try again in 8 hours.'
      : `Wrong password. You have ${remaining} more ${remaining === 1 ? 'attempt' : 'attempts'}.`)
  }

  const saveProject = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') || '').trim()
    const type = String(form.get('project_type') || 'Website')
    const githubUrl = String(form.get('github_url') || '').trim() || null
    const row = {
      title,
      slug: projectEdit?.slug || makeSlug(title),
      summary: String(form.get('summary') || '').trim(),
      project_type: type,
      tech_stack: type === 'Website + Mobile' ? ['Website', 'Mobile', 'Wearable'] : [type],
      github_url: githubUrl,
      github_label: type === 'Website' ? 'Website Code' : type === 'Website + Mobile' ? null : 'Mobile Code',
      website_code_url: String(form.get('website_code_url') || '').trim() || null,
      mobile_code_url: String(form.get('mobile_code_url') || '').trim() || null,
      live_url: String(form.get('live_url') || '').trim() || null,
      published: true,
      sort_order: projectEdit?.sort_order ?? projects.length,
    }
    setBusy(true)
    setError('')
    const query = projectEdit
      ? supabase.from('projects').update(row).eq('id', projectEdit.id)
      : supabase.from('projects').insert(row)
    const { error: saveError } = await query
    setBusy(false)
    if (saveError) setError(saveError.message)
    else {
      setProjectEdit(null)
      setNotice('Project saved.')
      notifyPortfolioUpdate()
      const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
      setProjects(data || [])
    }
  }

  const removeProject = async (project) => {
    if (!window.confirm(`Delete “${project.title}”?`)) return
    const { error: removeError } = await supabase.from('projects').delete().eq('id', project.id)
    if (removeError) setError(removeError.message)
    else {
      setProjects((current) => current.filter((item) => item.id !== project.id))
      setNotice('Project deleted.')
      notifyPortfolioUpdate()
    }
  }

  const saveSkill = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const row = {
      name,
      category: String(form.get('category') || 'Other').trim(),
      icon: String(form.get('icon') || '').trim(),
      image_url: String(form.get('image_url') || '').trim() || null,
      level: skillEdit?.level ?? 75,
      published: true,
      sort_order: skillEdit?.sort_order ?? skills.length,
    }
    setBusy(true)
    setError('')
    const query = skillEdit
      ? supabase.from('skills').update(row).eq('id', skillEdit.id)
      : supabase.from('skills').insert(row)
    const { error: saveError } = await query
    setBusy(false)
    if (saveError) setError(saveError.message)
    else {
      setSkillEdit(null)
      setNotice('Tech stack saved.')
      notifyPortfolioUpdate()
      const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true })
      setSkills(data || [])
    }
  }

  const removeSkill = async (skill) => {
    if (!window.confirm(`Remove ${skill.name} from your tech stack?`)) return
    const { error: removeError } = await supabase.from('skills').delete().eq('id', skill.id)
    if (removeError) setError(removeError.message)
    else {
      setSkills((current) => current.filter((item) => item.id !== skill.id))
      setNotice('Tech stack item removed.')
      notifyPortfolioUpdate()
    }
  }

  const uploadPortrait = async (event) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.')
      return
    }
    setBusy(true)
    setError('')
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `portrait-${Date.now()}.${extension}`
    const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(path, file, { upsert: true, contentType: file.type })
    if (uploadError) {
      setBusy(false)
      setError(uploadError.message)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('portfolio-assets').getPublicUrl(path)
    const { error: settingsError } = await supabase.from('site_settings').upsert({ id: true, portrait_url: publicUrl }, { onConflict: 'id' })
    setBusy(false)
    if (settingsError) setError(settingsError.message)
    else {
      onPortraitChange(publicUrl)
      setNotice('Portrait updated.')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setOpen(false)
  }

  const countdown = `${String(Math.floor(secondsLeft / 3600)).padStart(2, '0')}:${String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">Portfolio controls</p>
            <h2 id="admin-title" className="mt-1 text-xl font-bold text-white">{session ? 'Superadmin' : 'Admin access'}</h2>
          </div>
          <div className="flex items-center gap-3">
            {session && <button type="button" onClick={signOut} className="text-sm text-slate-400 hover:text-white">Sign out</button>}
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close admin panel">✕</button>
          </div>
        </div>

        {!session ? (
          <form onSubmit={signIn} className="mx-auto max-w-md space-y-5 p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-slate-400">Enter your admin password to manage your portfolio. You have 3 attempts.</p>
            {lockout.lockedUntil > Date.now() && <p role="status" className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">Too many failed attempts. Try again in <span className="font-mono font-semibold">{countdown}</span>.</p>}
            <label className={labelClass}>Secret password
              <input autoFocus type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} required disabled={lockout.lockedUntil > Date.now()} />
            </label>
            {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
            <button className={`${buttonClass} w-full`} disabled={busy || lockout.lockedUntil > Date.now()}>{busy ? 'Signing in…' : 'Unlock superadmin'}</button>
          </form>
        ) : (
          <div className="p-5 sm:p-7">
            <div className="mb-6 flex flex-wrap gap-2">
              {['projects', 'tech stack', 'portrait'].map((item) => (
                <button key={item} type="button" onClick={() => { setTab(item); setError(''); setNotice('') }} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${tab === item ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{item}</button>
              ))}
            </div>
            {notice && <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}
            {error && <p role="alert" className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

            {tab === 'projects' && (
              <div className="grid gap-6 md:grid-cols-2">
                <form key={projectEdit?.id || 'new-project'} onSubmit={saveProject} className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <h3 className="font-semibold text-white">{projectEdit ? 'Edit project' : 'Add a project'}</h3>
                  <label className={labelClass}>Project title<input name="title" defaultValue={projectEdit?.title || ''} className={inputClass} maxLength={120} required /></label>
                  <label className={labelClass}>Project description<textarea name="summary" defaultValue={projectEdit?.summary || ''} className={inputClass} rows="3" maxLength={400} required /></label>
                  <label className={labelClass}>Project type
                    <select name="project_type" defaultValue={projectEdit?.project_type || 'Website'} className={inputClass}>
                      {['Website', 'Mobile', 'Wearable', 'Website + Mobile'].map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </label>
                  <label className={labelClass}>Project code link<input name="github_url" type="url" defaultValue={projectEdit?.github_url || ''} placeholder="https://github.com/..." className={inputClass} /></label>
                  <label className={labelClass}>Website code link (optional)<input name="website_code_url" type="url" defaultValue={projectEdit?.website_code_url || ''} className={inputClass} /></label>
                  <label className={labelClass}>Mobile &amp; Wearwatch code link (optional)<input name="mobile_code_url" type="url" defaultValue={projectEdit?.mobile_code_url || ''} className={inputClass} /></label>
                  <label className={labelClass}>Live website (optional)<input name="live_url" type="url" defaultValue={projectEdit?.live_url || ''} className={inputClass} /></label>
                  <div className="flex gap-2">
                    <button className={buttonClass} disabled={busy}>{busy ? 'Saving…' : projectEdit ? 'Save changes' : 'Add project'}</button>
                    {projectEdit && <button type="button" onClick={() => setProjectEdit(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>}
                  </div>
                </form>
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Current projects</h3>
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{project.title}</p><p className="mt-1 truncate text-xs text-slate-500">{project.project_type || project.tech_stack?.join(', ')}</p></div>
                      <div className="flex shrink-0 gap-2"><button type="button" onClick={() => setProjectEdit(project)} className="text-sm text-cyan-300 hover:text-white">Edit</button><button type="button" onClick={() => removeProject(project)} className="text-sm text-rose-300 hover:text-white">Delete</button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'tech stack' && (
              <div className="grid gap-6 md:grid-cols-2">
                <form key={skillEdit?.id || 'new-skill'} onSubmit={saveSkill} className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <h3 className="font-semibold text-white">{skillEdit ? 'Edit technology' : 'Add technology'}</h3>
                  <label className={labelClass}>Technology name<input name="name" defaultValue={skillEdit?.name || ''} className={inputClass} maxLength={60} required /></label>
                  <label className={labelClass}>Category<input name="category" defaultValue={skillEdit?.category || 'Other'} className={inputClass} maxLength={60} required /></label>
                  <label className={labelClass}>Icon name<input name="icon" defaultValue={skillEdit?.icon || ''} placeholder="php, react, or devicon:java" className={inputClass} /></label>
                  <label className={labelClass}>Or image URL<input name="image_url" type="url" defaultValue={skillEdit?.image_url || ''} placeholder="https://.../icon.svg" className={inputClass} /></label>
                  <div className="flex gap-2"><button className={buttonClass} disabled={busy}>{skillEdit ? 'Save changes' : 'Add to tech stack'}</button>{skillEdit && <button type="button" onClick={() => setSkillEdit(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>}</div>
                </form>
                <div className="space-y-3"><h3 className="font-semibold text-white">Current tech stack</h3>{skills.map((skill) => <div key={skill.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{skill.name}</p><p className="mt-1 truncate text-xs text-slate-500">{skill.category}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => setSkillEdit(skill)} className="text-sm text-cyan-300 hover:text-white">Edit</button><button type="button" onClick={() => removeSkill(skill)} className="text-sm text-rose-300 hover:text-white">Delete</button></div></div>)}</div>
              </div>
            )}

            {tab === 'portrait' && (
              <div className="max-w-lg space-y-5 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                <div><h3 className="font-semibold text-white">Profile picture</h3><p className="mt-1 text-sm text-slate-400">Upload a portrait image to replace the one shown in the hero section.</p></div>
                <label className={labelClass}>Choose image<input type="file" accept="image/*" onChange={uploadPortrait} className="mt-2 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700" /></label>
                {busy && <p className="text-sm text-cyan-200">Uploading portrait…</p>}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
