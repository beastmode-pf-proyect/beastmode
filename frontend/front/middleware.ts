// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/dashboard/usuarios', '/dashboard/estadisticas', '/dashboard/rutina', '/dashboard/membresias', '/dashboard/configuracion'];

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('isAuthenticated')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && (!isAuth || userRole !== 'ADMIN')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
