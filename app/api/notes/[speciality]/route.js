import { urlMerger } from "@/lib/utils";
import admin from "@/lib/firebase-admin";
export const dynamic = 'force-dynamic'
export async function GET(Request,{params}){  
        var speciality = params.speciality
        speciality = urlMerger(speciality)
        var temp = []
        const db = admin.firestore();        
        const querySnapshot = await db.collection("PGupload/Notes/Note").where('speciality','==',speciality).get()
        querySnapshot.forEach((doc) => {
             temp = [...temp,doc.data()]
        });  
        return new Response(JSON.stringify({status:"success",data:temp}))
}
