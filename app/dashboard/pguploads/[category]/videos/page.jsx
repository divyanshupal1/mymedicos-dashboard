/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db,storage } from "@/lib/firebase"
import { collection,getDocs} from "firebase/firestore"; 

import { toast } from "@/components/ui/use-toast"
import { CardGroup} from "./VideoSection"
import { AddVideo } from "./AddVideo"
import { urlMerger } from "@/lib/utils";

export default function Home({params}) {

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadNews(){
   try{
     const querySnapshot = await getDocs(collection(db, "PGupload","Videos","Video"));
     var temp = []
     querySnapshot.forEach((doc) => {
      if(doc.data()?.speciality==urlMerger(params.category)){
        temp = [...temp,[doc.id,doc.data()]];
      }
      //  temp = [...temp,[doc.id,doc.data()]];
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
    LoadNews();
  },[]);


  return (
    <>
    <div className="w-full h-ful flex flex-col  overflow-scroll overflow-x-hidden">
      <div className="header w-full p-3 flex justify-end">
        <AddVideo reload={LoadNews} speciality={params.category}/>
      </div>
      <div className="view w-full flex items-center justify-center">
          {loading ?
            <div>
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            <CardGroup docs={docs} reload={LoadNews}/>
          }
      </div>

    </div>
    </>
  )
}
