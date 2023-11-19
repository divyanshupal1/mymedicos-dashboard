import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { NextResponse } from "next/server"


export async function GET(req,{params}) {
    var type = params.type;
    var data=[];
    var q;
    if(type=="all"){
        q=query(collection(db, "Publications"));
    }
    if(type=='free'){
        q=query(collection(db, "Publications"), where("Category", "==", "FREE"));
    }
    if(type=='paid'){
        q=query(collection(db, "Publications"), where("Category", "==", "PAID"));
    }
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        var temp = {id:doc.id,data:doc.data()};
        data.push(temp);
    });
    return new NextResponse(JSON.stringify({status:"success",data:data}),{status: 200, headers: { 'Content-Type': 'application/json' }}) ;
}