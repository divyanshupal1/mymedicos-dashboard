import admin from "@/lib/firebase-admin";
export async function GET(){
    const db = admin.firestore();
    const docRef = await db.collection("Categories").doc("s7hdqLUEkfyVJJ6cfbeW").get();
    const data = docRef.data() 
    const temp = Object.keys(data)
    const result = temp.map((item) => {
        return {id: item, priority: data[item]}
    })
    return new Response(JSON.stringify({"status":"success","data":result }))
}