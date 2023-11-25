import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase";

export async function GET(req,{params}) { 
    
    const {id} = params
    const orderId = id[0];
    const docRef = doc(db, "Orders", orderId);
    const docSnap = await getDoc(docRef)
    const order = docSnap.data();
    const userRef = doc(db, "users", order.user);
    const userSnap = await getDoc(userRef)
    const user = userSnap.data();
    order.user = user;
    return new Response(JSON.stringify(order));      

}