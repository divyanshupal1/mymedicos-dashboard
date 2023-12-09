import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { NextResponse } from "next/server"
import { urlMerger } from "@/lib/utils";

export const dynamic = 'force-dynamic'

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const query1 = searchParams
    var speciality = query1.get('q')
    speciality = urlMerger(speciality)
    console.log(speciality)
    var  data = []
    var today = new Date().toDateString();
    const q = query(collection(db, "PGupload", "Daily", "Quiz"), where("Date", "==", today),where("speciality", "==",speciality));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(),id:doc.id})
    });

    return new NextResponse(JSON.stringify({status:"success",data:data}),{status: 200, headers: { 'Content-Type': 'application/json' }})  
}

