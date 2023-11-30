import admin from "@/lib/firebase-admin";
import { urlMerger } from "@/lib/utils";
export const dynamic = 'force-dynamic'
export async function GET(Request,{params}){   
        var speciality = params.speciality
        speciality = urlMerger(speciality)
        var temp = []
        const db = admin.firestore();        
        const querySnapshot = await db.collection("PGupload/Videos/Video").where('speciality','==',speciality).get()
        querySnapshot.forEach((doc) => {
             temp = [...temp,doc.data()]
        });  
        return new Response(JSON.stringify({status:"success",data:temp}))
}
