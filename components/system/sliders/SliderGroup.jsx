import React from 'react'
import { MdEdit } from 'react-icons/md'

function SliderGroup({reload,docs}) {

  return (
    <>
        <div className='w-full h-full p-6 gap-y-6 flex flex-col'>
            {docs.map((doc,index)=><SliderCard key={index} doc={doc} reload={reload}/>)}
        </div>
    </>
  )
}

export default SliderGroup

function SliderCard({doc,reload}){
    // console.log(doc[1].images)
    return(
        <div className='w-full h-[320px] overflow-hidden bg-slate-800 border bg-opacity-20 rounded-md p-4 '>
            <div className='w-full flex justify-between items-center'>
                <div className='font-bold text-lg'>{doc[0]}</div>
                <div><EditDialog reset={reload} data={doc}/></div>
            </div>
            <div className='flex gap-x-3 overflow-x-scroll h-[calc(300px-50px)] py-3 scrollbar-custom'>
                {doc[1].images.map((image,index)=><img key={index} src={image.url} alt=""/>)}
            </div>
        </div>
    )
}

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { MdAdd} from "react-icons/md"
import {IoCloudDone} from "react-icons/io5"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { db,storage } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"; 
import { v4 } from "uuid"
import { updateData, uploadFile } from '@/lib/docFunctions'

function EditDialog({reset,data}){
    const {toast} = useToast();
    const [doc,setDoc] = useState(data[1].images);
    const [publishStatus,setPublishStatus] = useState(0);

    function callback(){
        setPublishStatus(0);
        toast({
            title: "Updated Banner !",
        })
        reset();
    }
    async function Publish(){
      console.log(doc)
      console.log(doc)  
      setPublishStatus(1);
      await updateData("Sliders",data[0],{images:doc},callback)
    }



    return (
        <Dialog onOpenChange={reset}>
        <DialogTrigger asChild>
          <Button variant="secondary"  className="gap-x-2"><MdEdit className="scale-125"/> Edit</Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[925px] max-h-[500px]">
          <DialogHeader>
            <DialogTitle>{data[0]}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-x-scroll scrollbar-custom ">
          <form className='h-full'>
            <div className="flex w-full items-top grow gap-5 h-full">
                {doc.map((image,index)=><ImageComp key={index} index={index} doc={image} fulldoc={doc} setDoc={setDoc}/>)}                        
            </div>
          </form>
          </div>
          <DialogFooter className={"items-center gap-x-4"}>
            <Button  onClick={Publish}>{publishStatus==0?"Update":<><div className="scale-125 gap-x-3"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Updating..</>}</Button>
            {/* {!flag && <p className="text-sm font-medium text-red-600">*Complete necessary fields</p>}
            <Button type="submit" disabled={!flag ||publishStatus==1} onClick={()=>{
              if(flag){
                Publish();
              }
            }}>{publishStatus==0?"Publish":<><div className="scale-125"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Publishing..</>}</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}


function ImageComp({doc,index,fulldoc,setDoc}){

    const [action,setAction] = useState(doc.action);
    const [img,setImg] = useState(null);
    const [imgProgress,setImgProgress] = useState(1);
    const [imgUrl,setImgUrl] = useState(doc.url);
    const {toast} = useToast();
    const [flag,setFlag] = useState(true);

    function success(){
        var tempdoc = [...fulldoc];
        tempdoc[index].action = action;
        tempdoc[index].url = imgUrl;
        setDoc(tempdoc);
        toast({
            title: "Image Uploaded",
            description: "Image Uploaded Successfully",    
        })
    }

    async function uploadThumbnail(e){
        setImgProgress(0);
        const file = e.target.files[0];
        setImg(file);
        await uploadFile("Sliders/",file,setImgProgress,setImgUrl,success)
    }

    return (       
      <div className='border-2 w-full p-3 rounded-md flex flex-col gap-y-3 min-w-[250px] max-w-[280px]' >
        <div className="flex flex-col space-y-1.5 relative">
            <Label htmlFor="price">Select Banner Image</Label>
            <Input id="price"
              accept="image/png, image/jpeg"
            //   className={`${thumbnail ? "" : "outline outline-red-600"}`}
              onChange={(e)=>{
              uploadThumbnail(e);
              }}
              type='file'
            />
            <div className="scale-125 absolute right-1.5 bottom-1.5  p-1 rounded bg-white dark:bg-slate-950">
                {imgProgress == 100 && img && <IoCloudDone className="text-green-600 font-bold "/>}
                {imgProgress == 0 && img && <AiOutlineLoading3Quarters className="text-green-600 font-bold animate-spin"/>}
            </div>
        </div>
       <div className='w-full min-h-[150px]' style={{background:`url(${imgUrl})`,backgroundSize:"contain"}}></div>
        <div className="flex flex-col space-y-2 mt-auto">
            <Label htmlFor="title">Action</Label>
            <Input id="title" placeholder="Title of the Book" value={action} 
             className={`${action.length > 1 ? "" : "outline outline-red-600"}`}
             onChange={(e)=>setAction(e.target.value)} 
            />
        </div>
      </div>
    )
}