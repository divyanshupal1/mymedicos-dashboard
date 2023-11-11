"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

function Titlebar() {
  let path = usePathname()
  return (
    <>
     {path=='/publications' && 'Publish a Book'}
    </>
  )
}

export default Titlebar