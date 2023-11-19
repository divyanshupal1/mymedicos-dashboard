import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { NextResponse } from "next/server"
import { Timestamp } from "firebase/firestore";

export async function GET(req) {
    var  data = []
    const q = query(collection(db, "PGupload", "Weekley", "Quiz"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {        
        data.push(doc.data())          
    });
    return new NextResponse(JSON.stringify({status:"success",data:data}),{status: 200, headers: { 'Content-Type': 'application/json' }})  
}