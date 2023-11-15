"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

function Titlebar() {
  let path = usePathname()
  return (
    <>
     {path=='/publications' && 'Publications'}
     {path=='/news' && 'News'}
     {path=='/uguploads' && 'UG Uploads'}
     {path=='/pguploads' && 'PG Uploads'}
     {path=='/updates' && 'University Updates'}
     {path=='/sliders' && 'Sliders'}
     
    </>
  )
}

export default Titlebar