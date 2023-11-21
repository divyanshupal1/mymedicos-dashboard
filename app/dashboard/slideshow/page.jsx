/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { getData } from "@/lib/docFunctions"
import SliderGroup from "./SliderGroup"

export default function Home() {

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadPublications(){
   const temp = await getData("SlideShow")
   setDocs(temp)
   setLoading(false)
 }
  useEffect(() => {
    LoadPublications();
  },[]);

  if(docs.length===0) return <></>

  return (
    <>
    <div className="w-full h-ful flex flex-col  overflow-scroll overflow-x-hidden">
      <div className="view w-full flex items-center justify-center h-full">
          {loading ?
            <div className="">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            <SliderGroup docs={docs} reload={LoadPublications}/>
          }
      </div>

    </div>
    </>
  )
}
