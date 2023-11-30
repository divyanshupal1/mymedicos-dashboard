import admin from "@/lib/firebase-admin";
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req,{params}) {
    var type = params.type;
    var data = undefined;

    if(type.length == 1){
        await admin.firestore().collection("Publications").where('Subject','==',type[0]).get()
        .then((querySnapshot) => {
            data = [];
            querySnapshot.forEach((doc) => {
                var docData = doc.data();
                var temp = {id:doc.id,data:{...docData,URL:""}};
                data.push(temp);
            });
        })  
    }
    else{
        await admin.firestore().collection("Publications").where('Subject','==',type[0]).where('Category','==',type[1]).get()
        .then((querySnapshot) => {
            data = [];
            querySnapshot.forEach((doc) => {
                var docData = doc.data();
                var temp = {id:doc.id,data:{...docData,URL:""}};
                data.push(temp);
            });
        })
    }   
    
    return new NextResponse(JSON.stringify({status:"success",data:data}),{status: 200, headers: { 'Content-Type': 'application/json' }}) ;
}