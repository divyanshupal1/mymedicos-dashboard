import admin from "@/lib/firebase-admin";
import { urlMerger } from "@/lib/utils";
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req,{params}) {
    var type = params.type;
    var data = undefined;
    var speciality = urlMerger(params.type[0])
    if(speciality == "all"){
        await admin.firestore().collection("Publications").get()
        .then((querySnapshot) => {
            data = [];
            querySnapshot.forEach((doc) => {
                var docData = doc.data();
                var temp = {id:doc.id,data:{...docData,URL:""}};
                data.push(temp);
            });
        })
    }
    else if(type.length == 1 && speciality != "all"){
        await admin.firestore().collection("Publications").where('Subject','==',speciality).get()
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
        await admin.firestore().collection("Publications").where('Subject','==',speciality).where('Category','==',type[1]).get()
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