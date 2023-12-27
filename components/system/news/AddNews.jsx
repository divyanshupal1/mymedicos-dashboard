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
import { Select,SelectTrigger,SelectValue, SelectContent,SelectItem } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { MdAdd} from "react-icons/md"
import {IoCloudDone} from "react-icons/io5"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { db,storage } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"; 
import { v4 } from "uuid"
  
export function AddNews({reload}) {  
    const {toast} = useToast();
    
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailSubmitStatus, setThumbnailSubmitStatus] = useState(4);
    const [thumbnailSubmitProgress, setThumbnailSubmitProgress] = useState(0);
  
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [URL, setURL] = useState("");
    const [publishStatus, setPublishStatus] = useState(0);
    const [val, setVal] = useState("News");
  
    const [flag, setFlag] = useState(false);

    function reset(){
      setDescription("");
      setTitle("");
      setURL("");
      setThumbnail(null);
      setThumbnailUrl(""); 
      setThumbnailSubmitStatus(4);
    }
    useEffect(()=>{
      if( title.length > 0 ){
        setFlag(true);
      }
      else setFlag(false);
    },[title])

    async function uploadThumbnail(e){
      setThumbnail((prev)=>e.target.files[0]);
      setThumbnailSubmitStatus(0);
      if(e.target.files[0].type != "image/png" && e.target.files[0].type != "image/jpeg"){
        setThumbnailSubmitStatus(3);
        return;
      }
      const storageRef = ref(storage, 'News/thumbnails/'+v4()+e.target.files[0].name);
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
        const docRef = await addDoc(collection(db, "MedicalNews"), {
          Title: title,
          Description: description,
          URL: URL,
          thumbnail: thumbnailUrl,
          type: val,
          Time: new Date().toISOString(),
        });
        toast({
          title: "News Added",
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
          <Button variant="secondary"  className="gap-x-2"><MdAdd className="scale-125"/> Add News</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add News</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <form>
            <div className="grid w-full items-center gap-5">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="News Title" value={title} 
                  className={`${title.length > 1 ? "" : "outline outline-red-600"}`}
                  onChange={(e)=>setTitle(e.target.value)} 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="price">Type</Label>
                <ToggleGroup type="single" value={val} defaultValue="News" className="w-full justify-between gap-x-3" onValueChange={(val)=>setVal(val)}>
                  <ToggleGroupItem value="News" aria-label="Toggle bold" className="w-1/2">
                    <p>News</p>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Notice" aria-label="Toggle italic" className="w-1/2">
                    <p>Notice</p>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Description</Label>
                <Textarea className={`${description.length > 1 ? "" : "outline outline-red-600"}`} placeholder="Description" id="message" value={description} onChange={(e)=>setDescription(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="author">Link to Article</Label>
                <Input id="author" placeholder="Link to news article" value={URL} onChange={(e)=>setURL(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="price">Select Thumbnail</Label>
                <Input id="price"
                 accept="image/png, image/jpeg"
                 
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

  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
  
  export function ToggleGroupDemo({setVal,val}) {
    return (
      <ToggleGroup type="single" value={val} defaultValue="Book" className="w-ful justify-between" onValueChange={(val)=>setVal(val)}>
        <ToggleGroupItem value="Textbook" aria-label="Toggle bold" className="w-1/3">
          <p>Textbook</p>
        </ToggleGroupItem>
        <ToggleGroupItem value="Research" aria-label="Toggle italic" >
          <p>Research-Paper</p>
        </ToggleGroupItem>
        <ToggleGroupItem value="Book" aria-label="Toggle strikethrough" className="w-1/4">
          <p>Book</p>
        </ToggleGroupItem>
      </ToggleGroup>
    )
  }