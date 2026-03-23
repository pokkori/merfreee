import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ authenticated: false }, { status: 401 });
    }
    return Response.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch {
    return Response.json({ authenticated: false, error: 'Session check failed' }, { status: 500 });
  }
}
