import { db} from "@/lib/firebase"
import { doc,getDoc,getDocs,collection} from "firebase/firestore"; 
export const dynamic = 'force-dynamic'
export async function GET(Request){   
        var temp = []
        const querySnapshot = await getDocs(collection(db, "PGupload","Videos","Video"));
        querySnapshot.forEach((doc) => {
             temp = [...temp,doc.data()]
        });  
        return new Response(JSON.stringify({status:"success",data:temp}))
}
