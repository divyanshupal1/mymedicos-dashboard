import { NextResponse } from 'next/server'
import jwt from "jsonwebtoken";

 

export function middleware(request) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

  const token = request.cookies.get('token')?.value || ''
  const {role} =  jwt.decode(token, process.env.NEXTAUTH_SECRET, {expiresIn: "1d"})
  
  if(isPublicPath && token && role === "admin+") {
    return NextResponse.redirect(new URL('/', request.nextUrl))
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