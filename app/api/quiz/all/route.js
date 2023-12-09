import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { NextResponse } from "next/server"
import { urlMerger } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const query1 = searchParams
    var speciality = query1.get('q')
    speciality = urlMerger(speciality)
    var  data = []
    const q = query(collection(db, "PGupload", "Weekley", "Quiz"),where('speciality','==',speciality));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {        
        data.push(doc.data())          
    });
    return new NextResponse(JSON.stringify({status:"success",data:data}),{status: 200, headers: { 'Content-Type': 'application/json' }})  
}