import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { createKomojuSession, PlanKey, PLAN_PRICES } from '@/lib/komoju/client';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await req.json() as { plan: string };
  if (!plan || !Object.keys(PLAN_PRICES).includes(plan)) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://merfreee.vercel.app';

  try {
    const result = await createKomojuSession({
      plan: plan as PlanKey,
      userId: session.user.id as string,
      baseUrl,
    });
    return Response.json({ session_url: result.session_url });
  } catch (error) {
    console.error('KOMOJU checkout error:', error);
    return Response.json({ error: 'Checkout session creation failed' }, { status: 500 });
  }
}
