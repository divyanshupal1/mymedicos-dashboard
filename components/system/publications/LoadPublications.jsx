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


export function CardGroup({docs,reload}){
    return (
      <div className="view w-full h-full p-4  flex flex-wrap flex-row gap-4">
          {docs.map((doc,i) => <Card key={doc[0]} publication={doc[1]} id={doc[0]} reload={reload}/>)}
      </div>
    )
  }

  function Card({publication,id,reload}){
    const {toast} = useToast();

    async function DeleteDoc(){
      if(!confirm("Are you sure you want to delete this publication?").valueOf()){
        return;
      }
      await deleteDoc(doc(db, "Publications", id)).then(
        ()=>{
          reload();
          toast({
            variant: "success",
            title: "Publication Deleted",
          })
        }
      ).catch(()=>
        alert("Error Deleting Publication")
      )
    }
    var date = new Date(publication.Time).toLocaleDateString()
    return (
      <div className="w-[250px]  p-3 rounded-md overflow-hidden border-2 bg-slate-800 bg-opacity-10 relative">
        <div className="w-full h-48 rounded-md" style={{background:`url(${publication.thumbnail})`,backgroundSize:"cover"}}></div>
        <div className="w-full mt-4 relative">
          <div className="text-base w-[250px] overflow-hidden whitespace-nowrap text-ellipsis  hover:overflow-visible hover:relative"><p className="font-semibold inline">Title</p> : {publication.Title}</div>
          <div className="text-base "><p className="font-semibold inline">Author</p> : {publication.Author}</div>
          <div className="text-base "><p className="font-semibold inline">Category</p> : {publication.Category}</div>
          <div className="text-base "><p className="font-semibold inline">Subject</p> : {publication.Subject}</div>
          <div className="text-base "><p className="font-semibold inline">Type</p> : {publication.Type}</div>
          <div className="text-base "><p className="font-semibold inline">Price</p> : {publication.Price}</div>
          <div className="text-base"><p className="font-semibold inline">Date</p> : {date}</div>
        </div>
        <div className="actions absolute bottom-0 right-0 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger><MdOutlineMoreVert className='scale-125'/></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={DeleteDoc}>Delete</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>document.location = (publication.URL)}>Open</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  
  }