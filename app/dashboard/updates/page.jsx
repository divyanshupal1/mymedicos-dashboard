/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db} from "@/lib/firebase"
import { collection,getDocs} from "firebase/firestore"; 
import { toast } from "@/components/ui/use-toast"
import { AddUpdates } from "@/components/system/updates/addUpdates"
import { UpdateCardGroup } from "@/components/system/updates/LoadUpdates";

export default function Updates() {

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadUpdates(){
   try{

     const querySnapshot = await getDocs(collection(db, "Updates","Uttar Pradesh","Galgotias University"));
     var temp = []
     querySnapshot.forEach((doc) => {
       temp = [...temp,[doc.id,doc.data()]];
     });
     setDocs(temp)
     setLoading(false)
   }
   catch(e){
    console.log(e)
    toast({
      variant: "destructive",
      title: "Error Loading Publications",
    })
   }
 }
  useEffect(() => {
    LoadUpdates();
  },[]);

  console.log(docs)

  return (
    <>
    <div className="w-full h-ful flex flex-col  overflow-scroll overflow-x-hidden">
      <div className="header w-full p-3 flex justify-end">
        <AddUpdates reload={LoadUpdates}/>
      </div>
      <div className="view w-full flex items-center justify-center">
          {loading ?
            <div>
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            <></>
            // <UpdateCardGroup docs={docs} reload={LoadUpdates}/>
          }
      </div>

    </div>
    </>
  )
}
