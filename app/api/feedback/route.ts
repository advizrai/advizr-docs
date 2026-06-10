import { NextResponse } from 'next/server'

/**
 * Docs feedback collector — inserts into the master Supabase instance
 * (table: docs_feedback; SQL in supabase/docs_feedback.sql).
 *
 * Requires env vars on the Vercel project:
 *   SUPABASE_URL              e.g. https://<ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY service key (server-only — never NEXT_PUBLIC)
 * Without them the endpoint degrades to 503 and the widget hides itself.
 */

const VOTES = new Set(['up', 'down'])
const REASONS = new Set(['unclear', 'outdated', 'missing', 'inaccurate', ''])

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'feedback storage not configured' }, { status: 503 })
  }

  let body: { page?: string; vote?: string; reason?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const page = String(body.page || '').slice(0, 300)
  const vote = String(body.vote || '')
  const reason = String(body.reason || '').slice(0, 40)

  if (!page.startsWith('/docs') || !VOTES.has(vote) || !REASONS.has(reason)) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  const res = await fetch(`${url}/rest/v1/docs_feedback`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ page, vote, reason: reason || null }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'storage error' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
