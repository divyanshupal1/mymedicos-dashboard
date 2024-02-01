/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db,storage } from "@/lib/firebase"
import { collection, addDoc,getDoc,doc  } from "firebase/firestore"; 
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { MdClose } from "react-icons/md";

export default function Home() {
  const {toast} = useToast()

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])
 const [showDialog,setShowDialog]=React.useState(false)

 async function LoadSubjects(){
  try{
    const docRef = doc(db, "Categories", "39liVyLEjII6dtzolxSZ");
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
      <div className="view w-full flex  justify-center h-full">
          {loading ?
            <div className="">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            // <SliderGroup docs={docs} reload={LoadSubjects}/>
            <div className="w-full gap-3 flex p-3 relative align-top justify-start h-full ">
              <Link href={'/dashboard/pguploads/home'}><div className="p-3 bg-secondary hover:bg-primary hover:text-white rounded-lg m-0">Home</div></Link>
              <Link href={'/dashboard/pguploads/Sponsor'}><div className="p-3 bg-secondary hover:bg-primary hover:text-white rounded-lg m-0">Sponsor</div></Link>
              <Link href={'/dashboard/pguploads/Exam'}><div className="p-3 bg-secondary hover:bg-primary hover:text-white rounded-lg m-0">Exam</div></Link>
              <button onClick={()=>setShowDialog(!showDialog)} className={`p-3 ${showDialog?"bg-red-500":"bg-secondary"} hover:bg-primary hover:text-white rounded-lg m-0 flex-grow-0 h-[50px]`}>{ showDialog?<MdClose/>:"Speciality"}</button>
              {showDialog && <CategoriesDialog docs={docs}/>}
            </div>
          }
      </div>

    </div>
    </>
  )
}

function CategoriesDialog({docs}){
  return (
    <div className="gap-3 flex border flex-col p-6 absolute bg-primary-foreground w-2/3 h-2/3 rounded-md overflow-y-scroll top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {docs.map((state,index)=><Link href={'/dashboard/pguploads/'+state} key={index} ><div className="p-3 bg-secondary hover:bg-primary hover:text-white rounded-lg m-0">{state}</div></Link>)}
    </div>
  )
}
