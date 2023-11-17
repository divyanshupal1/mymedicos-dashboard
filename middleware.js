import { NextResponse } from 'next/server'
import jwt from "jsonwebtoken";

 

export function middleware(request) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/signup'

  const token = request.cookies.get('token')?.value || ''
  const decoded =  jwt.decode(token, process.env.NEXTAUTH_SECRET, {expiresIn: "1d"})
  const role = decoded?.role || ''


  if(isPublicPath && token && role === "admin+") {
    return NextResponse.redirect(new URL('/dashboard/publications', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
    
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/verifyemail'
  ]
}