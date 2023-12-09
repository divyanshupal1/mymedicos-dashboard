import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { NextResponse } from "next/server"
import { Timestamp } from "firebase/firestore";
import { urlMerger } from "@/lib/utils";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const query1 = searchParams
    var speciality = query1.get('q')
    speciality = urlMerger(speciality)
    var  data = []
    var time_stamp = Timestamp.fromDate(new Date());  
    const q = query(collection(db, "PGupload", "Weekley", "Quiz"), where("to", ">=", time_stamp),where('speciality','==',speciality));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        var from = new Timestamp(doc.data().from.seconds,0);
        if(from.seconds<=time_stamp.seconds){
            data.push(doc.data())
        }      
    });
    return new NextResponse(JSON.stringify({status:"success",data:data}),{status: 200, headers: { 'Content-Type': 'application/json' }}) ;
}