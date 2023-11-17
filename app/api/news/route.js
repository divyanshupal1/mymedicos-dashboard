import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { NextResponse } from "next/server"


export async function GET(req) {
    var data=[];
    var q = query(collection(db, "MedicalNews"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return new NextResponse(JSON.stringify(data),{status: 200, headers: { 'Content-Type': 'application/json' }}) ;
}