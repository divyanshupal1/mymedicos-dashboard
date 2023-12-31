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
import { MdAdd ,MdEdit} from 'react-icons/md'
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { v4 } from "uuid"
import {IoCloudDone} from "react-icons/io5"
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export function AddDailyQuiz({speciality,edit,reload=()=>{},quiz,id}){

  const {toast} = useToast();
  const [question, setQuestion] = React.useState(quiz?quiz.Question:'')
  const [optionA, setOptionA] = React.useState(quiz?quiz.A:'')
  const [optionB, setOptionB] = React.useState(quiz?quiz.B:'')
  const [optionC, setOptionC] = React.useState(quiz?quiz.C:'')
  const [optionD, setOptionD] = React.useState(quiz?quiz.D:'')
  const [description, setDescription] = React.useState(quiz?quiz.Description:'')
  const [answer, setAnswer] = React.useState(quiz?quiz.Correct:'')
  const [thumbnail, setThumbnail] = React.useState(quiz?quiz.Thumbnail:null);
  const [thumbnailSubmitStatus, setThumbnailSubmitStatus] = React.useState(4);
  const [thumbnailSubmitProgress, setThumbnailSubmitProgress] = React.useState(0);
  const [date, setDate] = React.useState(quiz?new Date(quiz.Date):new Date());
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
    await setDoc(doc(db, "PGupload", "Daily", "Quiz",edit?id:v4()), {
      Question: question,
      A: optionA,
      B: optionB,
      C: optionC,
      D: optionD,
      Description:description,
      Thumbnail: thumbnail,
      Correct: answer,
      Date: date.toDateString(),
      speciality: quiz?quiz.speciality:speciality
    }).then(()=>{
      setSubmit(false);
      reload();
      toast({
        title: 'Quiz Added',
      })
    });
    
  }
  async function uploadThumbnail(e){

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
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setThumbnailSubmitStatus(1);
          setThumbnail(downloadURL);
        });
      }
    );
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
      {edit?
          <div className="inline p-1 rounded-md hover:bg-slate-300"><MdEdit className='scale-125'/></div>
          :
          <Button variant="secondary"><MdAdd className='scale-125 mr-2'/> Add Quiz</Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{edit?"Edit":"Add"} Quiz</DialogTitle>
          <DialogDescription>
          {edit?"Edit a quiz":"Add a new quiz"}  
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
              <RadioGroup defaultValue={quiz?quiz.Correct:"A"} onValueChange={(val)=>setAnswer(val)}>
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
              <div className="flex flex-col space-y-2 w-1/2 relative">
                <Label htmlFor="name">Date</Label>
                <Input id="date" value={date.toDateString()} onChange={()=>{}} />
                <Input id="name" type="date" placeholder="Option D" onChange={(e)=>{
                  console.log(e.target.value)
                  const date = new Date(e.target.value)
                  setDate(date)
                }} 
                className="absolute bottom-0 right-0  z-20 w-[40px] overflow-hidden"
                />
              </div>
          </div>
          <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Description</Label>
              <Input id="name" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description ..." />
          </div>
          <div className="flex flex-col space-y-2 relative">
                <Label htmlFor="price">Select Thumbnail</Label>
                <Input placeholder="image" value={thumbnail} readOnly />
                <Input id="price"
                 accept="image/png, image/jpeg"
                 onChange={(e)=>{
                  uploadThumbnail(e);
                 }}
                 className="absolute bottom-0 left-0 opacity-0 z-20"
                 type='file'
                />
                <div className="scale-125 absolute right-1.5 bottom-1.5  p-1 rounded bg-white dark:bg-slate-950">
                  {thumbnail && <IoCloudDone className="text-green-600 font-bold "/>}
                  {thumbnailSubmitStatus == 0 && thumbnail && <AiOutlineLoading3Quarters className="text-green-600 font-bold animate-spin"/>}
                 </div>
      </div>
        </div>
        <DialogFooter>
          <Button disabled={submit} onClick={addQuiz}>{submit?<><div className="scale-125 mr-3"><AiOutlineLoading3Quarters className="text-white animate-spin"/></div> Adding..</>:(edit?"Update Quiz":"Submit Quiz")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}