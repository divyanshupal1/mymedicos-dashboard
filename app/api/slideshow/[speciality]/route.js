import { db} from "@/lib/firebase"
import { urlMerger } from "@/lib/utils";
import {getDocs,collection} from "firebase/firestore"; 
export const dynamic = 'force-dynamic'
export async function GET(Request,{params}){   
        var speciality = params.speciality
        speciality = urlMerger(speciality)
        var temp = []
        const querySnapshot = await getDocs(collection(db, "SlideShow"));
        querySnapshot.forEach((doc) => {
             temp = [...temp,doc.data()]
        });  
        return new Response(JSON.stringify({status:"success",data:temp}))
}