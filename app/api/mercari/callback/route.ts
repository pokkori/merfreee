import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createServerClient } from '@/lib/supabase/server';
import { exchangeMercariCode, getMercariShopId } from '@/lib/mercari/client';
import { encrypt } from '@/lib/crypto';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect('/login');
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return redirect('/settings/mercari?error=no_code');
  }

  const origin = url.origin;

  try {
    const tokens = await exchangeMercariCode(code, origin);
    const shopId = await getMercariShopId(tokens.access_token);

    const supabase = createServerClient();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    await supabase.from('integrations').upsert(
      {
        user_id: session.user.id,
        provider: 'mercari_shops',
        access_token: encrypt(tokens.access_token),
        refresh_token: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        token_expires_at: expiresAt,
        shop_id: shopId,
        is_active: true,
      },
      { onConflict: 'user_id,provider' }
    );

    return redirect('/settings/mercari?success=true');
  } catch (err) {
    console.error('Mercari OAuth callback error:', err);
    return redirect('/settings/mercari?error=oauth_failed');
  }
}
