import admin from "@/lib/firebase-admin"
import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic'

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const query1 = searchParams
    const userID = query1.get('id')
    const qid = query1.get('qid')
    const option = query1.get('option')
    console.log(userID,option)

    const firestore = admin.firestore();

    const userDoc =await firestore.collection('users').doc(userID).get()
    const userData = userDoc.data();

    var today = new Date().toDateString();
    const quizDoc = await firestore.collection('PGupload/Daily/Quiz').doc(qid).get()
    const quizData = quizDoc.data();

    if(today!=quizData.Date || userData.QuizToday.includes(qid)){
        return new NextResponse(JSON.stringify({status:"error",message:"submission not allowed"}),{status: 200, headers: { 'Content-Type': 'application/json' }})  
    }

    var flag= option===quizData.Correct?true:false;
    if(flag==true){
        await firestore.collection('users').doc(userID).update({
            Streak:userData.Streak+1,
            QuizToday:qid
        })
    }
    if(flag==false){
        await firestore.collection('users').doc(userID).update({
            Streak:0,
            QuizToday:qid
        }) 
    }
       
    return new NextResponse(JSON.stringify({status:"success",message:"submission done!"}),{status: 200, headers: { 'Content-Type': 'application/json' }})  
}

