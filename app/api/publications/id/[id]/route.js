import admin from "@/lib/firebase-admin"

export async function GET(req,{params}) {
    const db = admin.firestore();
    const {id} = params
    const docRef = await db.collection("Publications").doc(id).get();
    const data = docRef.data();
    data.URL = "";
    return new Response(JSON.stringify({"status":"success","data":data}))
}