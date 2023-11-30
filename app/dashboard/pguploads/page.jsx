/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db,storage } from "@/lib/firebase"
import { collection, addDoc,getDoc,doc  } from "firebase/firestore"; 
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const {toast} = useToast()

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadSubjects(){
  try{
    const docRef = doc(db, "Categories", "s7hdqLUEkfyVJJ6cfbeW");
    const docSnap = await getDoc(docRef);
    const data = docSnap.data()
    const temp = Object.keys(data)
    setDocs(temp)
    setLoading(false)
  }
  catch(e){
    toast({
      variant: "destructive",
      title: "Error Loading Subjects",
    })
  }
}

  useEffect(() => {
    LoadSubjects();
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
            // <SliderGroup docs={docs} reload={LoadSubjects}/>
            <div className="w-full h-full flex gap-3 p-3">
             {docs.map((state,index)=><Link href={'/dashboard/pguploads/'+state} key={index}><div className="p-3 bg-secondary rounded-lg">{state}</div></Link>)}
            </div>
          }
      </div>

    </div>
    </>
  )
}
