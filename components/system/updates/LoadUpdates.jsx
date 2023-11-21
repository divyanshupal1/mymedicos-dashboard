"use client"
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MdOutlineMoreVert } from "react-icons/md"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast";


export function UpdateCardGroup({docs,reload,state,uni}){
    return (
      <div className="view w-full h-full p-4  flex flex-wrap flex-row gap-4">
          {docs.map((doc,i) => <Card key={doc[0]} publication={doc[1]} id={doc[0]} reload={reload} state={state} uni={uni}/>)}
      </div>
    )
  }

  function Card({publication,id,reload,state,uni}){
    const {toast} = useToast();

    async function DeleteDoc(){
      if(!confirm("Are you sure you want to delete this Update?").valueOf()){
        return;
      }
      await deleteDoc(doc(db, "Updates",state,uni, id)).then(
        ()=>{
          reload();
          toast({
            variant: "success",
            title: "Update Deleted",
          })
        }
      ).catch(
        ()=>{
            alert("Error Deleting Update")
        }
      )
    }
    var date = new Date(publication.Time).toLocaleDateString()
    return (
      <div className="w-fit gap-x-6 flex  p-3 rounded-md overflow-hidden border-2 bg-slate-800 bg-opacity-10 relative">
        <div className="w-full min-w-[200px] h-48 rounded-md" style={{background:`url(${publication.thumbnail})`,backgroundSize:"cover"}}></div>
        <div className="w-full mt-4">
          <div className="text-base font-bold w-[206px] overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible">{publication.Title}</div>
          <div className="text-base ">{publication.Description}</div>
          <div className="text-base "><span className="font-bold">Action :</span> {publication.Action}</div>
          <div className="text-base"><span className="font-bold">Date :</span> {date}</div>
        </div>
        <div className="actions absolute bottom-0 right-0 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger><MdOutlineMoreVert className='scale-125'/></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={DeleteDoc}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  
  }