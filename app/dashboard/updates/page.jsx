/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db} from "@/lib/firebase"
import { doc,getDoc} from "firebase/firestore"; 
import { toast } from "@/components/ui/use-toast"
import Link from "next/link";

export default function Updates() {

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadUpdates(){
   try{

    const docRef = doc(db, "Updates", "States");
    const docSnap = await getDoc(docRef);
     var data = docSnap.data().data 
     var lota = []
     data.sort()
     setDocs(data)
     setLoading(false)
   }
   catch(e){
    toast({
      variant: "destructive",
      title: "Error Loading Publications",
    })
   }
 }
  useEffect(() => {
    LoadUpdates();
  },[]);



  return (
    <>
    <div className="w-full h-ful flex flex-col  overflow-scroll overflow-x-hidden">
      {/* <div className="header w-full p-3 flex justify-end">
        <AddUpdates reload={LoadUpdates}/>
      </div> */}
      <div className="view w-full flex items-center justify-center">
          {loading ?
            <div className="mt-5">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            <div className=" w-1/2 h-full gap-3 flex flex-col flex-wrap p-3">
             {docs.map((state,index)=><Link href={'/dashboard/updates/'+state} key={index} className="w-full"><div className="p-3 bg-secondary hover:bg-primary hover:text-white rounded-lg m-0">{state}</div></Link>)}
            </div>
            // <UpdateCardGroup docs={docs} reload={LoadUpdates}/>
          }
      </div>

    </div>
    </>
  )
}
