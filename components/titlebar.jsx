"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

function Titlebar() {
  let path = usePathname()
  var title = path.split('/')
  if(title.length>2){
      title = title[2]
  }
  else{
      title = title[1]
  }
  title = title.charAt(0).toUpperCase() + title.slice(1)
  return (
    <>
     {title}
    </>
  )
}

export default Titlebar