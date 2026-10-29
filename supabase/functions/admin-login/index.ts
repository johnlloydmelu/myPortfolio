import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const adminEmail = 'johnlloydmelu2004@gmail.com'
const lockoutMs = 8 * 60 * 60 * 1000

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

async function hashAttemptKey(ip: string) {
  const bytes = new TextEncoder().encode(`${adminEmail}|${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405)

  let password = ''
  try {
    const body = await request.json()
    password = typeof body.password === 'string' ? body.password : ''
  } catch {
    return response({ error: 'Invalid request.' }, 400)
  }
  if (!password || password.length > 256) return response({ error: 'Invalid request.' }, 400)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const attemptKey = await hashAttemptKey(request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip')
  const { data: attempt, error: lookupError } = await admin
    .from('admin_login_attempts')
    .select('attempts, locked_until')
    .eq('attempt_key', attemptKey)
    .maybeSingle()

  if (lookupError) return response({ error: 'Admin login is temporarily unavailable.' }, 503)
  const now = Date.now()
  const lockedUntil = attempt?.locked_until ? new Date(attempt.locked_until).getTime() : 0
  if (lockedUntil > now) {
    return response({ ok: false, lockedUntil, attemptsRemaining: 0 })
  }

  const publicClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: authData, error: authError } = await publicClient.auth.signInWithPassword({ email: adminEmail, password })
  if (authError || !authData.session) {
    const attempts = (attempt?.attempts || 0) + 1
    const nextLockedUntil = attempts >= 3 ? new Date(now + lockoutMs).toISOString() : null
    const { error: saveError } = await admin.from('admin_login_attempts').upsert({
      attempt_key: attemptKey,
      attempts: attempts >= 3 ? 0 : attempts,
      locked_until: nextLockedUntil,
      updated_at: new Date(now).toISOString(),
    })
    if (saveError) return response({ error: 'Could not record login attempt.' }, 503)
    return response({
      ok: false,
      attemptsRemaining: Math.max(0, 3 - attempts),
      lockedUntil: nextLockedUntil ? new Date(nextLockedUntil).getTime() : 0,
    })
  }

  await admin.from('admin_login_attempts').delete().eq('attempt_key', attemptKey)
  return response({ ok: true, session: authData.session })
})
