"use client"
import React,{useEffect,useState} from 'react'
import { db } from "@/lib/firebase"
import {collection,getDocs,query,where,updateDoc,doc} from "firebase/firestore"; 
import { Button } from '@/components/ui/button';
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
import {AiOutlineLoading3Quarters} from "react-icons/ai"

function Page() {

    const toast = useToast();
    const [loading, setLoading] = React.useState(true)
    const [docs,setDocs]=React.useState([])

    async function LoadQuizes(){
        try{
            var data=[];
            const q = query(collection(db, "CME"),where("endtime","!=",null));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                data.push([doc.id,doc.data()])
            });
            setDocs(data)
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
        LoadQuizes();
    },[]);

    return (
        <div className='w-full flex flex-wrap p-3'>
            {
                docs.map((doc)=>{
                    return <Card id={doc[0]} key={doc[0]} cme={doc[1]} reload={LoadQuizes}/>
                })
            }
        </div>
    )
}

export default Page

function Card({id,cme,reload}){
  return (
    <div className=" w-1/3 p-3 rounded-md overflow-hidden border-2 bg-slate-800 bg-opacity-10 relative h-fit">       
      <div className="w-full flex flex-col gap-y-3">
        <div className="text-base w-[206px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible"> CME Title : {cme["CME Title"]}</div>
        <div className="text-base ">CME Organiser : {cme["CME Organiser"]}</div>
        <div className="text-base">User : {cme["User"]}</div>
        <div className="text-base ">Date : {cme["Date"]}</div>
        <div className="text-base ">Speciality : {cme["Speciality"]}</div>
        <div className="text-base ">SubSpeciality : {cme["SubSpeciality"]}</div>
        <div className="text-base">Selected Time : {cme["Selected Time"]}</div>
        <div className="text-base">Video Added : {cme["Video"]?"Yes":"No"}</div>
      </div>
      <div className="actions absolute top-0 right-0 p-3">
        <AddVideo reload={reload} id={id}/>
      </div>
    </div>
  )
}
  
export function AddVideo({reload,id}) {  
    const {toast} = useToast();
    const [URL, setURL] = useState("");
    const [flag, setFlag] = useState(false);
    const [publishStatus, setPublishStatus] = useState(0);

    useEffect(()=>{
      if( URL.length > 0 ){
        setFlag(true);
      }
      else setFlag(false);
    },[URL])

    async function Publish(){
      setPublishStatus(1);
      try{
        await updateDoc(doc(db, "CME", id), {
            Video: URL
        }).then(()=>{
            setPublishStatus(0);
            toast({
                title: "Video Added",
            })
            reload();
        });
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
      <Dialog >
        <DialogTrigger asChild>
          <Button variant="ghost"  className="gap-x-2">Add Video</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form>
                <div className="grid w-full items-center gap-5">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="News Title" value={URL} 
                    className={`${URL.length > 1 ? "" : "outline outline-red-600"}`}
                    onChange={(e)=>setURL(e.target.value)} 
                    />
                </div>
                </div>  
            </form>
          </div>
          <DialogFooter className={"items-center gap-x-4"}>
            {!flag && <p className="text-sm font-medium text-red-600">*Complete necessary fields</p>}
            <Button type="submit" disabled={!flag ||publishStatus==1} onClick={()=>{
              if(flag){
                Publish();
              }
            }}>{publishStatus==0?"Add Video":<><div className="scale-125"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Adding..</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  