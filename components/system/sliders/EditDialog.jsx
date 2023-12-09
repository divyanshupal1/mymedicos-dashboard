
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
import { updateData} from '@/lib/docFunctions'
import { v4 } from 'uuid'
import { MdEdit,MdAdd } from "react-icons/md"

export function EditDialog({reload,data}){
    const {toast} = useToast();
    const [newData,setNewData] = useState([{id:"",action:"",url:""}]);
    const [publishStatus,setPublishStatus] = useState(0);

    function callback(){
        setPublishStatus(0);
        toast({
            title: "Updated Banner !",
        })
        reload();
    }
    async function Publish(){
      setPublishStatus(1);
      await updateData("Sliders",data[0],{images:newData},callback)
    }
    const addImage = ()=>{
        setNewData([...newData,{id:"",action:"",url:""}])
    }
    function reset(){
        setNewData([{id:"",action:"",url:""}]);
    }



    return (
        <Dialog onOpenChange={reset}>
        <DialogTrigger asChild>
          <Button variant="secondary"  className="gap-x-2"><MdEdit className="scale-125"/> Edit</Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[925px] max-h-[500px]">
          <DialogHeader>
            <DialogTitle className="w-full" >
              {data[0]}   
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 overflow-x-scroll scrollbar-custom ">
          <form className='h-full'>
            <div className="flex w-full items-top grow gap-5 h-full">
                {newData.map((image,index)=><ImageComp key={index} index={index} doc={image} fulldoc={newData} setDoc={setNewData}/>)}                        
            </div>
          </form>
          </div>
          <DialogFooter >
            <div className={"flex justify-between w-full items-center gap-x-4"}>
            <Button onClick={addImage} variant="secondary" className="gap-x-2"><MdAdd className="scale-125"/>Add Banner Image</Button> 
            <Button  onClick={Publish}>{publishStatus==0?"Update":<><div className="scale-125 gap-x-3"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Updating..</>}</Button>
            </div>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}

import { storage } from "@/lib/firebase"
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"

function ImageComp({doc,index,fulldoc,setDoc}){

    const [action,setAction] = useState("");
    const [img,setImg] = useState(null);
    const [imgProgress,setImgProgress] = useState(1);
    const [imgUrl,setImgUrl] = useState("");
    const {toast} = useToast();
    const [flag,setFlag] = useState(true);
    function success(){
      var temp = [...fulldoc];
      temp[index].id = v4();
      temp[index].action = action;
      temp[index].url = imgUrl;
      setDoc(temp);
    }
    useEffect(()=>{
      success()
    },[imgUrl,action])

    async function uploadThumbnail(e){
        setImgProgress(0);
        const file = e.target.files[0];
        setImg(file);
        const storageRef = ref(storage, "Sliders/" + v4() + file.name);
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
            <Label htmlFor="price">Select Banner Image</Label>
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
        <div className="flex flex-col space-y-2 mt-auto">
            <Label htmlFor="title">Action</Label>
            <Input id="title" placeholder="Action" value={action} 
             className={`${action.length > 1 ? "" : "outline outline-red-600"}`}
             onChange={(e)=>setAction(e.target.value)} 
            />
        </div>
      </div>
    )
}