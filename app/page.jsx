"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"


 function Page() {

  return (
    <div><button onClick={signIn}>Login</button></div>
  )
}

export default Page