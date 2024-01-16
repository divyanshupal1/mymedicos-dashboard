import { db} from "@/lib/firebase"
import { urlMerger } from "@/lib/utils";
import {getDocs,collection} from "firebase/firestore"; 
import admin from "@/lib/firebase-admin";
export const dynamic = 'force-dynamic'
export async function GET(Request,{params}){   
        // var speciality = params.speciality
        var speciality = 'Anatomy'
        speciality = urlMerger(speciality)
        var temp = []
        // const querySnapshot = await getDocs(collection(db, "SlideShow",speciality));
        const querySnapshot = await admin.firestore().collection("SlideShow",speciality).get();
        console.log(querySnapshot.docs.length)
        querySnapshot.forEach((doc) => {
             temp = [...temp,doc.data()]
        });  
        return new Response(JSON.stringify({status:"success",data:temp}))
}