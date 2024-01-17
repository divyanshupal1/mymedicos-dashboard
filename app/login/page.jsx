import React from 'react'
import { CardWithForm } from "./LoginCard"
import Logo from "@/public/mymedicos.png"

async function Page() {
  return (
    <div className='w-full h-screen flex flex-col justify-start items-center bg-[linear-gradient(90deg,#56CCF2,#2F80ED)]'>
      <img src={Logo.src} alt="mymedicos" className="mt-20"/>
      <CardWithForm/>
    </div>
  )
}

export default Page
