"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MdAdd, MdDelete, MdDeleteOutline, MdEdit } from 'react-icons/md'
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { DatePickerWithRange } from "./datePicker"
import { v4 } from "uuid"

export function TimelyQuiz({edit,speciality,quiz,id,reload=()=>{}}){
  const {toast} = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false)

  const [quizTitle, setQuizTitle] = React.useState(quiz?quiz.title:'');
  const [data, setData] = React.useState(quiz?quiz.Data:[{Question: '', A: '', B: '', C: '', D: '', Correct: '',Description:"",Image:null,id:v4()}]);
  const [date, setDate] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [submit, setSubmit] = React.useState(false);
 
  function reset(){
    setData(quiz?quiz.Data:[{Question: '', A: '', B: '', C: '', D: '', Correct: 'A',Description:"",Image:null,id:v4()}]);
    setCurrent(0);
    setSubmit(false);
  }
  function addQuestion(){
    setData([...data, {Question: '', A: '', B: '', C: '', D: '', Correct: 'A',Description:"",Image:null,id:v4()}]);
    setCurrent((prev)=>prev+1);
  }
  function setQuiz(index,field,value){
    const newData = [...data];
    if(field === 'Q'){
        newData[index].Question = value;
    }
    if(field === 'A'){
        newData[index].A = value;
    }
    if(field === 'B'){
        newData[index].B = value;
    }
    if(field === 'C'){
        newData[index].C = value;
    }
    if(field === 'D'){
        newData[index].D = value;
    }
    if(field === 'Correct'){
        newData[index].Correct = value;
    }
    if(field === 'Description'){
        newData[index].Description = value;
    }
    if(field === 'Image'){
        newData[index].Image = value;
    }
    setData(newData);
  }
  function deleteQuestion(index){
    if(data.length === 1){
        return
    }
    const newData = [...data];
    newData.splice(index,1);
    setCurrent(0);
    setData(newData);
    
  }
  
  async function addQuiz(){
    
    setSubmit(true);
    await setDoc(doc(db, "PGupload", "Weekley", "Quiz",id?id:v4()), {
      title: quizTitle,
      Data:data,
      from: date.from,
      to: date.to,
      speciality: speciality,
    }).then(()=>{
      setSubmit(false);
      toast({
        title: 'Quiz Added',
      })
      reset();
      setDialogOpen(false);
      reload();
    }).catch((e)=>{
        setSubmit(false);
    });
    
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger asChild onClick={()=>setDialogOpen(!dialogOpen)}>
        {edit?
          <div className="inline p-1 rounded-md hover:bg-slate-300"><MdEdit className='scale-125'/></div>
          :
          <Button variant="secondary"><MdAdd className='scale-125 mr-2'/> Add Quiz</Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader className={" relative"}>
          <DialogTitle>{edit?"Edit":"Add"} Quiz</DialogTitle>
          <DialogDescription>
          {edit?"Edit a quiz":"Add a new quiz"}  
          </DialogDescription>
          <Button variant="secondary" onClick={()=>setDialogOpen(false)} className="absolute top-[-20px] right-[-15px] z-50 rounded-full">X</Button>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-full">
            <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Quiz Title</Label>
                <Input id="name" value={quizTitle} onChange={(e)=>setQuizTitle(e.target.value)} placeholder="Title of Quiz" />
            </div>
            <div className="w-full flex flex-wrap  gap-x-1 gap-y-1 bg-secondary p-2 rounded-md max-h-24 overflow-y-scroll">
                {data.map((item, index)=><div key={index} className={`w-7 h-7 flex justify-center items-center rounded-full cursor-pointer ${current==index?"bg-primary":""}`} tabIndex={index} onClick={()=>setCurrent(index)} >{index+1}</div>)}
            </div>
            <div className="w-full mt-3">
                <QuizComp quiz={data[current]} index={current} setQuiz={setQuiz}/>
            </div>
            <div className="w-full flex gap-x-5 ">
                <Button variant="outline" className=" w-1/2 bg-secondary" onClick={reset}>Reset Quiz</Button>
                <Button variant="outline" className=" w-1/2 bg-secondary" onClick={()=>deleteQuestion(current)}><MdDeleteOutline className="scale-125 mr-3"/>Question {current+1}</Button>
                <Button onClick={addQuestion} className="w-1/2 gap-x-2"><MdAdd className="scale-125"/>Question</Button> 
            </div>
            
        </div>
        <DialogFooter>      
            <div className="w-full gap-x-3 flex justify-between items-end">
                <div className="w-full"><Label>Select Date Range :</Label><DatePickerWithRange setNewDate={setDate} className={"w-full"}/></div>
                <Button disabled={submit} className={'w-full'} onClick={addQuiz}>{submit?<><div className="scale-125 mr-3"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Adding..</>:(edit?"Update Quiz":"Submit Quiz")}</Button>
            </div>         
                
         </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
import {IoCloudDone} from "react-icons/io5"
import { useState } from "react";
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export default function QuizComp({quiz, index,setQuiz}) {

  const fileInputRef = React.useRef(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailSubmitStatus, setThumbnailSubmitStatus] = useState(4);
  const [thumbnailSubmitProgress, setThumbnailSubmitProgress] = useState(0);

  React.useEffect(()=>{
    setThumbnailSubmitStatus(4)
    setThumbnail(null)
  },[index])

  async function uploadThumbnail(e){
    // console.log("uploading")
    console.log(e.target.files)
    setThumbnail((prev)=>e.target.files[0]);
    setThumbnailSubmitStatus(0);
    if(e.target.files[0].type != "image/png" && e.target.files[0].type != "image/jpeg"){
      setThumbnailSubmitStatus(3);
      return;
    }
    const storageRef = ref(storage, 'Quiz/thumbnails/'+v4()+e.target.files[0].name);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setThumbnailSubmitProgress(progress);
      }, 
      (error) => {
        setThumbnailSubmitStatus(2);
        // console.log(e)
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setThumbnailSubmitStatus(1);
          setQuiz(index,"Image",downloadURL);
          fileInputRef.current.value = "";
        });
      }
    );
    fileInputRef.current.value = "";
    setThumbnail(null)
  }

  return (
    <>
    <div className="w-full flex gap-x-3">
      <div className="flex flex-col space-y-2 w-2/3">
          <Label htmlFor="name">Question</Label>
          <Input id="name" value={quiz.Question} onChange={(e)=>setQuiz(index,"Q",e.target.value)} placeholder="Type your question..." />
      </div>
      <div className="flex flex-col space-y-2 relative">
                <Label htmlFor="price">Select Thumbnail</Label>
                <Input placeholder="image" value={quiz.Image} readOnly />
                <Input id="price"
                 accept="image/png, image/jpeg"
                 onChange={(e)=>{
                  uploadThumbnail(e);
                  alert("Uploading Thumbnail")
                 }}
                 ref={fileInputRef}
                 className="absolute bottom-0 left-0 opacity-0 z-20"
                 type='file'
                />
                <div className="scale-125 absolute right-1.5 bottom-1.5  p-1 rounded bg-white dark:bg-slate-950">
                  {quiz.Image && <IoCloudDone className="text-green-600 font-bold "/>}
                  {thumbnailSubmitStatus == 0 && thumbnail && <AiOutlineLoading3Quarters className="text-green-600 font-bold animate-spin"/>}
                 </div>
      </div>
    </div>
    {/* <div className="flex flex-col space-y-2">
        <Label htmlFor="name">Question</Label>
        <Input id="name" value={quiz.Question} onChange={(e)=>setQuiz(index,"Q",e.target.value)} placeholder="Type your question..." />
    </div> */}
    <div className='w-full grid grid-cols-2 gap-4 mt-3'>
        <div className="flex flex-col space-y-2">
            <Label htmlFor="name">A</Label>
            <Input id="name" placeholder="Option A" value={quiz.A} onChange={(e)=>setQuiz(index,"A",e.target.value)}/>
        </div>
        <div className="flex flex-col space-y-2">
            <Label htmlFor="name">B</Label>
            <Input id="name" placeholder="Option B" value={quiz.B} onChange={(e)=>setQuiz(index,"B",e.target.value)} />
        </div>
        <div className="flex flex-col space-y-2">
            <Label htmlFor="name">C</Label>
            <Input id="name" placeholder="Option C" value={quiz.C} onChange={(e)=>setQuiz(index,"C",e.target.value)}/>
        </div>
        <div className="flex flex-col space-y-2">
            <Label htmlFor="name">D</Label>
            <Input id="name" placeholder="Option D" value={quiz.D} onChange={(e)=>setQuiz(index,"D",e.target.value)} />
        </div>
    </div>
    <div className='flex justify-between mt-2 gap-x-3'>
        <RadioGroup className="w-full" defaultValue="A" value={quiz.Correct} onValueChange={(val)=>setQuiz(index,"Correct",val)}>
        Choose correct answer
        <div className='flex gap-x-3 w-full'>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="A" id="option-one" />
                <Label htmlFor="">A</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="B" id="option-two" />
                <Label htmlFor="option-two">B</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="C" id="option-three" />
                <Label htmlFor="option-three">C</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="D" id="option-four" />
                <Label htmlFor="option-four">D</Label>
            </div>
        </div>
        </RadioGroup>
        <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="name">Description</Label>
            <Input id="name" placeholder="Description" value={quiz.Description} onChange={(e)=>setQuiz(index,"Description",e.target.value)} />
        </div>


     </div>
    </>
  )
}
