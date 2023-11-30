import admin from "@/lib/firebase-admin";
export const dynamic = 'force-dynamic'
export async function GET(Request,{params}){   
        var temp = []
        const db = admin.firestore();        
        const querySnapshot = await db.collection("PGupload/Videos/Video").where('speciality','==',params.speciality).get()
        querySnapshot.forEach((doc) => {
             temp = [...temp,doc.data()]
        });  
        return new Response(JSON.stringify({status:"success",data:temp}))
}
