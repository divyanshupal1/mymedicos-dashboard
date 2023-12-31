"use client"
import React ,{useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MdAdd} from "react-icons/md"
import {IoCloudDone} from "react-icons/io5"
import {AiOutlineLoading3Quarters} from "react-icons/ai"
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { db,storage } from "@/lib/firebase"
import { collection, addDoc,getDoc,doc  } from "firebase/firestore"; 
import { v4 } from "uuid"  
  
export function AddPublication({reload}) {  
    const {toast} = useToast();
  
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");
    const [fileSubmitStatus, setFileSubmitStatus] = useState(4); // 0: not submitted, 1: submitted, 2: error , 3: filetype error
    const [fileSubmitProgress, setFileSubmitProgress] = useState(0);
  
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailSubmitStatus, setThumbnailSubmitStatus] = useState(4);
    const [thumbnailSubmitProgress, setThumbnailSubmitProgress] = useState(0);
  
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("Free");
    const [publishStatus, setPublishStatus] = useState(0);
    const [type, setType] = useState("Book");
    const [subject, setSubject] = useState("Any");
    const [subjects,setSubjects] = useState([]);
    const [description,setDescription]=useState("")
  
    const [flag, setFlag] = useState(false);

    useEffect(()=>{
      if(type == ""){
        setType("Textbook");
      }
    },[type])

    function reset(){
      setAuthor("");
      setTitle("");
      setPrice(0);
      setCategory("Free");
      setThumbnail(null);
      setFile(null);
      setThumbnailUrl("");
      setFileUrl("");
      setThumbnailSubmitStatus(4);
      setFileSubmitStatus(4);
      setSubject("Any");
      setDescription("")
      LoadSubjects();
    }
    useEffect(()=>{
      if(file && thumbnail && title.length > 0 && author.length > 0 && Number(price) > -1 && category.length > 0 && fileUrl != null && thumbnailUrl != null){
        setFlag(true);
      }
      else setFlag(false);
    },[title,author,price,category,fileUrl,thumbnailUrl,file,thumbnail])
    useEffect(()=>{
      if(category == "FREE"){
        setPrice(0);
      }
    },[category,price])
    async function uploadfile(e){
      setFile(()=>e.target.files[0]);
      setFileSubmitStatus(0);
      if(!e.target.files[0]){
        setThumbnailSubmitStatus(3);
        return;
      }
      const storageRef = ref(storage, 'Publications/files/'+v4()+e.target.files[0].name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      setFileSubmitStatus(0);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileSubmitProgress(progress);
        }, 
        (error) => {
          setFileSubmitStatus(2);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUrl(downloadURL);
            setFileSubmitStatus(1);
          });
        }
      );
    }
    async function uploadThumbnail(e){
      setThumbnail((prev)=>e.target.files[0]);
      setThumbnailSubmitStatus(0);
      if(e.target.files[0].type != "image/png" && e.target.files[0].type != "image/jpeg"){
        setThumbnailSubmitStatus(3);
        return;
      }
      const storageRef = ref(storage, 'Publications/thumbnails/'+v4()+e.target.files[0].name);
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
        const docRef = await addDoc(collection(db, "Publications"), {
          Author: author,
          Title: title,
          Price: Number(price),
          Category:category,
          thumbnail: thumbnailUrl,
          Description:description,
          URL: fileUrl,
          Time: new Date().toISOString(),
          Type: type,
          Subject: subject,
        });
        toast({
          title: "Publication Added",
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
    
    async function LoadSubjects(){
      try{
        const docRef = doc(db, "Categories", "39liVyLEjII6dtzolxSZ");
        const docSnap = await getDoc(docRef);
        const data = docSnap.data()
        const temp = Object.keys(data)
        setSubjects(temp)
      }
      catch{
        toast({
          variant: "destructive",
          title: "Error Loading Subjects",
        })
      }
    }
  
    return (
      <Dialog onOpenChange={reset}>
        <DialogTrigger asChild>
          <Button variant="secondary"  className="gap-x-2"><MdAdd className="scale-125"/> Add Publication</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add new Publication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <form>
            <div className="grid w-full items-center gap-5">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Title of the Book" value={title} 
                  className={`${title.length > 1 ? "" : "outline outline-red-600"}`}
                  onChange={(e)=>setTitle(e.target.value)} 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" className={`${author.length > 1 ? "" : "outline outline-red-600"}`} placeholder="Author of the Book" value={author} onChange={(e)=>setAuthor(e.target.value)} />
              </div>
              
              <div className="w-full flex justify-between gap-x-3">
                <div className="flex flex-col space-y-2 w-2/5">
                  <Label htmlFor="title">Subject</Label>
                  <Select onValueChange={(value)=>setSubject(value)} defaultValue="Any">
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" value={subject}  />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectGroup>
                      <SelectLabel>Select Speciality</SelectLabel>
                      <SelectItem value="Any">Any</SelectItem>
                      {
                        subjects.map((item)=>{
                          return <SelectItem key={item} value={item}>{item}</SelectItem>
                        })
                      }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2 w-1/5">
                  <Label htmlFor="Category">Category</Label>
                  <Select onValueChange={(value)=>setCategory(value)} defaultValue="ALL">
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" value={category}  />
                    </SelectTrigger>
                    <SelectContent position="absolute" >
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="FREE">Free</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-2 w-2/5">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" className={`${Number(price) > -1 ? "" : "outline outline-red-600"}`} type='number' placeholder="0" value={price} onChange={(e)=>setPrice(e.target.value)} />
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Description</Label>
                <Textarea placeholder="Description" id="message" value={description} onChange={(e)=>setDescription(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="price">Type</Label>
                <ToggleGroupDemo setVal={setType} val={type}/>
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
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="price">Upload File</Label>
                <Input id="price"  
                  className={`${file ? "" : "outline outline-red-600"}`}              
                  onChange={(e)=>{                  
                    uploadfile(e);
                  }}
                 type='file' 
                 />
                 <div className="scale-125 absolute right-1.5 bottom-1.5  p-1 rounded bg-white dark:bg-slate-950">
                  {fileSubmitStatus == 1 && file && <IoCloudDone className="text-green-600 font-bold "/>}
                  {fileSubmitStatus == 0 && file && <AiOutlineLoading3Quarters className="text-green-600 font-bold animate-spin"/>}
                 </div>
           
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
            }}>{publishStatus==0?"Publish":<><div className="scale-125"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Publishing..</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }



  import {
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
  } from "@radix-ui/react-icons"
  
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


  function SubjectSelector({setSubject,subject}){

    const [loading, setLoading] = React.useState(true)
    const [docs,setDocs]=React.useState([])

    
      useEffect(() => {
        LoadPublications();
      },[]);

    return (
      <Select onValueChange={(value)=>setSubject(value)} defaultValue="Any">
        <SelectTrigger id="framework">
          <SelectValue placeholder="Select" value={subject}  />
        </SelectTrigger>
        <SelectContent position="popper" >
          <SelectItem value="Any">Any</SelectItem>
          {
            docs.map((item)=>{
              return <SelectItem key={item} value={item}>{item}</SelectItem>
            })
          }
        </SelectContent>
      </Select>
    )
  }