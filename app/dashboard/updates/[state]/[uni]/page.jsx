/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db} from "@/lib/firebase"
import { collection,getDocs} from "firebase/firestore"; 
import { toast } from "@/components/ui/use-toast"
import { AddUpdates } from "@/components/system/updates/addUpdates"
import { UpdateCardGroup } from "@/components/system/updates/LoadUpdates";
import Link from "next/link";
import { set } from "date-fns";

export default function Updates({params}) {
 var state = params.state.split("%20")
 var uni = params.uni.split("%20")
 state = state.join(" ")
 uni = uni.join(" ")

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadUpdates(){
    try{
        var temp = []
        const querySnapshot = await getDocs(collection(db, "Updates",state,uni));
        querySnapshot.forEach((doc) => {
             temp = [...temp,[doc.id,doc.data()]]
        });    
        setDocs(temp)    
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
      <div className="header w-full p-3 flex justify-end">
        <AddUpdates reload={LoadUpdates} state={state} uni={uni}/>
      </div>
      <div className="view w-full flex items-center justify-center">
          {loading ?
            <div className="mt-5">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            <div className="w-full flex gap-3 p-3">
             {/* {docs.map((uni,index)=><Link href={'/dashboard/updates/'+state+'/'+uni} key={index}><div className="p-3 bg-secondary rounded-lg">{uni}</div></Link>)} */}
             <UpdateCardGroup docs={docs} reload={LoadUpdates} state={state} uni={uni}/>
            </div>
          }
      </div>

    </div>
    </>
  )
}
