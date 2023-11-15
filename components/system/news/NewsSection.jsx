"use client"
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";


export function NewsGroup({docs,reload}){
    return (
      <div className="view w-full h-full p-4 gap-4">
          {docs.map((doc,i) => <NewsCard key={doc[0]} item={doc[1]} id={doc[0]} reload={reload}/>)}
      </div>
    )
}
  
export function NewsCard({item,id,reload}){

  const {toast} = useToast();
  async function DeleteDoc(){
    if(!confirm("Are you sure you want to delete this News?").valueOf()){
      return;
    }
    try{
      deleteDoc(doc(db, "MedicalNews", id)).then(() => {
        toast({
          variant: "success",
          title: "News Deleted",
        })
        reload();
      })        
    }
    catch(e){
      toast({
        variant: "destructive",
        title: "Error Deleting News",
      })
    }
  }
  let date = new Date(item.Time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="w-full ">
        <div className="w-full flex justify-between py-5 rounded-md max-sm:flex-col-reverse max-sm:gap-y-3 gap-x-4">
          <div className="news-content flex flex-col gap-y-3">
            <div className="w-fit border-2 px-3 py-1 rounded-full font-semibold">{date}</div>
            <div className="content">
              <h2 className="text-xl font-bold">{item.Title}</h2>
              <p>{item.Description }</p>                     
            </div>
            <div className=" flex gap-6">
              <a href={item.URL}>
                <div className="continue  w-fit bg-secondary px-4 py-1 rounded-full font-semibold cursor-pointer"> Open</div>
              </a>
              <div className="continue bg-red-500 text-white w-fit px-4 py-1 rounded-full font-semibold cursor-pointer" onClick={DeleteDoc}> Delete</div>
            </div>
          </div>
          <div className="image rounded-md overflow-hidden w-full md:w-1/4 max-sm:h-[calc(100vh/4)] max-sm:min-h-[150px] drop-shadow-md  min-w-[300px]" style={{background:`url(${item.thumbnail})`,backgroundPosition:"center top",backgroundSize:"cover",backgroundRepeat:"no-repeat"}}></div>
        </div>

        <div className="separator w-full flex gap-x-1  overflow-hidden">
          {
            Array(160).fill().map((_,i)=>(
              <div className="w-1 h-2 bg-gray-700 shrink-0" key={i}></div>
            ))
          }
        </div>
    </div>
  )
}
