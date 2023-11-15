import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { NextResponse } from "next/server"

export async function GET(req) {
    var  data = []
    var today = new Date().toDateString();
    const q = query(collection(db, "PGupload", "Daily", "Quiz"), where("Date", "==", today));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data = doc.data()
    });

    return new NextResponse(JSON.stringify(data),{status: 200, headers: { 'Content-Type': 'application/json' }})  

}