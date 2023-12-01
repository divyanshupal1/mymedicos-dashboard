"use client"
import React,{useEffect} from 'react'
import { db} from "@/lib/firebase"
import { collection,getDocs} from "firebase/firestore"; 
import { useToast } from '@/components/ui/use-toast';
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import Link from "next/link";
import SliderGroup from "../SliderGroup"
import { urlMerger } from '@/lib/utils';

function Page({params}) {
 const {toast} = useToast();

 var speciality = params.speciality;
speciality = urlMerger(speciality);
 const [loading, setLoading] = React.useState(true)
 const [docs,setDocs]=React.useState([])

 async function LoadUpdates(){
    var temp=[];
    try{
        const querySnapshot = await getDocs(collection(db, "SlideShow","Speciality",speciality));
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
    <div className="w-full h-ful flex flex-col  overflow-scroll overflow-x-hidden">
      <div className="view w-full flex items-center justify-center">
          {loading ?
            <div className="mt-5">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl text-slate-300"/>
            </div> 
            :
            
            <SliderGroup docs={docs} speciality={speciality} reload={LoadUpdates}/>
          }
      </div>

    </div>
  )
}

export default Page