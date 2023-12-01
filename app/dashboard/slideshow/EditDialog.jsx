
import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {IoCloudDone} from "react-icons/io5"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { insertData, updateData} from '@/lib/docFunctions'
import { v4 } from 'uuid'
import { MdEdit,MdAdd } from "react-icons/md"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { db,storage } from "@/lib/firebase"
import { collection, addDoc,getDoc,doc  } from "firebase/firestore"; 
import { urlMerger } from "@/lib/utils"

export function EditDialog({reload,speciality}){
    speciality =urlMerger(speciality);
    const {toast} = useToast();
    const [newData,setNewData] = useState([{id:"",url:""}]);
    const [publishStatus,setPublishStatus] = useState(0);
    const [title,setTitle] = useState("");
    const [fileUrl,setFileUrl] = useState("");
    const [file,setFile] = useState(null);
    const [fileProgress,setFileProgress] = useState(1);
    const [type,setType] = useState("pdf");


    async function uploadThumbnail(e){
      setFileProgress(0);
      const file = e.target.files[0];
      setFile(file);
      const storageRef = ref(storage, "Slideshow/files/" + v4() + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileProgress(progress);
        }, 
        (error) => {
          return false;
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUrl(downloadURL);
          });
        }
      );

  }

    function callback(){
        setPublishStatus(0);
        toast({
            title: "Updated Slideshow !",
        })
        reload();
    }
    async function Publish(){
      setPublishStatus(1);
      try{
        const docRef = await addDoc(collection(db, "SlideShow","Speciality",speciality), {
          title:title,
          images:newData,
          file:fileUrl,
          type:type,
        });
        toast({
          title: "Update Added!",
        })
        callback();
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
    const addImage = ()=>{
        setNewData([...newData,{id:"",url:""}])
    }
    function reset(){
        setNewData([{id:"",url:""}]);
    }

    return (
        <Dialog onOpenChange={reset}>
        <DialogTrigger asChild>
          <Button variant="secondary"  className="gap-x-2"><MdAdd className="scale-125"/> Add</Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[925px] max-h-[700px]">
          <DialogHeader>
            <DialogTitle className="w-full" >
              Add Slideshow  
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-x-scroll scrollbar-custom ">
            <div className="w-full flex justify-between gap-x-4">
              <div className="flex flex-col space-y-2 w-full p-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Title of slideshow" value={title}
                className={`${title.length > 1 ? "" : "outline outline-red-600"}`}
                onChange={(e)=>setTitle(e.target.value)} 
                />
              </div>
            </div>
            <div className="w-full flex justify-between gap-x-4">
              <div className="flex flex-col space-y-1.5 relative p-2 w-full">
                <Label htmlFor="price">Select File</Label>
                <Input id="file"
                  type="file"
                  placeholder="Select PPT File"
                  className={`${fileUrl ? "" : "outline outline-red-600"}`}
                  onChange={(e)=>{
                  uploadThumbnail(e);
                  }}
                />
                <div className="scale-125 absolute right-5 bottom-3  p-1 rounded bg-white dark:bg-slate-950">
                    {fileProgress == 100 && file && <IoCloudDone className="text-green-600 font-bold "/>}
                    {fileProgress == 0 && file && <AiOutlineLoading3Quarters className="text-green-600 font-bold animate-spin"/>}
                </div>
              </div>
              <div className="flex flex-col space-y-2 p-2 w-2/5">
                <Label htmlFor="price">Type</Label>
                <ToggleGroupDemo setVal={setType} val={type}/>
              </div>
            </div>
            
          <form className='h-full'>
            <div className="flex w-full items-top grow gap-5 h-full">
                {newData.map((image,index)=><ImageComp key={index} index={index} doc={image} fulldoc={newData} setDoc={setNewData}/>)}                        
            </div>
          </form>
          </div>
          <DialogFooter >
            <div className={"flex justify-between w-full items-center gap-x-4"}>
            <Button onClick={addImage} variant="secondary" className="gap-x-2"><MdAdd className="scale-125"/>Add Thumbnail</Button> 
            <Button  onClick={Publish}>{publishStatus==0?"Update":<><div className="scale-125 gap-x-3"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Updating..</>}</Button>
            </div>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}

import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"

function ImageComp({doc,index,fulldoc,setDoc}){

    const [img,setImg] = useState(null);
    const [imgProgress,setImgProgress] = useState(1);
    const [imgUrl,setImgUrl] = useState("");
    const {toast} = useToast();
    const [flag,setFlag] = useState(true);

    function success(){
      var temp = [...fulldoc];
      temp[index].id = v4();
      temp[index].url = imgUrl;
      setDoc(temp);
    }

    useEffect(()=>{
      success()
    },[imgUrl])

    async function uploadThumbnail(e){
        setImgProgress(0);
        const file = e.target.files[0];
        setImg(file);
        const storageRef = ref(storage, "Slideshow/thumbnails/" + v4() + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImgProgress(progress);
          }, 
          (error) => {
            return false;
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImgUrl(downloadURL);
            });
          }
        );

    }

    return (       
      <div className='border-2 w-full p-3 rounded-md flex flex-col gap-y-3 min-w-[250px] max-w-[280px]' >
        <div className="flex flex-col space-y-1.5 relative">
            <Label htmlFor="price">Select Thumbnail Image</Label>
            <Input id="price"
              accept="image/png, image/jpeg"
              className={`${imgUrl ? "" : "outline outline-red-600"}`}
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
       <div className='w-full min-h-[150px] border-2 rounded-md' style={{backgroundImage:`url(${imgUrl})`,backgroundSize:"contain"}}></div>

      </div>
    )
}

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function ToggleGroupDemo({setVal,val}) {
  return (
    <ToggleGroup type="single" value={val} defaultValue="Book" className="w-full justify-between" onValueChange={(val)=>setVal(val)}>
      <ToggleGroupItem value="PPT" aria-label="Toggle bold" className="w-1/2">
        <p>PPT</p>
      </ToggleGroupItem>
      <ToggleGroupItem value="PDF" aria-label="Toggle italic" className="w-1/2" >
        <p>PDF</p>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}