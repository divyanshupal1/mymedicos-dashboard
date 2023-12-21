import admin from "@/lib/firebase-admin";
export const dynamic = 'force-dynamic'
export async function GET(){
    const db = admin.firestore();
    const docRef = await db.collection("Categories").doc("39liVyLEjII6dtzolxSZ").get();
    const data = docRef.data() 
    const temp = Object.keys(data)
    const result = temp.map((item) => {
        return {id: item, priority: data[item]}
    })
    return new Response(JSON.stringify({"status":"success","data":result }))
}