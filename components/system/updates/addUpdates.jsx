"use client"
import React ,{useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  
export function AddUpdates({reload,state,uni}) {  
    const {toast} = useToast();
    
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailSubmitStatus, setThumbnailSubmitStatus] = useState(4);
    const [thumbnailSubmitProgress, setThumbnailSubmitProgress] = useState(0);
  
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [action, setAction] = useState("");
    const [publishStatus, setPublishStatus] = useState(0);
  
    const [flag, setFlag] = useState(false);

    function reset(){
      setDescription("");
      setTitle("");
      setAction("");
      setThumbnail(null);
      setThumbnailUrl(""); 
      setThumbnailSubmitStatus(4);
    }
    useEffect(()=>{
      if(thumbnail && thumbnailUrl.length>0 && title.length > 0 && description.length > 0 && action.length > 0 && thumbnailUrl != null){
        setFlag(true);
      }
      else setFlag(false);
    },[title,thumbnailUrl,thumbnail,description,action])

    async function uploadThumbnail(e){
      setThumbnail((prev)=>e.target.files[0]);
      setThumbnailSubmitStatus(0);
      if(e.target.files[0].type != "image/png" && e.target.files[0].type != "image/jpeg"){
        setThumbnailSubmitStatus(3);
        return;
      }
      const storageRef = ref(storage, 'Updates/thumbnails/'+v4()+e.target.files[0].name);
      const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setThumbnailSubmitProgress(progress);
        }, 
        (error) => {
          setThumbnailSubmitStatus(2);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setThumbnailSubmitStatus(1);
            setThumbnailUrl(downloadURL);
  
          });
        }
      );
    }
    async function Publish(){
      setPublishStatus(1);
      try{
        const docRef = await addDoc(collection(db, "Updates",state,uni), {
          Title: title,
          Description: description,
          Action: action,
          thumbnail: thumbnailUrl,
          Time: new Date().toISOString(),
        });
        toast({
          title: "Update Added!",
        })
        setPublishStatus(0);
        reload();
        reset();
      }
      catch(e){
        setPublishStatus(0);
        toast({
          variant: "destructive",
          title: "Some Error Occured",
        })
      }
    }
  
    return (
      <Dialog onOpenChange={reset}>
        <DialogTrigger asChild>
          <Button variant="secondary"  className="gap-x-2"><MdAdd className="scale-125"/> Add Updates</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[calc(100vh-50px)] overflow-y-scroll scrollbar-hidden">
          <DialogHeader>
            <DialogTitle>Add Updates</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <form>
            <div className="grid w-full items-center gap-5">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="title">Update Title</Label>
                <Input id="title" placeholder="Update Title" value={title} 
                  className={`${title.length > 1 ? "" : "outline outline-red-600"}`}
                  onChange={(e)=>setTitle(e.target.value)} 
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Description</Label>
                <Textarea className={`max-h-[200px] ${description.length > 1 ? "" : "outline outline-red-600"}`} placeholder="Description" id="message" value={description} onChange={(e)=>setDescription(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="author">Action</Label>
                <Input id="author" className={`${action.length > 1 ? "" : "outline outline-red-600"}`} placeholder="Update Action" value={action} onChange={(e)=>setAction(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="price">Select Thumbnail</Label>
                <Input id="price"
                 accept="image/png, image/jpeg"
                 className={`${thumbnail ? "" : "outline outline-red-600"}`}
                 onChange={(e)=>{
                  uploadThumbnail(e);
                 }}
                 type='file'
                />
                <div className="scale-125 absolute right-1.5 bottom-1.5  p-1 rounded bg-white dark:bg-slate-950">
                  {thumbnailSubmitStatus == 1 && thumbnail && <IoCloudDone className="text-green-600 font-bold "/>}
                  {thumbnailSubmitStatus == 0 && thumbnail && <AiOutlineLoading3Quarters className="text-green-600 font-bold animate-spin"/>}
                 </div>
              </div>
              {thumbnailUrl.length > 0 && <div className="flex flex-col space-y-1.5 relative w-full h-52 rounded-md" style={{background:`url(${thumbnailUrl})`}}></div>}
          
            </div>
          </form>
          </div>
          <DialogFooter className={"items-center gap-x-4"}>
            {!flag && <p className="text-sm font-medium text-red-600">*Complete necessary fields</p>}
            <Button type="submit" disabled={!flag ||publishStatus==1} onClick={()=>{
              if(flag){
                Publish();
              }
            }}>{publishStatus==0?"Publish":<><div className="scale-125"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Publishing..</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }