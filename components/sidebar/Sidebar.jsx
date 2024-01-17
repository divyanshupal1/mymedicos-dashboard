"use client"
import React from 'react'

import { ModeToggle } from '../theme-toggle'
import Navigation from './Navigation'
import {MdOutlineLogout} from 'react-icons/md'
import {useRouter} from "next/navigation";

function Sidebar() {
    const router = useRouter()
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'GET',
            })
            router.push('/login')
        } catch (error) {
        }
    }
  return (
    <div className='w-64 border-r h-screen flex flex-col gap-y-2 px-5'>
        <div className="logo py-4 ">
            <div className=' dark:bg-cyan-100  dark:rounded-lg'>
                <Logo/>
            </div>
        </div>
        <div className="navigation flex flex-col gap-y-3 mt-5 ">
            <Navigation/>
        </div>
        <div className='align-bottom mt-auto mb-5 w-full flex justify-between gap-x-4'>
            <div className='p-1.5 px-4 gap-x-3 cursor-pointer rounded-lg flex items-center border flex-grow hover:bg-slate-400 hover:bg-opacity-10 ' onClick={logout}><MdOutlineLogout/> Logout</div>
            <ModeToggle/>
        </div>
    </div>
  )
}

export default Sidebar

import logo from "@/public/mymedicos.png"
function Logo(){
    return (
        <img src={logo.src} alt="mymedicos" className=" object-contain h-10 ml-0"/>
    )
}
