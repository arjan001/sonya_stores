import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create response
  let response = NextResponse.next({ request })

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // Check authentication for admin routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('admin_token')?.value
    
    // Allow register and login without token
    if (request.nextUrl.pathname === '/admin/register' || request.nextUrl.pathname === '/admin/login' || 
        request.nextUrl.pathname === '/api/admin/register' || request.nextUrl.pathname === '/api/admin/login') {
      return response
    }

    // Require token for all other admin routes
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
