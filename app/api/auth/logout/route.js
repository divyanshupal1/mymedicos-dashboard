import { cookies } from 'next/headers'
 
export async function GET(request) {
  const cookieStore = cookies()
  const token = cookieStore.set('token', '', { expires: new Date(0) })
 
  return new Response(JSON.stringify({message: "Logout successful",success: true,}), {
    status: 200,
  })
}