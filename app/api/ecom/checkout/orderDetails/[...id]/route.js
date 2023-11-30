import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase";
import admin from "@/lib/firebase-admin";

export async function GET(req,{params}) { 
    const db = admin.firestore();
    const {id} = params
    const orderId = id[0];
    const docSnap = await db.collection('Orders').doc(orderId).get() ;
    const order = docSnap.data();
    const userSnap = await db.collection('users').where('UID','==',order.user).get();
    const user = userSnap.docs[0].data();
    order.user = {
        name: user.Name,
        email: user["Email ID"],
        phone: user["Phone Number"],
    
    };
    return new Response(JSON.stringify(order));      

}