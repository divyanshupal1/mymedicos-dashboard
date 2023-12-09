"use client"
import React from 'react'
import { MdOutlineMoreVert } from "react-icons/md"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc,doc, deleteDoc,getDocs} from "firebase/firestore"; 
import { Button } from '@/components/ui/button';

function Ugcards() {
    const [data, setData] = React.useState([]);
    const [view, setView] = React.useState(false);
    async function fetchdata(){
        const querySnapshot = await getDocs(collection(db, "UG"));
        var temp = []
        querySnapshot.forEach((doc) => {
        temp = [...temp,[doc.id,doc.data()]];
        });
        setData(temp);
    }
    async function fetchdataView(){
        const querySnapshot = await getDocs(collection(db, "UGConfirm"));
        var temp = []
        querySnapshot.forEach((doc) => {
        temp = [...temp,[doc.id,doc.data()]];
        });
        setData(temp);
    }
    React.useEffect(() => {
        view?fetchdataView():fetchdata();
    }, [view])
  return (
    <>
    <div className='w-full flex justify-end items-center p-3 relative '><div className='font-bold left-1/2 -translate-x-1/2 absolute'>{!view?"Pending Uploads":"Confirmed Uploads"}</div><Button variant="secondary" onClick={()=>setView(!view)}>{view?"View Pending":"View Confirmed"}</Button></div>
    <div className="view w-full p-4  flex flex-wrap flex-row gap-4">
          {data.map((doc,i) => {
            if(view) return <ViewCard publication={doc[1]} key={doc[0]} id={doc[0]} reload={fetchdataView}/>;
            else return <Card key={doc[0]} publication={doc[1]} id={doc[0]} reload={fetchdata}/>
          })}
    </div></>
  )
}

export default Ugcards


function Card({publication,id,reload}){
    const {toast} = useToast();

    async function confirmDoc(){
      if(!confirm("Confirm ?").valueOf()){
        return;
      }
      await addDoc(collection(db,"UGConfirm"), publication)
      .then(
        await deleteDoc(doc(db, "UG", id))
      )
      .then(
        ()=>{
          reload();
          toast({
            variant: "success",
            title: "Confirmed",
          })
        }
      ).catch(
        ()=>alert("Error Confirming")
      );      
    }
    async function DeleteDoc(){
        if(!confirm("Reject ?").valueOf()){
            return;
        }
        await deleteDoc(doc(db, "UG", id))
        .then(
            ()=>{
            reload();
            toast({
                title: "Rejected",
            })
            }
        ).catch(
            ()=>alert("Error Rejecting")
        );
    }

    return (
      <div className=" w-1/3 p-3 rounded-md overflow-hidden border-2 bg-slate-800 bg-opacity-10 relative">
       
        <div className="w-full flex flex-col gap-y-3">
          <div className="text-base w-[206px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible"> UG Title : {publication["UG Title"]}</div>
          <div className="text-base ">UG Organiser : {publication["UG Organiser"]}</div>
          <div className="text-base ">UG Description : {publication["UG Description"]}</div>
          <div className="text-base ">Speciality : {publication["Speciality"]}</div>
          <div className="text-base ">Subspeciality : {publication["SubSpeciality"]}</div>
          <div className="text-base ">Date : {publication["Date"]}</div>
          <div className="text-base">Time : {publication["Time"]}</div>
          <div className="text-base">User : {publication["User"]}</div>
        </div>
        <div className="actions absolute top-0 right-0 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger><MdOutlineMoreVert className='scale-125'/></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={confirmDoc}>Confirm</DropdownMenuItem>
              <DropdownMenuItem onClick={DeleteDoc}>Reject</DropdownMenuItem>
              {/* <DropdownMenuItem onClick={()=>document.location = (publication.URL)}>Open</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  
  }
function ViewCard({publication,id,reload}){
    async function DeleteDoc(){
        if(!confirm("Reject ?").valueOf()){
            return;
        }
        await deleteDoc(doc(db, "UGConfirm", id)).then(
            ()=>{
            toast({
                title: "Deleted",
            })
            reload();
            }
        ).catch(
            ()=>alert("Error Deleting")
        );
    }
    return (
        <div className=" w-1/3 p-3 rounded-md overflow-hidden border-2 bg-slate-800 bg-opacity-10 relative">       
            <div className="w-full flex flex-col gap-y-3">
            <div className="text-base w-[206px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible"> UG Title : {publication["UG Title"]}</div>
            <div className="text-base ">UG Organiser : {publication["UG Organiser"]}</div>
            <div className="text-base ">UG Description : {publication["UG Description"]}</div>
            <div className="text-base ">Speciality : {publication["Speciality"]}</div>
            <div className="text-base ">Subspeciality : {publication["SubSpeciality"]}</div>
            <div className="text-base ">Date : {publication["Date"]}</div>
            <div className="text-base">Time : {publication["Time"]}</div>
            <div className="text-base">User : {publication["User"]}</div>
            </div>
            <div className="actions absolute top-0 right-0 p-3">
            <DropdownMenu>
                <DropdownMenuTrigger><MdOutlineMoreVert className='scale-125'/></DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuItem onClick={DeleteDoc}>Delete</DropdownMenuItem>
                {/* <DropdownMenuItem onClick={()=>document.location = (publication.URL)}>Open</DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </div>
    )
}