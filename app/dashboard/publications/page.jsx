/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import { AddPublication } from "@/components/system/publications/AddPublication"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db } from "@/lib/firebase"
import { collection,getDocs} from "firebase/firestore"; 
import { toast } from "@/components/ui/use-toast"
import { CardGroup } from "@/components/system/publications/LoadPublications"

export default function Home() {

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadPublications(){
   try{
     const querySnapshot = await getDocs(collection(db, "Publications"));
     var temp = []
     querySnapshot.forEach((doc) => {
       temp = [...temp,[doc.id,doc.data()]];
     });
     setDocs(temp)
     setLoading(false)
   }
   catch{
    toast({
      variant: "destructive",
      title: "Error Loading Publications",
    })
   }
 }
  useEffect(() => {
    LoadPublications();
  },[]);


  return (
    <>
    <div className="w-full h-ful flex flex-col  overflow-scroll overflow-x-hidden">
      <div className="header w-full p-3 flex justify-end">
        <AddPublication reload={LoadPublications}/>
      </div>
      <div className="view w-full flex items-center justify-center">
          {loading ?
            <div>
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            <CardGroup docs={docs} reload={LoadPublications}/>
          }
      </div>

    </div>
    </>
  )
}
