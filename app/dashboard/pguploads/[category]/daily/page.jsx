"use client"

import { AddDailyQuiz } from '@/components/system/quiz/addDailyQuiz'
import { urlMerger } from '@/lib/utils';


import { TimelyQuiz } from '@/components/system/quiz/timelyQuiz'
import React, { useEffect } from "react"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { db } from "@/lib/firebase"
import { Timestamp, collection,getDocs,query,where} from "firebase/firestore"; 
import { toast } from "@/components/ui/use-toast"

export default function Home({params}) {

 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadQuizes(){
   try{
    var data=[];
    const q = query(collection(db, "PGupload", "Daily", "Quiz"),where("speciality","==",urlMerger(params.category)));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push([doc.id,doc.data()])
    });
     setDocs(data)
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
    LoadQuizes();
  },[]);


  return (
    <>
    <div className="w-full h-ful flex flex-col  overflow-scroll overflow-x-hidden">
      <div className="header w-full p-3 flex justify-end">
      <AddDailyQuiz speciality={urlMerger(params.category)}/>
      </div>
      <div className="view w-full flex items-center justify-center">
          {loading ?
            <div>
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            <CardGroup docs={docs} reload={LoadQuizes}/>
          }
      </div>

    </div>
    </>
  )
}


import { doc, deleteDoc } from "firebase/firestore";
import { MdOutlineMoreVert } from "react-icons/md"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast";


export function CardGroup({docs,reload}){
    return (
      <div className="view w-full h-full p-4  flex flex-wrap flex-row gap-4">
          {docs.map((doc,i) => <Card key={doc[0]} quiz={doc[1]} id={doc[0]} reload={reload}/>)}
      </div>
    )
  }

  function Card({quiz,id,reload}){
    const {toast} = useToast();

    async function DeleteDoc(){
      if(!confirm("Are you sure you want to delete this Quiz?").valueOf()){
        return;
      }
      await deleteDoc(doc(db,"PGupload","Daily","Quiz", id)).then(
        ()=>{
          reload();
          toast({
            variant: "success",
            title: "Quiz Deleted",
          })
        }
      ).catch(()=>
        alert("Error Deleting Quiz")
      )
    }
    var start = new Date(quiz.Date)
    var today = new Date();

    // var date = new Date(quiz.Time).toLocaleDateString()
    return (
      <div className="w-[250px]  p-3 rounded-md overflow-hidden border-2 bg-slate-800 bg-opacity-10 relative">
        <div className="w-full relative">
          <div className="text-base w-[250px] overflow-hidden whitespace-nowrap text-ellipsis  hover:overflow-visible hover:relative"><p className="font-semibold inline">Question</p> : {quiz.Question}</div>
          <div className="text-base "><p className="font-semibold inline">Speciality</p> : {quiz.speciality}</div>
          <div className="text-base "><p className="font-semibold inline">Date</p> : {quiz.Date}</div>
          <div className="text-base "><p className="font-semibold inline">Status</p> : { start == today ?<p className='text-red-700 font-bold inline'>Active</p>:"Not Active" }</div>

        </div>
        <div className="actions absolute bottom-0 right-0 p-3 flex items-center gap-x-1">
          <AddDailyQuiz speciality={quiz.speciality} id={id} quiz={quiz} edit reload={reload}/>
          <DropdownMenu>
            <DropdownMenuTrigger><MdOutlineMoreVert className='scale-125'/></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={DeleteDoc}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  
  }