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
import { MdAdd } from 'react-icons/md'
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { v4 } from "uuid"

export function AddDailyQuiz({speciality}){
  const {toast} = useToast();
  const [question, setQuestion] = React.useState('')
  const [optionA, setOptionA] = React.useState('')
  const [optionB, setOptionB] = React.useState('')
  const [optionC, setOptionC] = React.useState('')
  const [optionD, setOptionD] = React.useState('')
  const [answer, setAnswer] = React.useState('')
  const [date, setDate] = React.useState(new Date().toDateString());
  const [submit, setSubmit] = React.useState(false);

  function reset(){
    setQuestion('')
    setOptionA('')
    setOptionB('')
    setOptionC('')
    setOptionD('')
    setAnswer('')
  }
  
  async function addQuiz(){
    if(question === '' || optionA === '' || optionB === '' || optionC === '' || optionD === '',answer===''){
      toast({
        title: 'Please fill all the fields',
        variant: 'destructive'
      })
      return;
    }
    setSubmit(true);
    await setDoc(doc(db, "PGupload", "Daily", "Quiz",v4()), {
      Question: question,
      A: optionA,
      B: optionB,
      C: optionC,
      D: optionD,
      Correct: answer,
      Date: date,
      speciality: speciality
    }).then(()=>{
      setSubmit(false);
      toast({
        title: 'Quiz Added',
      })
    });
    
  }

  return (
    <Dialog onOpenChange={reset}>
      <DialogTrigger asChild>
        <Button variant="secondary"><MdAdd className='scale-125 mr-2'/> Add Quiz</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Quiz</DialogTitle>
          <DialogDescription>
            Add a new quiz
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Question</Label>
              <Input id="name" value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="Type your question..." />
          </div>
          <div className='w-full grid grid-cols-2 gap-4'>
            <div className="flex flex-col space-y-2">
                <Label htmlFor="name">A</Label>
                <Input id="name" placeholder="Option A" value={optionA} onChange={(e)=>setOptionA(e.target.value)}/>
            </div>
            <div className="flex flex-col space-y-2">
                <Label htmlFor="name">B</Label>
                <Input id="name" placeholder="Option B" value={optionB} onChange={(e)=>setOptionB(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-2">
                <Label htmlFor="name">C</Label>
                <Input id="name" placeholder="Option C" value={optionC} onChange={(e)=>setOptionC(e.target.value)}/>
            </div>
            <div className="flex flex-col space-y-2">
                <Label htmlFor="name">D</Label>
                <Input id="name" placeholder="Option D" value={optionD} onChange={(e)=>setOptionD(e.target.value)} />
            </div>
          </div>
          <div className='flex justify-between'>
              <RadioGroup defaultValue="A" onValueChange={(val)=>setAnswer(val)}>
                Choose correct answer
                <div className='flex gap-x-3'>
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
              <div className="flex flex-col space-y-2 w-1/2">
                <Label htmlFor="name">Date</Label>
                <Input id="name" type="date" placeholder="Option D" onChange={(e)=>{
                  const date = new Date(e.target.value)
                  setDate(date.toDateString())
                }} />
              </div>

          </div>
        </div>
        <DialogFooter>
          <Button disabled={submit} onClick={addQuiz}>{submit?<><div className="scale-125 mr-3"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Adding..</>:"Submit Quiz"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}