import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'id']
const defaultLocale = 'id'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale
  
  // Simple heuristic for locale matching
  if (acceptLanguage.includes('id')) return 'id'
  if (acceptLanguage.includes('en')) return 'en'
  
  return defaultLocale
}

import { verifySession } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore static files, images, and api routes
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  // Protect all /admin routes except /admin/login
  if (pathname.includes("/admin") && !pathname.endsWith("/login") && !pathname.endsWith("/login/")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const session = await verifySession(sessionCookie);

    if (!session || session.role !== "Admin") {
      const langSegment = pathname.split("/")[1] || defaultLocale;
      const loginUrl = new URL(`/${langSegment}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (pathname.includes("/admin") && (pathname.endsWith("/login") || pathname.endsWith("/login/"))) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const session = await verifySession(sessionCookie);

    if (session && session.role === "Admin") {
      const langSegment = pathname.split("/")[1] || defaultLocale;
      const dashboardUrl = new URL(`/${langSegment}/admin`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
}
