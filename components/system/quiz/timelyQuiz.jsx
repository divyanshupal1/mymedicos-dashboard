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
import { MdAdd, MdDelete, MdDeleteOutline } from 'react-icons/md'
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { DatePickerWithRange } from "./datePicker"
import { v4 } from "uuid"

export function TimelyQuiz({speciality}){
  const {toast} = useToast();
  const [quizTitle, setQuizTitle] = React.useState('');
  const [data, setData] = React.useState([{Question: 'Loading...', A: 'Loading...', B: 'Loading...', C: 'Loading...', D: 'Loading...', Correct: 'Loading...',Description:""}]);
  const [date, setDate] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const [submit, setSubmit] = React.useState(false);
 
  function reset(){
    setData([{Question: '', A: '', B: '', C: '', D: '', Correct: 'A',Description:""}]);
    setCurrent(0);
    setSubmit(false);
  }
  function addQuestion(){
    if(data.length < 30){
        setData([...data, {Question: '', A: '', B: '', C: '', D: '', Correct: 'A',Description:""}]);
        setCurrent((prev)=>prev+1);
    }
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
    await setDoc(doc(db, "PGupload", "Weekley", "Quiz",v4()), {
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
    }).catch((e)=>{
        setSubmit(false);
    });
    
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary"><MdAdd className='scale-125 mr-2'/> Add Quiz</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>Add Quiz</DialogTitle>
          <DialogDescription>
            Add a new quiz
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 w-full">
            <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Quiz Title</Label>
                <Input id="name" value={quizTitle} onChange={(e)=>setQuizTitle(e.target.value)} placeholder="Title of Quiz" />
            </div>
            <div className="w-full flex flex-wrap  gap-x-1 gap-y-1 bg-secondary p-2 rounded-md">
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
                <Button disabled={submit} className={'w-full'} onClick={addQuiz}>{submit?<><div className="scale-125 mr-3"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Adding..</>:"Submit Quiz"}</Button>
            </div>         
                
         </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default function QuizComp({quiz, index,setQuiz}) {
  return (
    <>
    <div className="flex flex-col space-y-2">
        <Label htmlFor="name">Question</Label>
        <Input id="name" value={quiz.Question} onChange={(e)=>setQuiz(index,"Q",e.target.value)} placeholder="Type your question..." />
    </div>
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
        <RadioGroup className="w-full" defaultValue="A" onValueChange={(val)=>setQuiz(index,"Correct",val)}>
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
