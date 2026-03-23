import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET ?? 'development-secret' });

  const isAuth = !!token;
  const pathname = req.nextUrl.pathname;

  const protectedPaths = ['/dashboard', '/transactions', '/invoices', '/settings', '/billing'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/invoices/:path*',
    '/settings/:path*',
    '/billing/:path*',
  ],
};
