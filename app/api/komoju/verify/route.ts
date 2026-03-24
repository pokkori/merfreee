import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get('plan');
  const sessionId = searchParams.get('session_id');

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!plan || !sessionId) {
    return NextResponse.redirect(new URL('/pricing?error=payment_failed', req.url));
  }

  const komojuApiKey = process.env.KOMOJU_SECRET_KEY;
  if (!komojuApiKey) {
    return NextResponse.redirect(new URL('/pricing?error=payment_failed', req.url));
  }

  // KOMOJUセッション検証
  const verifyResponse = await fetch(`https://komoju.com/api/v1/sessions/${sessionId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${komojuApiKey}:`).toString('base64')}`,
    },
  });

  if (!verifyResponse.ok) {
    return NextResponse.redirect(new URL('/pricing?error=payment_failed', req.url));
  }

  const sessionData = (await verifyResponse.json()) as { status: string; metadata?: { user_email?: string } };

  if (sessionData.status !== 'completed') {
    return NextResponse.redirect(new URL('/pricing?error=payment_failed', req.url));
  }

  // Supabase の users テーブルを更新
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30日後

    await supabase
      .from('users')
      .update({
        plan: plan as string,
        plan_started_at: now.toISOString(),
        plan_expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('email', session.user.email);
  }

  return NextResponse.redirect(new URL('/dashboard', req.url));
}
