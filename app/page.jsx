"use client"
import Link from 'next/link'
import React from 'react'




 function Page() {

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <Link href={"/dashboard/publications"}><div className='p-3 rounded-md bg-primary'>Go to Dashboard</div></Link>
    </div>
  )
}

export default Page